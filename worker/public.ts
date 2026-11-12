import type { Env } from "./types";
import { clip, err, getSettings, ip, json, now, rateLimit, sniff, uid } from "./lib";

const cache = (s: number) => ({ "cache-control": `public, max-age=${s}, stale-while-revalidate=${s * 5}` });
const likeEsc = (s: string) => `%${s.replace(/[%_\\]/g, "\\$&")}%`;

type ProductRow = {
  id: string; slug: string; name: string; short_description: string; full_description: string; category_id: string | null; main_image: string | null; sort: number;
  specifications: string; packaging: string; storage: string; reg_type: string | null; reg_number: string | null; reg_holder: string | null;
  base_price: number | null; availability: string; show_price: number; inquire_price: number;
};

export async function handlePublic(req: Request, env: Env, url: URL): Promise<Response> {
  const seg = url.pathname.replace(/^\/api\/public\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const m = req.method;
  if (m === "GET" && seg[0] === "catalog") return catalog(env);
  if (m === "GET" && seg[0] === "content") return content(env);
  if (m === "GET" && seg[0] === "articles") return articles(env, seg[1]);
  if (m === "GET" && seg[0] === "coa") return coa(env, url);
  if (m === "POST" && seg[0] === "orders" && !seg[1]) return placeOrder(req, env);
  if (m === "POST" && seg[0] === "orders" && seg[2] === "payment") return submitPayment(req, env, seg[1]);
  if (m === "POST" && seg[0] === "inquiries") return inquiry(req, env);
  return err(404, "not_found");
}

async function catalog(env: Env) {
  const [cats, prods, vars, info, coas] = await Promise.all([
    env.DB.prepare("SELECT id,slug,name,description,image,sort FROM categories WHERE status='published' ORDER BY sort,name").all(),
    env.DB.prepare("SELECT * FROM products WHERE status='published' ORDER BY sort,name").all<ProductRow>(),
    env.DB.prepare("SELECT v.* FROM product_variants v JOIN products p ON p.id=v.product_id WHERE p.status='published' AND v.status='published' ORDER BY v.sort").all<any>(),
    env.DB.prepare("SELECT i.product_id,i.section,i.body_html FROM product_information i JOIN products p ON p.id=i.product_id WHERE p.status='published' AND i.status='published' ORDER BY i.section").all<any>(),
    env.DB.prepare("SELECT d.id,d.product_id,d.batch,d.title FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE p.status='published' AND d.status='published' ORDER BY d.uploaded_at DESC").all<any>(),
  ]);
  const settings = await getSettings(env);
  const products = prods.results.map((p) => {
    const priceVisible = !!p.show_price && !p.inquire_price;
    const variants = vars.results.filter((v: any) => v.product_id === p.id).map((v: any) => ({
      id: v.id,
      label: v.strength && !v.name.includes(v.strength) ? `${v.name} (${v.strength})` : v.name,
      pricePhp: priceVisible ? (v.price ?? p.base_price ?? null) : null,
      available: v.availability === "available",
    }));
    if (variants.length === 0) variants.push({ id: `${p.id}-base`, label: "Standard", pricePhp: priceVisible ? p.base_price : null, available: p.availability !== "unavailable" });
    return {
      id: p.id, slug: p.slug, name: p.name, categoryId: p.category_id ?? "", image: p.main_image,
      shortDescription: p.short_description, fullDescription: p.full_description,
      specifications: p.specifications.split("\n").map((s) => s.trim()).filter(Boolean),
      variants, packaging: p.packaging, storage: p.storage, regType: p.reg_type, regNumber: p.reg_number, regHolder: p.reg_holder,
      availability: (p.availability === "unavailable" ? "unavailable" : p.availability) as string,
      showPrice: priceVisible, status: p.availability === "unavailable" ? "unavailable" : "published", order: p.sort,
      info: info.results.filter((i: any) => i.product_id === p.id).map((i: any) => ({ section: i.section, html: i.body_html })),
      coas: coas.results.filter((d: any) => d.product_id === p.id).map((d: any) => ({ id: d.id, batch: d.batch, title: d.title })),
    };
  });
  return json({ live: products.length > 0, codEnabled: settings.cod_enabled === "1", deliveryFee: settings.delivery_fee === "" || settings.delivery_fee === undefined ? null : Number(settings.delivery_fee), categories: cats.results, products }, 200, cache(30));
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

async function coa(env: Env, url: URL) {
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const where = q ? "AND (p.name LIKE ? ESCAPE '\\' OR d.batch LIKE ? ESCAPE '\\' OR d.title LIKE ? ESCAPE '\\')" : "";
  const args = q ? [likeEsc(q), likeEsc(q), likeEsc(q)] : [];
  const rows = (await env.DB.prepare(`SELECT d.id,d.title,d.batch,d.doc_date,d.uploaded_at,p.name AS product_name,p.slug AS product_slug FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE d.status='published' AND p.status='published' ${where} ORDER BY p.name,d.batch LIMIT 100`).bind(...args).all()).results;
  return json({ rows }, 200, cache(15));
}

const MOBILE = /^(?:\+?63|0)9\d{9}$/;
async function placeOrder(req: Request, env: Env) {
  if (!(await rateLimit(env, `order:${ip(req)}`, 8, 3600))) return err(429, "too_many_requests");
  const d = (await req.json().catch(() => null)) as Record<string, any> | null;
  if (!d || !Array.isArray(d.items) || d.items.length < 1 || d.items.length > 30) return err(400, "invalid_items");
  const settings = await getSettings(env);
  const methods = ["gcash", "maya", "bank", ...(settings.cod_enabled === "1" ? ["cod"] : [])];
  const c = d.customer ?? {};
  const mobile = clip(c.mobile, 20).replace(/[\s-]/g, "");
  const fields = { fullName: clip(c.fullName, 120), street: clip(c.street, 200), barangay: clip(c.barangay, 100), city: clip(c.city, 100), province: clip(c.province, 100), postal: clip(c.postal, 10), email: clip(c.email, 160), notes: clip(c.notes, 1000), payment: clip(c.payment, 20) };
  if (!fields.fullName || !MOBILE.test(mobile) || !fields.street || !fields.barangay || !fields.city || !fields.province || !/^\d{4}$/.test(fields.postal) || !methods.includes(fields.payment)) return err(400, "invalid_customer");
  if (fields.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) return err(400, "invalid_email");

  const lines: { productId: string; variantId: string; pname: string; vname: string; qty: number; unit: number | null }[] = [];
  for (const it of d.items) {
    const qty = Math.round(Number(it?.qty));
    if (!(qty >= 1 && qty <= 99)) return err(400, "invalid_qty");
    const p = await env.DB.prepare("SELECT * FROM products WHERE id=? AND status='published'").bind(clip(it.productId, 60)).first<ProductRow>();
    if (!p || p.availability === "unavailable") return err(400, "product_unavailable");
    const priceVisible = !!p.show_price && !p.inquire_price;
    let vname = "Standard", unit = priceVisible ? p.base_price : null, vid = `${p.id}-base`;
    const v = await env.DB.prepare("SELECT * FROM product_variants WHERE id=? AND product_id=? AND status='published'").bind(clip(it.variantId, 60), p.id).first<any>();
    if (v) {
      if (v.availability === "unavailable") return err(400, "variant_unavailable");
      vname = v.strength && !v.name.includes(v.strength) ? `${v.name} (${v.strength})` : v.name; vid = v.id; unit = priceVisible ? (v.price ?? p.base_price) : null;
    } else if (clip(it.variantId, 60) !== vid) return err(400, "invalid_variant");
    lines.push({ productId: p.id, variantId: vid, pname: p.name, vname, qty, unit });
  }
  const hasUnpriced = lines.some((l) => l.unit === null);
  const subtotal = lines.reduce((s, l) => s + (l.unit ?? 0) * l.qty, 0);
  const fee = settings.delivery_fee === "" || settings.delivery_fee === undefined ? null : Number(settings.delivery_fee);
  const total = subtotal + (fee ?? 0);
  const id = uid(), ref = `PS-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`, t = now();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO orders (id,ref,full_name,mobile,email,street,barangay,city,province,postal,customer_notes,payment_method,payment_status,order_status,subtotal,delivery_fee,total,has_unpriced,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'pending','new_order',?,?,?,?,?,?)")
      .bind(id, ref, fields.fullName, mobile, fields.email || null, fields.street, fields.barangay, fields.city, fields.province, fields.postal, fields.notes, fields.payment, subtotal, fee, total, hasUnpriced ? 1 : 0, t, t),
    ...lines.map((l) => env.DB.prepare("INSERT INTO order_items (id,order_id,product_id,variant_id,product_name,variant_name,qty,unit_price,line_total) VALUES (?,?,?,?,?,?,?,?,?)").bind(uid(), id, l.productId, l.variantId, l.pname, l.vname, l.qty, l.unit, (l.unit ?? 0) * l.qty)),
    env.DB.prepare("INSERT INTO order_history (id,order_id,at,status,note,by_user) VALUES (?,?,?,?,?,?)").bind(uid(), id, t, "new_order", "Order submitted from the website", "customer"),
  ]);
  return json({ ok: true, ref, subtotal, total, hasUnpriced }, 201);
}

