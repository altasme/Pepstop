// Generates sitemap.xml from the prerendered HTML in dist/. Public routes only; 404 excluded.
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = "https://thepepstop.altasme.com";
const dist = new URL("../dist", import.meta.url).pathname;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const routes = walk(dist)
  .filter((f) => f.endsWith(".html"))
  .map((f) => "/" + relative(dist, f).replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, ""))
  // Private catalog pages (login required) and the account page never belong in a sitemap.
  .filter((r) => !/^\/(shop|cart|checkout|coa|account)(\/|$)/.test(r))
  .filter((r) => r !== "/404" && !r.endsWith("/_") && !readFileSync(join(dist, r === "/" ? "index.html" : `${r}/index.html`), "utf8").includes('content="noindex"'))
  .sort();

const lastmod = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .map((r) => `  <url><loc>${SITE}${r === "/" ? "" : r}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), xml);
console.log(`sitemap.xml: ${routes.length} routes`);

// Cloudflare Pages serves /404.html with a 404 status for unknown URLs.
import { copyFileSync, rmSync, existsSync } from "node:fs";
copyFileSync(join(dist, "404", "index.html"), join(dist, "404.html"));
if (existsSync(join(dist, ".vite"))) rmSync(join(dist, ".vite"), { recursive: true });
