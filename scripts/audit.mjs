// Definition-of-done audit (CLAUDE.md §14 M2, §15). Run after `npm run build`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const failures = [];
const fail = (m) => failures.push(m);

const walk = (dir) =>
  !existsSync(dir) ? [] : readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// 1. Dash audit: no em or en dashes in source, scripts or documentation.
const dashFiles = [...walk(join(root, "src")), ...walk(join(root, "scripts")), ...["HANDOVER.md", "CLAUDE.md", "index.html"].map((f) => join(root, f))].filter(existsSync);
for (const f of dashFiles) if (/[\u2013\u2014]/.test(readFileSync(f, "utf8"))) fail(`dash found: ${f.replace(root, "")}`);

// 2. Banned vocabulary sweep over public-site copy (content files).
const banned = ["cure", "treat", "prevent", "heal", "weight loss", "slimming", "clinically proven", "miracle", "guaranteed", "pharmaceutical grade"];
for (const f of walk(join(root, "src/content"))) {
  // Justified exception (HANDOVER section 9): the client-supplied product disclaimer says the information is not
  // "diagnosis, or treatment guidance". It is a disclaimer, not a claim, so only that exact phrase is exempt.
  const text = readFileSync(f, "utf8").toLowerCase().split("diagnosis, or treatment guidance").join("");
  for (const w of banned) if (new RegExp(`\\b${w}(s|ed|ing|ment)?\\b`).test(text)) fail(`banned word "${w}" in ${f.replace(root, "")}`);
}

// 3. Phase 2 code must not exist in Phase 1.
for (const d of ["functions", "admin", "catalog", "src/admin", "src/catalog", "src/pages/catalog", "src/pages/admin"]) if (existsSync(join(root, d))) fail(`forbidden directory: ${d}`);
for (const f of walk(join(root, "src"))) {
  const t = readFileSync(f, "utf8");
  if (/\bfetch\(|XMLHttpRequest|D1Database|R2Bucket/.test(t)) fail(`network or binding code in ${f.replace(root, "")}`);
}

// 4. Built output: no catalog link, no sitemap entry, all routes prerendered.
const dist = join(root, "dist");
if (!existsSync(dist)) fail("dist/ missing: run npm run build first");
else {
  for (const f of walk(dist).filter((p) => [".html", ".xml", ".txt"].includes(extname(p)))) {
    if (/\/catalog|\/admin|\/api\//.test(readFileSync(f, "utf8"))) fail(`catalog/admin/api reference in dist${f.replace(dist, "")}`);
  }
  for (const r of ["index.html", "about/index.html", "health-beauty/index.html", "education/index.html", "contact/index.html", "privacy/index.html", "404.html", "sitemap.xml", "robots.txt", "_headers"]) {
    if (!existsSync(join(dist, r))) fail(`missing in dist: ${r}`);
  }
  const home = existsSync(join(dist, "index.html")) ? readFileSync(join(dist, "index.html"), "utf8") : "";
  if (!/<h1[ >]/.test(home)) fail("home has no h1");
  if ((home.match(/<h1[ >]/g) || []).length !== 1) fail("home must have exactly one h1");
  if (!home.includes("application/ld+json")) fail("home missing Organization JSON-LD");
  if (!/rel="canonical"/.test(home)) fail("home missing canonical");
}

if (failures.length) {
  console.error("AUDIT FAILED\n" + failures.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("audit passed: dashes, banned vocabulary, Phase 2 boundary, prerender, catalog isolation");
