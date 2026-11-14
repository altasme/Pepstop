import type { Env } from "./types";
import { clip, err, getSettings, ip, json, now, rateLimit, uid } from "./lib";
import { currentCustomer } from "./customer";
import { currentAdmin } from "./admin";

const cache = (s: number) => ({ "cache-control": `public, max-age=${s}, stale-while-revalidate=${s * 5}` });

/** Public API. Nothing here exposes the private catalog, product images or documents. */
export async function handlePublic(req: Request, env: Env, url: URL): Promise<Response> {
  const seg = url.pathname.replace(/^\/api\/public\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const m = req.method;
  if (m === "GET" && seg[0] === "content") return content(env);
  if (m === "GET" && seg[0] === "articles") return articles(env, seg[1]);
  if (m === "GET" && seg[0] === "registration-info") return registrationInfo(env);
  if (m === "POST" && seg[0] === "inquiries") return inquiry(req, env);
  return err(404, "not_found");
}

async function content(env: Env) {
  const rows = (await env.DB.prepare("SELECT key,published FROM site_content WHERE published IS NOT NULL").all<{ key: string; published: string }>()).results;
  const out: Record<string, unknown> = {};
  for (const r of rows) { try { out[r.key] = JSON.parse(r.published); } catch { /* skip */ } }
  return json(out, 200, cache(30));
}

async function articles(env: Env, slug?: string) {
  if (slug) {
    const a = await env.DB.prepare("SELECT slug,title,summary,thumbnail,content_html,published_at,updated_at FROM articles WHERE slug=? AND status='published'").bind(slug).first();
    return a ? json(a, 200, cache(30)) : err(404, "not_found");
  }
  return json((await env.DB.prepare("SELECT slug,title,summary,thumbnail,published_at,updated_at FROM articles WHERE status='published' ORDER BY published_at DESC").all()).results, 200, cache(30));
}

/** The message and contact options shown after registration. Configured by the administrator. */
async function registrationInfo(env: Env) {
  const s = await getSettings(env);
  return json({ message: s.registration_message ?? "", messenger: s.contact_messenger ?? "", whatsapp: s.contact_whatsapp ?? "", phone: s.contact_phone ?? "" }, 200, cache(30));
}

async function inquiry(req: Request, env: Env) {
  if (!(await rateLimit(env, `inq:${ip(req)}`, 5, 3600))) return err(429, "too_many_requests");
  const d = (await req.json().catch(() => null)) as Record<string, any> | null;
  const name = clip(d?.name, 120), message = clip(d?.message, 2000), phone = clip(d?.phone, 30), email = clip(d?.email, 160);
  if (!name || !message || (!phone && !email) || clip(d?.website, 10)) return err(400, "invalid_inquiry"); // "website" is a honeypot
  await env.DB.prepare("INSERT INTO customer_inquiries (id,name,phone,email,subject,message,status,notes,archived,created_at) VALUES (?,?,?,?,?,?, 'new','',0,?)").bind(uid(), name, phone || null, email || null, clip(d?.subject, 160), message, now()).run();
  return json({ ok: true }, 201);
}

/**
 * File delivery.
 *  /files/images/*   site images (hero, journal, categories): public
 *  /files/catalog/*  product images: approved customers or administrators only
 *  /files/coa/:id    published certificates: approved customers or administrators only
 */
export async function handleFiles(req: Request, env: Env, url: URL): Promise<Response> {
  const [, , kind, name] = url.pathname.split("/");
  const deny = (status: number) => new Response(status === 401 ? "Sign in required" : "Not found", { status, headers: { "x-robots-tag": "noindex, nofollow", "cache-control": "no-store" } });
  let key: string | null = null;
  let privateFile = false;

  if (kind === "images" && /^[a-f0-9]{32}\.(png|jpg|webp)$/.test(name ?? "")) key = `images/${name}`;
  else if (kind === "catalog" && /^[a-f0-9]{32}\.(png|jpg|webp)$/.test(name ?? "")) { key = `catalog/${name}`; privateFile = true; }
  else if (kind === "coa" && /^[a-f0-9]{32}$/.test(name ?? "")) privateFile = true;
  if (!key && !(kind === "coa" && privateFile)) return deny(404);

  if (privateFile) {
    const customer = await currentCustomer(req, env);
    const allowed = (customer && customer.status === "approved") || !!(await currentAdmin(req, env));
    if (!allowed) return deny(401);
    if (kind === "coa") {
      const isAdmin = !(customer && customer.status === "approved");
      const r = await env.DB.prepare(`SELECT d.file_key FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE d.id=? ${isAdmin ? "" : "AND d.status='published' AND p.status='published'"}`).bind(name).first<{ file_key: string }>();
      key = r?.file_key ?? null;
    }
  }
  if (!key) return deny(404);
  const obj = await env.FILES.get(key);
  if (!obj) return deny(404);
  const h = new Headers({ "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream", "x-robots-tag": "noindex, nofollow", "x-content-type-options": "nosniff" });
  h.set("cache-control", privateFile ? "private, no-store" : "public, max-age=31536000, immutable");
  if (kind === "coa") h.set("content-disposition", 'inline; filename="certificate-of-analysis.pdf"');
  return new Response(req.method === "HEAD" ? null : obj.body, { headers: h });
}
