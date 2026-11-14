import { serveStatic } from "@static";
import { handleAdmin } from "./admin";
import { handleCustomer } from "./customer";
import { handleFiles, handlePublic } from "./public";
import { err, getSettings, json } from "./lib";
import type { Env } from "./types";

let visibility: { value: string; at: number } | null = null;
async function searchHidden(env: Env): Promise<boolean> {
  if (!visibility || Date.now() - visibility.at > 30000) {
    try { visibility = { value: (await getSettings(env)).search_visibility ?? "hidden", at: Date.now() }; } catch { visibility = { value: "hidden", at: Date.now() }; }
  }
  return visibility.value !== "visible";
}

async function page(req: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname;
  if (p === "/sitemap.xml" && (await searchHidden(env))) return new Response("Not found", { status: 404 });
  if (p === "/admin" || p.startsWith("/admin/")) {
    if (/\.[a-z0-9]+$/i.test(p)) return serveStatic(req, env);
    const shell = await serveStatic(new Request(new URL("/admin/index.html", url), { method: "GET", headers: req.headers }), env);
    return new Response(shell.body, { status: shell.ok ? 200 : shell.status, headers: shell.headers });
  }
  const res = await serveStatic(req, env);
  // Products and articles come from the database, so any /shop/<slug> or /education/<slug> falls back to its prerendered shell.
  if (res.status === 404 && /^\/(shop|education)\/[^/]+$/.test(p)) {
    const shell = await serveStatic(new Request(new URL(`/${p.split("/")[1]}/_`, url), { method: "GET", headers: req.headers }), env);
    if (shell.ok) return new Response(shell.body, { status: 200, headers: shell.headers });
  }
  return res;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const p = url.pathname;
    let res: Response;
    const isApi = p.startsWith("/api/") || p.startsWith("/files/");
    const isAdmin = p === "/admin" || p.startsWith("/admin/");
    try {
      if (p.startsWith("/api/admin/")) res = await handleAdmin(req, env, url);
      else if (p.startsWith("/api/customer/")) res = await handleCustomer(req, env, url);
      else if (p.startsWith("/api/public/")) res = await handlePublic(req, env, url);
      else if (p.startsWith("/files/")) res = await handleFiles(req, env, url);
      else if (p.startsWith("/api/")) res = err(404, "not_found");
      else res = await page(req, env, url);
    } catch (e) {
      console.error("worker error", p, e instanceof Error ? e.message : e);
      res = json({ error: "server_error" }, 500);
    }
    const out = new Response(res.body, res);
    out.headers.set("x-content-type-options", "nosniff");
    out.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    const html = (out.headers.get("content-type") ?? "").includes("text/html");
    // Private catalog pages are always noindex, whatever the site-wide visibility setting says.
    const isPrivatePage = /^\/(shop|cart|checkout|coa|account)(\/|$)/.test(p);
    if (isApi || isAdmin || isPrivatePage || (html && (await searchHidden(env)))) out.headers.set("x-robots-tag", "noindex, nofollow");
    // Pages always revalidate, so a visitor never gets an old page that points at deleted, content-hashed files.
    if (html && !isAdmin && !out.headers.has("cache-control")) out.headers.set("cache-control", "no-cache");
    if (isAdmin) {
      out.headers.set("x-frame-options", "DENY");
      // Hashed bundles and fonts never change under the same name, so they are cached; the admin page itself is not.
      if (!p.startsWith("/admin/assets/")) out.headers.set("cache-control", "no-store");
    }
    return out;
  },
} satisfies ExportedHandler<Env>;
