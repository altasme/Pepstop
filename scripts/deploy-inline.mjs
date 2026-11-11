// Fallback deploy for environments where the Workers static assets upload API is blocked
// (for example behind a proxy that rewrites its upload token). It embeds dist/ into a single
// Worker script that serves the same routes, 404 page, trailing-slash rule and _headers.
// Normal deploys use `npm run deploy` (wrangler.jsonc, static assets). Run `npm run build` first.
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist");
const out = join(root, ".worker-inline");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon" };

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = {};
for (const f of walk(dist)) {
  const key = "/" + relative(dist, f).split("\\").join("/");
  if (key === "/_headers") continue;
  files[key] = { t: types[extname(f)] ?? "application/octet-stream", b: readFileSync(f).toString("base64") };
}

const rules = [];
let cur = null;
for (const line of readFileSync(join(dist, "_headers"), "utf8").split("\n")) {
  if (!line.trim() || line.trim().startsWith("#")) continue;
  if (/^\s/.test(line)) { const i = line.indexOf(":"); cur.h.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  else { cur = { p: line.trim(), h: [] }; rules.push(cur); }
}

const worker = `
const FILES = ${JSON.stringify(files)};
const RULES = ${JSON.stringify(rules)};
const cache = new Map();
const glob = (g) => new RegExp("^" + g.replace(/[.+?^\${}()|[\\]\\\\]/g, "\\\\$&").replace(/\\*/g, ".*") + "$");
const RULES_RE = RULES.map((r) => ({ re: glob(r.p), abs: r.p.startsWith("https://"), h: r.h }));
function bytes(key) {
  if (!cache.has(key)) { const bin = atob(FILES[key].b); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); cache.set(key, u); }
  return cache.get(key);
}
function respond(req, key, status, url) {
  const headers = new Headers({ "content-type": FILES[key].t });
  for (const r of RULES_RE) if (r.re.test(r.abs ? url.origin + url.pathname : url.pathname)) for (const [k, v] of r.h) headers.set(k, v);
  return new Response(req.method === "HEAD" ? null : bytes(key), { status, headers });
}
export default {
  async fetch(req) {
    const url = new URL(req.url);
    let p = decodeURIComponent(url.pathname);
    if (p.length > 1 && p.endsWith("/")) { url.pathname = p.slice(0, -1); return Response.redirect(url.toString(), 307); }
    const candidates = p === "/" ? ["/index.html"] : [p, p + ".html", p + "/index.html"];
    for (const c of candidates) if (FILES[c] && !c.endsWith("/_headers")) return respond(req, c, 200, url);
    return respond(req, "/404.html", 404, url);
  },
};
`;
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "worker.js"), worker);
writeFileSync(join(out, "wrangler.jsonc"), JSON.stringify({ name: "pepstop", main: "./worker.js", compatibility_date: "2026-11-11", observability: { enabled: true } }, null, 2));
console.log(`inline worker: ${Object.keys(files).length} files, ${(worker.length / 1048576).toFixed(2)} MB source`);
