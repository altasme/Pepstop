import type { Env } from "./types";

export const now = () => new Date().toISOString();
export const uid = () => crypto.randomUUID().replace(/-/g, "");

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
}
export const err = (status: number, error: string, extra: object = {}) => json({ error, ...extra }, status);

const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));

export async function sha256(s: string) { return hex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }

/** PBKDF2-SHA256 at 100,000 iterations, the maximum the Workers runtime allows. Argon2id and bcrypt are not available natively. */
const ITER = 100000;
async function pbkdf2(pw: string, salt: Uint8Array, iter: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iter }, key, 256));
}
export async function hashPassword(pw: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITER}$${hex(salt)}$${await pbkdf2(pw, salt, ITER)}`;
}
export async function verifyPassword(pw: string, stored: string) {
  const [, it, salt, h] = stored.split("$");
  const got = await pbkdf2(pw, unhex(salt), Number(it));
  if (got.length !== h.length) return false;
  let d = 0;
  for (let i = 0; i < h.length; i++) d |= got.charCodeAt(i) ^ h.charCodeAt(i);
  return d === 0;
}

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
export const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
export const intOrNull = (v: unknown) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Math.max(0, Math.round(Number(v))));

/** Allow-list HTML sanitizer for the rich-text editor. Drops everything except simple formatting tags. */
const TAGS = new Set(["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br", "table", "thead", "tbody", "tr", "th", "td"]);
export function sanitizeHtml(html: string): string {
  let s = String(html ?? "").slice(0, 100000);
  s = s.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|iframe|object|embed|svg|math)[\s\S]*?<\/\1\s*>/gi, "");
  s = s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (m, tag: string, attrs: string) => {
    const t = tag.toLowerCase();
    if (!TAGS.has(t)) return "";
    if (m.startsWith("</")) return `</${t}>`;
    if (t === "a") {
      const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      const url = (href?.[2] ?? href?.[3] ?? "").trim();
      return /^(https?:\/\/|mailto:)/i.test(url) ? `<a href="${url.replace(/"/g, "&quot;")}" rel="noopener noreferrer" target="_blank">` : "<a>";
    }
    return `<${t}>`;
  });
  return s.replace(/<(?![/a-zA-Z])/g, "&lt;");
}

/** File type by magic bytes, never by the client's claimed type. */
export function sniff(b: Uint8Array): { ext: string; mime: string } | null {
  const is = (...x: number[]) => x.every((v, i) => b[i] === v);
  if (is(0x25, 0x50, 0x44, 0x46)) return { ext: "pdf", mime: "application/pdf" };
  if (is(0x89, 0x50, 0x4e, 0x47)) return { ext: "png", mime: "image/png" };
  if (is(0xff, 0xd8, 0xff)) return { ext: "jpg", mime: "image/jpeg" };
  if (is(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { ext: "webp", mime: "image/webp" };
  return null;
}

export const ip = (req: Request) => req.headers.get("cf-connecting-ip") ?? "unknown";

/** Fixed-window rate limit in D1. Returns true when the call is allowed. */
export async function rateLimit(env: Env, bucket: string, max: number, windowSec: number): Promise<boolean> {
  const t = Date.now();
  const row = await env.DB.prepare("SELECT count, window_start FROM rate_limits WHERE bucket=?").bind(bucket).first<{ count: number; window_start: string }>();
  if (!row || t - Date.parse(row.window_start) > windowSec * 1000) {
    await env.DB.prepare("INSERT INTO rate_limits (bucket,count,window_start) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=1, window_start=excluded.window_start").bind(bucket, new Date(t).toISOString()).run();
    return true;
  }
  if (row.count >= max) return false;
  await env.DB.prepare("UPDATE rate_limits SET count=count+1 WHERE bucket=?").bind(bucket).run();
  return true;
}

export async function log(env: Env, who: { id?: string; username?: string } | null, action: string, entity: string | null, entityId: string | null, detail: unknown, ipAddr: string) {
  await env.DB.prepare("INSERT INTO admin_activity_logs (id,at,admin_id,username,action,entity,entity_id,detail,ip) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(uid(), now(), who?.id ?? null, who?.username ?? null, action, entity, entityId, detail === undefined ? null : JSON.stringify(detail).slice(0, 2000), ipAddr).run();
}

export async function getSettings(env: Env): Promise<Record<string, string>> {
  const rows = await env.DB.prepare("SELECT key,value FROM site_settings").all<{ key: string; value: string }>();
  return Object.fromEntries(rows.results.map((r) => [r.key, r.value]));
}