/** Customer submits a payment reference and optional proof. Never marks anything verified. */
async function submitPayment(req: Request, env: Env, ref: string) {
  if (!(await rateLimit(env, `pay:${ip(req)}`, 10, 3600))) return err(429, "too_many_requests");
  const form = await req.formData().catch(() => null);
  if (!form) return err(400, "bad_request");
  const order = await env.DB.prepare("SELECT id,mobile FROM orders WHERE ref=?").bind(clip(ref, 20)).first<{ id: string; mobile: string }>();
  const mobile = clip(form.get("mobile"), 20).replace(/[\s-]/g, "");
  if (!order || mobile.slice(-4) !== order.mobile.slice(-4)) return err(404, "order_not_found");
  const reference = clip(form.get("reference"), 120);
  const file = form.get("proof");
  let proofKey: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1048576) return err(413, "file_too_large");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = sniff(bytes);
    if (!type) return err(415, "unsupported_file_type");
    proofKey = `proof/${uid()}.${type.ext}`;
    await env.FILES.put(proofKey, bytes, { httpMetadata: { contentType: type.mime } });
  }
  if (!reference && !proofKey) return err(400, "reference_or_proof_required");
  const t = now();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO payments (id,order_id,reference,proof_key,status,notes,created_at) VALUES (?,?,?,?, 'submitted','',?)").bind(uid(), order.id, reference, proofKey, t),
    env.DB.prepare("UPDATE orders SET payment_status='submitted', order_status=CASE WHEN order_status IN ('new_order','under_review','awaiting_payment') THEN 'payment_submitted' ELSE order_status END, updated_at=? WHERE id=?").bind(t, order.id),
    env.DB.prepare("INSERT INTO order_history (id,order_id,at,status,note,by_user) VALUES (?,?,?,?,?,?)").bind(uid(), order.id, t, "payment_submitted", "Payment reference submitted by customer", "customer"),
  ]);
  return json({ ok: true });
}

