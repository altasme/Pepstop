import type { Env } from "./types";
import { clip, err, getSettings, hashPassword, ip, json, now, rateLimit, sha256, uid, verifyPassword, sniff } from "./lib";

const COOKIE = "ps_cust";
const IDLE_MS = 14 * 24 * 3600 * 1000;
const MAX_MS = 30 * 24 * 3600 * 1000;
const MOBILE = /^(?:\+?63|0)9\d{9}$/;

export type Customer = { id: string; full_name: string; phone: string; status: "pending" | "approved" | "rejected" | "suspended" };

/** Philippine mobile numbers are stored as 09XXXXXXXXX so the unique check is consistent. */
export const normalizePhone = (raw: string) => {
  const d = raw.replace(/[\s\-().]/g, "");
  if (!MOBILE.test(d)) return null;
  return "0" + d.replace(/^(?:\+?63|0)/, "");
};

const cookieOf = (req: Request) => /(?:^|;\s*)ps_cust=([a-f0-9]{64})/.exec(req.headers.get("cookie") ?? "")?.[1] ?? null;
const setCookie = (token: string, maxAge: number) => `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

async function newSession(env: Env, customerId: string) {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const token = [...raw].map((b) => b.toString(16).padStart(2, "0")).join("");
  const t = Date.now();
  await env.DB.prepare("INSERT INTO customer_sessions (id,customer_id,created_at,last_seen,expires_at) VALUES (?,?,?,?,?)")
    .bind(await sha256(token), customerId, new Date(t).toISOString(), new Date(t).toISOString(), new Date(t + MAX_MS).toISOString()).run();
  return token;
}

/** Returns the signed-in customer with their CURRENT status, read from the database on every request. */
export async function currentCustomer(req: Request, env: Env): Promise<Customer | null> {
  const token = cookieOf(req);
  if (!token) return null;
  const id = await sha256(token);
  const row = await env.DB.prepare("SELECT s.last_seen, s.expires_at, c.id, c.full_name, c.phone, c.status FROM customer_sessions s JOIN customers c ON c.id=s.customer_id WHERE s.id=?")
    .bind(id).first<{ last_seen: string; expires_at: string } & Customer>();
  if (!row) return null;
  const t = Date.now();
  if (t > Date.parse(row.expires_at) || t - Date.parse(row.last_seen) > IDLE_MS) {
    await env.DB.prepare("DELETE FROM customer_sessions WHERE id=?").bind(id).run();
    return null;
  }
  if (t - Date.parse(row.last_seen) > 300000) await env.DB.prepare("UPDATE customer_sessions SET last_seen=? WHERE id=?").bind(new Date(t).toISOString(), id).run();
  return { id: row.id, full_name: row.full_name, phone: row.phone, status: row.status };
}

/** Only approved customers pass. Pending, rejected and suspended accounts are refused on every protected request. */
export async function requireApproved(req: Request, env: Env): Promise<{ customer: Customer } | { response: Response }> {
  const customer = await currentCustomer(req, env);
  if (!customer) return { response: err(401, "login_required") };
  if (customer.status !== "approved") return { response: err(403, `account_${customer.status}`) };
  return { customer };
}

const passwordProblem = (p: string) => (p.length < 8 ? "Use at least 8 characters." : !/[a-zA-Z]/.test(p) || !/[0-9]/.test(p) ? "Use letters and numbers." : null);

export async function handleCustomer(req: Request, env: Env, url: URL): Promise<Response> {
  const seg = url.pathname.replace(/^\/api\/customer\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const m = req.method;
  if (!["GET", "HEAD"].includes(m)) {
    const origin = req.headers.get("origin");
    if (req.headers.get("x-pepstop") !== "1" || (origin && origin !== url.origin)) return err(403, "forbidden");
  }
  if (m === "POST" && seg[0] === "register") return register(req, env);
  if (m === "POST" && seg[0] === "login") return login(req, env);
  if (m === "GET" && seg[0] === "me") return me(req, env);
  if (m === "POST" && seg[0] === "logout") {
    const t = cookieOf(req);
    if (t) await env.DB.prepare("DELETE FROM customer_sessions WHERE id=?").bind(await sha256(t)).run();
    return json({ ok: true }, 200, { "set-cookie": setCookie("", 0) });
  }
  // Everything below requires an approved account, checked against the database now.
  const auth = await requireApproved(req, env);
  if ("response" in auth) return auth.response;
  const customer = auth.customer;
  if (m === "GET" && seg[0] === "catalog") return catalog(env);
  if (m === "GET" && seg[0] === "coa") return coa(env, url);
  if (m === "POST" && seg[0] === "orders" && !seg[1]) return placeOrder(req, env, customer);
  if (m === "POST" && seg[0] === "orders" && seg[2] === "payment") return submitPayment(req, env, customer, seg[1]);
  return err(404, "not_found");
}

async function register(req: Request, env: Env) {
  const c = ip(req);
  if (!(await rateLimit(env, `register:${c}`, 10, 3600))) return err(429, "too_many_requests");
  const d = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const fullName = clip(d?.fullName, 120);
  const phone = normalizePhone(clip(d?.phone, 30));
  const password = typeof d?.password === "string" ? d.password.slice(0, 200) : "";
  if (clip(d?.website, 10)) return err(400, "invalid_registration"); // honeypot
  if (!fullName) return err(400, "name_required");
  if (!phone) return err(400, "invalid_phone");
  const problem = passwordProblem(password);
  if (problem) return err(400, "weak_password", { message: problem });
  if (password !== d?.confirm) return err(400, "password_mismatch");
  if (d?.consent !== true) return err(400, "consent_required");
  if (await env.DB.prepare("SELECT id FROM customers WHERE phone=?").bind(phone).first()) return err(409, "phone_in_use");
  const id = uid(), t = now();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO customers (id,full_name,phone,password_hash,status,created_at) VALUES (?,?,?,?, 'pending',?)").bind(id, fullName, phone, await hashPassword(password), t),
    env.DB.prepare("INSERT INTO customer_status_history (id,customer_id,at,from_status,to_status,by_user,note) VALUES (?,?,?,NULL,'pending','customer','Registered')").bind(uid(), id, t),
  ]);
  return json({ ok: true, status: "pending" }, 201);
}

async function login(req: Request, env: Env) {
  const d = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const phone = normalizePhone(clip(d?.phone, 30));
  const password = typeof d?.password === "string" ? d.password.slice(0, 200) : "";
  if (!(await rateLimit(env, `clogin-ip:${ip(req)}`, 20, 900))) return err(429, "too_many_attempts");
  const row = phone ? await env.DB.prepare("SELECT * FROM customers WHERE phone=?").bind(phone).first<{ id: string; password_hash: string; status: Customer["status"]; failed_count: number; locked_until: string | null; status_note: string; full_name: string }>() : null;
  if (!row) { await hashPassword(password); return err(401, "invalid_credentials"); }
  if (row.locked_until && Date.parse(row.locked_until) > Date.now()) return err(423, "locked");
  if (!(await verifyPassword(password, row.password_hash))) {
    const f = row.failed_count + 1;
    await env.DB.prepare("UPDATE customers SET failed_count=?, locked_until=? WHERE id=?").bind(f, f >= 5 ? new Date(Date.now() + 15 * 60000).toISOString() : row.locked_until, row.id).run();
    return err(401, "invalid_credentials");
  }
  await env.DB.prepare("UPDATE customers SET failed_count=0, locked_until=NULL WHERE id=?").bind(row.id).run();
  // The status is disclosed only after the password is correct. Non-approved accounts never get a session.
  if (row.status !== "approved") {
    const settings = await getSettings(env);
    const reason = row.status === "rejected" && settings.disclose_rejection_reason === "1" ? row.status_note : "";
    return err(403, `account_${row.status}`, { reason });
  }
  await env.DB.prepare("UPDATE customers SET last_login_at=? WHERE id=?").bind(now(), row.id).run();
  const token = await newSession(env, row.id);
  return json({ ok: true, name: row.full_name }, 200, { "set-cookie": setCookie(token, MAX_MS / 1000) });
}

async function me(req: Request, env: Env) {
  const c = await currentCustomer(req, env);
  if (!c) return json({ authenticated: false });
  return json({ authenticated: c.status === "approved", status: c.status, name: c.full_name, phone: c.status === "approved" ? c.phone : undefined });
}

type ProductRow = {
  id: string; slug: string; name: string; short_description: string; full_description: string; category_id: string | null; main_image: string | null; sort: number;
  overview: string; specifications: string; composition: string; packaging: string; storage: string; notes: string; reg_type: string | null; reg_number: string | null; reg_holder: string | null;
  base_price: number | null; availability: string; show_price: number; inquire_price: number;
};
const VISIBLE = "p.status='published' AND p.regulatory_status='verified'";

async function catalog(env: Env) {
  const [cats, prods, vars, info, coas] = await Promise.all([
    env.DB.prepare("SELECT id,slug,name,description,image,sort FROM categories WHERE status='published' ORDER BY sort,name").all(),
    env.DB.prepare(`SELECT p.* FROM products p WHERE ${VISIBLE} ORDER BY p.sort,p.name`).all<ProductRow>(),
    env.DB.prepare(`SELECT v.* FROM product_variants v JOIN products p ON p.id=v.product_id WHERE ${VISIBLE} AND v.status='published' ORDER BY v.sort`).all<any>(),
    env.DB.prepare(`SELECT i.product_id,i.section,i.body_html FROM product_information i JOIN products p ON p.id=i.product_id WHERE ${VISIBLE} AND i.status='published' ORDER BY i.section`).all<any>(),
    env.DB.prepare(`SELECT d.id,d.product_id,d.batch,d.title FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE ${VISIBLE} AND d.status='published' ORDER BY d.uploaded_at DESC`).all<any>(),
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
      shortDescription: p.short_description, fullDescription: p.full_description, overview: p.overview, composition: p.composition, notes: p.notes,
      specifications: p.specifications.split("\n").map((s) => s.trim()).filter(Boolean),
      variants, packaging: p.packaging, storage: p.storage, regType: p.reg_type, regNumber: p.reg_number, regHolder: p.reg_holder,
      availability: p.availability, showPrice: priceVisible, status: p.availability === "unavailable" ? "unavailable" : "published", order: p.sort,
      info: info.results.filter((i: any) => i.product_id === p.id).map((i: any) => ({ section: i.section, html: i.body_html })),
      coas: coas.results.filter((d: any) => d.product_id === p.id).map((d: any) => ({ id: d.id, batch: d.batch, title: d.title })),
    };
  });
  return json({ live: products.length > 0, codEnabled: settings.cod_enabled === "1", deliveryFee: settings.delivery_fee === "" || settings.delivery_fee === undefined ? null : Number(settings.delivery_fee), paymentInstructions: settings.payment_instructions ?? "", categories: cats.results, products }, 200, { "cache-control": "private, no-store" });
}

const likeEsc = (s: string) => `%${s.replace(/[%_\\]/g, "\\$&")}%`;
async function coa(env: Env, url: URL) {
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  const where = q ? "AND (p.name LIKE ? ESCAPE '\\' OR d.batch LIKE ? ESCAPE '\\' OR d.title LIKE ? ESCAPE '\\')" : "";
  const args = q ? [likeEsc(q), likeEsc(q), likeEsc(q)] : [];
  const rows = (await env.DB.prepare(`SELECT d.id,d.title,d.batch,d.doc_date,d.uploaded_at,p.name AS product_name,p.slug AS product_slug FROM coa_documents d JOIN products p ON p.id=d.product_id WHERE d.status='published' AND ${VISIBLE} ${where} ORDER BY p.name,d.batch LIMIT 100`).bind(...args).all()).results;
  return json({ rows }, 200, { "cache-control": "private, no-store" });
}

async function placeOrder(req: Request, env: Env, customer: Customer) {
  if (!(await rateLimit(env, `order:${customer.id}`, 10, 3600))) return err(429, "too_many_requests");
  const d = (await req.json().catch(() => null)) as Record<string, any> | null;
  if (!d || !Array.isArray(d.items) || d.items.length < 1 || d.items.length > 30) return err(400, "invalid_items");
  const settings = await getSettings(env);
  const methods = ["gcash", "maya", "bank", ...(settings.cod_enabled === "1" ? ["cod"] : [])];
  const c = d.customer ?? {};
  const f = { street: clip(c.street, 200), barangay: clip(c.barangay, 100), city: clip(c.city, 100), province: clip(c.province, 100), postal: clip(c.postal, 10), email: clip(c.email, 160), notes: clip(c.notes, 1000), payment: clip(c.payment, 20) };
  if (!f.street || !f.barangay || !f.city || !f.province || !/^\d{4}$/.test(f.postal) || !methods.includes(f.payment)) return err(400, "invalid_customer");
  if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return err(400, "invalid_email");

  const lines: { productId: string; variantId: string; pname: string; vname: string; qty: number; unit: number | null }[] = [];
  for (const it of d.items) {
    const qty = Math.round(Number(it?.qty));
    if (!(qty >= 1 && qty <= 99)) return err(400, "invalid_qty");
    const p = await env.DB.prepare(`SELECT p.* FROM products p WHERE p.id=? AND ${VISIBLE}`).bind(clip(it.productId, 60)).first<ProductRow>();
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
    env.DB.prepare("INSERT INTO orders (id,ref,customer_id,full_name,mobile,email,street,barangay,city,province,postal,customer_notes,payment_method,payment_status,order_status,subtotal,delivery_fee,total,has_unpriced,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, 'pending','new_order',?,?,?,?,?,?)")
      .bind(id, ref, customer.id, customer.full_name, customer.phone, f.email || null, f.street, f.barangay, f.city, f.province, f.postal, f.notes, f.payment, subtotal, fee, total, hasUnpriced ? 1 : 0, t, t),
    ...lines.map((l) => env.DB.prepare("INSERT INTO order_items (id,order_id,product_id,variant_id,product_name,variant_name,qty,unit_price,line_total) VALUES (?,?,?,?,?,?,?,?,?)").bind(uid(), id, l.productId, l.variantId, l.pname, l.vname, l.qty, l.unit, (l.unit ?? 0) * l.qty)),
    env.DB.prepare("INSERT INTO order_history (id,order_id,at,status,note,by_user) VALUES (?,?,?,?,?,?)").bind(uid(), id, t, "new_order", "Order submitted from the website", "customer"),
  ]);
  return json({ ok: true, ref, subtotal, total, hasUnpriced }, 201);
}

/** The customer submits a payment reference and optional proof for their own order. Never marks anything verified. */
async function submitPayment(req: Request, env: Env, customer: Customer, ref: string) {
  if (!(await rateLimit(env, `pay:${customer.id}`, 10, 3600))) return err(429, "too_many_requests");
  const form = await req.formData().catch(() => null);
  if (!form) return err(400, "bad_request");
  const order = await env.DB.prepare("SELECT id FROM orders WHERE ref=? AND customer_id=?").bind(clip(ref, 20), customer.id).first<{ id: string }>();
  if (!order) return err(404, "order_not_found");
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