async function inquiry(req: Request, env: Env) {
  if (!(await rateLimit(env, `inq:${ip(req)}`, 5, 3600))) return err(429, "too_many_requests");
  const d = (await req.json().catch(() => null)) as Record<string, any> | null;
  const name = clip(d?.name, 120), message = clip(d?.message, 2000), phone = clip(d?.phone, 30), email = clip(d?.email, 160);
  if (!name || !message || (!phone && !email) || clip(d?.website, 10)) return err(400, "invalid_inquiry"); // "website" is a honeypot
  await env.DB.prepare("INSERT INTO customer_inquiries (id,name,phone,email,subject,message,status,notes,archived,created_at) VALUES (?,?,?,?,?,?, 'new','',0,?)").bind(uid(), name, phone || null, email || null, clip(d?.subject, 160), message, now()).run();
  return json({ ok: true }, 201);
}

/** Public file delivery. Images are public. COA PDFs are served only while published. */
export async function handleFiles(req: Request, env: Env, url: URL): Promise<Response> {
  const [, , kind, name] = url.pathname.split("/");
  let key: string | null = null;
  if (kind === "images" && /^[a-f0-9]{32}\.(png|jpg|webp)$/.test(name ?? "")) key = `images/${name}`;
  if (kind === "coa" && /^[a-f0-9]{32}$/.test(name ?? "")) {
    const r = await env.DB.prepare("SELECT d.file_key FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE d.id=? AND d.status='published' AND p.status='published'").bind(name).first<{ file_key: string }>();
    key = r?.file_key ?? null;
  }
  if (!key) return new Response("Not found", { status: 404, headers: { "x-robots-tag": "noindex, nofollow" } });
  const obj = await env.FILES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const h = new Headers({ "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream", "x-robots-tag": "noindex, nofollow", "x-content-type-options": "nosniff" });
  h.set("cache-control", kind === "images" ? "public, max-age=31536000, immutable" : "public, max-age=60");
  if (kind === "coa") h.set("content-disposition", 'inline; filename="certificate-of-analysis.pdf"');
  return new Response(req.method === "HEAD" ? null : obj.body, { headers: h });
}
