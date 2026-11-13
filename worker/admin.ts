import type { Admin, Env } from "./types";
import { clip, err, getSettings, hashPassword, intOrNull, ip, json, log, now, rateLimit, sanitizeHtml, sha256, slugify, sniff, uid, verifyPassword } from "./lib";

const COOKIE = "ps_admin";
const IDLE_MS = 60 * 60 * 1000; // inactive sessions expire after 60 minutes
const MAX_MS = 12 * 60 * 60 * 1000; // absolute session lifetime
export const INFO_SECTIONS = ["overview", "general", "specifications", "manufacturer", "guidelines", "storage", "handling", "supporting", "notices", "notes"];
const PUB_STATUSES = ["draft", "published", "unpublished", "archived"];
const REG_STATUSES = ["pending_review", "verified", "not_cleared"];
/** "Unpublished" is stored as a draft with unpublished = 1 (see migration 0003). */
const toDb = (s: string) => (s === "unpublished" ? { status: "draft", unpublished: 1 } : { status: s, unpublished: 0 });
const GATE_MESSAGE = "Only products verified for their intended sale and promotion can be published. Set the regulatory review status to Verified for Intended Sale first.";
export const ORDER_STATUSES = ["new_order", "under_review", "awaiting_payment", "payment_submitted", "payment_verified", "processing", "ready_for_dispatch", "shipped", "completed", "cancelled"];
const CONTENT_KEYS = ["home", "about", "contact", "footer"];

type Ctx = { req: Request; env: Env; url: URL; ip: string; admin: Admin | null };

const cookieOf = (req: Request) => /(?:^|;\s*)ps_admin=([a-f0-9]{64})/.exec(req.headers.get("cookie") ?? "")?.[1] ?? null;
const setCookie = (token: string, maxAge: number) => `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

async function newSession(env: Env, adminId: string) {
  const raw = crypto.getRandomValues(new Uint8Array(32));
  const token = [...raw].map((b) => b.toString(16).padStart(2, "0")).join("");
  const t = Date.now();
  await env.DB.prepare("INSERT INTO admin_sessions (id,admin_id,created_at,last_seen,expires_at) VALUES (?,?,?,?,?)")
    .bind(await sha256(token), adminId, new Date(t).toISOString(), new Date(t).toISOString(), new Date(t + MAX_MS).toISOString()).run();
  return token;
}

export async function currentAdmin(req: Request, env: Env): Promise<Admin | null> {
  const token = cookieOf(req);
  if (!token) return null;
  const id = await sha256(token);
  const row = await env.DB.prepare("SELECT s.last_seen, s.expires_at, a.id, a.username, a.must_change, a.role FROM admin_sessions s JOIN admins a ON a.id=s.admin_id WHERE s.id=?")
    .bind(id).first<{ last_seen: string; expires_at: string } & Admin>();
  if (!row) return null;
  const t = Date.now();
  if (t > Date.parse(row.expires_at) || t - Date.parse(row.last_seen) > IDLE_MS) {
    await env.DB.prepare("DELETE FROM admin_sessions WHERE id=?").bind(id).run();
    return null;
  }
  if (t - Date.parse(row.last_seen) > 60000) await env.DB.prepare("UPDATE admin_sessions SET last_seen=? WHERE id=?").bind(new Date(t).toISOString(), id).run();
  return { id: row.id, username: row.username, must_change: row.must_change, role: row.role };
}

const passwordProblem = (p: string) => (p.length < 10 ? "Use at least 10 characters." : !/[a-zA-Z]/.test(p) || !/[0-9]/.test(p) ? "Use letters and numbers." : null);

function pageOf(url: URL) {
  const per = Math.min(100, Math.max(5, Number(url.searchParams.get("per")) || 20));
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  return { per, page, offset: (page - 1) * per };
}
async function body<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try { return (await req.json()) as T; } catch { return null; }
}
const likeEsc = (s: string) => `%${s.replace(/[%_\\]/g, "\\$&")}%`;

export async function handleAdmin(req: Request, env: Env, url: URL): Promise<Response> {
  const seg = url.pathname.replace(/^\/api\/admin\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const method = req.method;
  const c: Ctx = { req, env, url, ip: ip(req), admin: null };

  // CSRF: SameSite=Strict cookies plus a custom header and same-origin check on every write.
  if (!["GET", "HEAD"].includes(method)) {
    const origin = req.headers.get("origin");
    if (req.headers.get("x-pepstop") !== "1" || (origin && origin !== url.origin)) return err(403, "forbidden");
  }

  // ---- unauthenticated ----
  if (method === "POST" && seg[0] === "login") return login(c);
  if (method === "POST" && seg[0] === "reset-password") return resetPassword(c);

  c.admin = await currentAdmin(req, env);
  if (!c.admin) return err(401, "unauthorized");
  const admin = c.admin;

  if (method === "GET" && seg[0] === "me") return json({ username: admin.username, role: admin.role, mustChange: !!admin.must_change });
  if (method === "POST" && seg[0] === "logout") {
    await env.DB.prepare("DELETE FROM admin_sessions WHERE id=?").bind(await sha256(cookieOf(req)!)).run();
    await log(env, admin, "logout", "admin", admin.id, undefined, c.ip);
    return json({ ok: true }, 200, { "set-cookie": setCookie("", 0) });
  }
  if (method === "POST" && seg[0] === "change-password") return changePassword(c);
  if (admin.must_change) return err(403, "password_change_required");

  const [a, b, d] = seg;
  const key = `${method} ${a}`;
  switch (key) {
    case "GET dashboard": return dashboard(c);
    case "GET settings": return json(await getSettings(env));
    case "PUT settings": return putSettings(c);
    case "GET logs": return listLogs(c);
    case "GET customers": return b ? customerProfile(c, b) : listCustomers(c);
    case "POST customers": return b && d === "status" ? customerStatus(c, b) : err(404, "not_found");
    case "PUT customers": return b ? saveCustomerNotes(c, b) : err(404, "not_found");
    case "GET variants": return json((await env.DB.prepare("SELECT v.*, p.name AS product_name FROM product_variants v JOIN products p ON p.id=v.product_id WHERE p.status!='archived' ORDER BY p.name, v.sort").all()).results);
    case "GET categories": return json((await env.DB.prepare("SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id=c.id) AS products FROM categories c ORDER BY sort,name").all()).results);
    case "POST categories": return saveCategory(c, null);
    case "PUT categories": return saveCategory(c, b);
    case "GET products": return b ? (d === "info" ? listInfo(c, b) : getProduct(c, b)) : listProducts(c);
    case "POST products": return b === undefined ? saveProduct(c, null) : b && d === "duplicate" ? duplicateProduct(c, b) : b && d === "status" ? productStatus(c, b) : err(404, "not_found");
    case "PUT products": return b ? saveProduct(c, b) : err(404, "not_found");
    case "POST info": return b === undefined ? saveInfo(c, null) : b && d === "status" ? infoStatus(c, b) : err(404, "not_found");
    case "PUT info": return b ? saveInfo(c, b) : err(404, "not_found");
    case "GET coa": return listCoa(c);
    case "POST coa": return b === undefined ? saveCoa(c, null) : b && d === "status" ? coaStatus(c, b) : err(404, "not_found");
    case "PUT coa": return b ? saveCoa(c, b) : err(404, "not_found");
    case "GET orders": return b ? getOrder(c, b) : listOrders(c);
    case "PATCH orders": return b ? patchOrder(c, b) : err(404, "not_found");
    case "POST orders": return b && d === "payments" && seg[3] ? payment(c, b, seg[3]) : err(404, "not_found");
    case "GET inquiries": return listInquiries(c);
    case "PUT inquiries": return b ? saveInquiry(c, b) : err(404, "not_found");
    case "GET articles": return b ? json(await env.DB.prepare("SELECT * FROM articles WHERE id=?").bind(b).first() ?? {}) : json((await env.DB.prepare("SELECT * FROM articles ORDER BY updated_at DESC").all()).results);
    case "POST articles": return b === undefined ? saveArticle(c, null) : b && d === "status" ? articleStatus(c, b) : err(404, "not_found");
    case "PUT articles": return b ? saveArticle(c, b) : err(404, "not_found");
    case "GET content": return json((await env.DB.prepare("SELECT * FROM site_content").all()).results);
    case "PUT content": return b && CONTENT_KEYS.includes(b) ? saveContent(c, b) : err(404, "not_found");
    case "POST content": return b && CONTENT_KEYS.includes(b) && (d === "publish" || d === "unpublish") ? publishContent(c, b, d) : err(404, "not_found");
    case "POST uploads": return upload(c, b);
    case "GET files": return adminFile(c, b, d);
    default: return err(404, "not_found");
  }
}

/* ---------------- auth ---------------- */

async function login(c: Ctx): Promise<Response> {
  const { env } = c;
  const data = await body<{ username?: string; password?: string }>(c.req);
  const username = clip(data?.username, 60).toLowerCase();
  const password = typeof data?.password === "string" ? data.password.slice(0, 200) : "";
  if (!(await rateLimit(env, `login-ip:${c.ip}`, 15, 900))) return err(429, "too_many_attempts");
  const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM admins").first<{ n: number }>();
  if (count?.n === 0 && env.ADMIN_BOOTSTRAP_PASSWORD) {
    // One-time provisioning from a Worker secret. The password never exists in source code.
    await env.DB.prepare("INSERT INTO admins (id,username,password_hash,must_change,role,created_at) VALUES (?,?,?,1,'super_admin',?)")
      .bind(uid(), "admin", await hashPassword(env.ADMIN_BOOTSTRAP_PASSWORD), now()).run();
    await log(env, null, "admin_provisioned", "admin", null, { username: "admin" }, c.ip);
  }
  const row = await env.DB.prepare("SELECT * FROM admins WHERE username=?").bind(username).first<{ id: string; username: string; password_hash: string; failed_count: number; locked_until: string | null; must_change: number }>();
  const fail = async (why: string) => {
    if (row) {
      const f = row.failed_count + 1;
      await env.DB.prepare("UPDATE admins SET failed_count=?, locked_until=? WHERE id=?").bind(f, f >= 5 ? new Date(Date.now() + 15 * 60000).toISOString() : row.locked_until, row.id).run();
    }
    await log(env, { username }, "login_failed", "admin", row?.id ?? null, { why }, c.ip);
    return err(401, "invalid_credentials");
  };
  if (!row) { await hashPassword(password); return fail("unknown_user"); }
  if (row.locked_until && Date.parse(row.locked_until) > Date.now()) return err(423, "locked", { until: row.locked_until });
  if (!(await verifyPassword(password, row.password_hash))) return fail("bad_password");
  await env.DB.prepare("UPDATE admins SET failed_count=0, locked_until=NULL, last_login_at=? WHERE id=?").bind(now(), row.id).run();
  const token = await newSession(env, row.id);
  await log(env, { id: row.id, username: row.username }, "login", "admin", row.id, undefined, c.ip);
  return json({ ok: true, mustChange: !!row.must_change }, 200, { "set-cookie": setCookie(token, MAX_MS / 1000) });
}

async function changePassword(c: Ctx): Promise<Response> {
  const { env, admin } = c;
  const data = await body<{ current?: string; next?: string }>(c.req);
  const row = await env.DB.prepare("SELECT password_hash FROM admins WHERE id=?").bind(admin!.id).first<{ password_hash: string }>();
  if (!row || typeof data?.current !== "string" || !(await verifyPassword(data.current, row.password_hash))) return err(400, "current_password_wrong");
  const next = typeof data.next === "string" ? data.next : "";
  const problem = next === data.current ? "Choose a password different from your current one." : passwordProblem(next);
  if (problem) return err(400, "weak_password", { message: problem });
  await env.DB.prepare("UPDATE admins SET password_hash=?, must_change=0 WHERE id=?").bind(await hashPassword(next), admin!.id).run();
  await env.DB.prepare("DELETE FROM admin_sessions WHERE admin_id=?").bind(admin!.id).run(); // invalidate every session
  const token = await newSession(env, admin!.id);
  await log(env, admin, "password_changed", "admin", admin!.id, undefined, c.ip);
  return json({ ok: true }, 200, { "set-cookie": setCookie(token, MAX_MS / 1000) });
}

/** Administrator reset: requires the developer-held ADMIN_RESET_TOKEN secret. */
async function resetPassword(c: Ctx): Promise<Response> {
  const { env } = c;
  const data = await body<{ token?: string; next?: string }>(c.req);
  if (!(await rateLimit(env, `reset-ip:${c.ip}`, 5, 900))) return err(429, "too_many_attempts");
  if (!env.ADMIN_RESET_TOKEN || typeof data?.token !== "string" || (await sha256(data.token)) !== (await sha256(env.ADMIN_RESET_TOKEN))) {
    await log(env, null, "reset_failed", "admin", null, undefined, c.ip);
    return err(403, "invalid_reset_token");
  }
  const next = typeof data.next === "string" ? data.next : "";
  const problem = passwordProblem(next);
  if (problem) return err(400, "weak_password", { message: problem });
  const row = await env.DB.prepare("SELECT id FROM admins WHERE username='admin'").first<{ id: string }>();
  if (!row) return err(404, "no_admin");
  await env.DB.prepare("UPDATE admins SET password_hash=?, must_change=0, failed_count=0, locked_until=NULL WHERE id=?").bind(await hashPassword(next), row.id).run();
  await env.DB.prepare("DELETE FROM admin_sessions WHERE admin_id=?").bind(row.id).run();
  await log(env, { id: row.id, username: "admin" }, "password_reset", "admin", row.id, undefined, c.ip);
  return json({ ok: true });
}

/* ---------------- dashboard, settings, logs ---------------- */

async function dashboard(c: Ctx) {
  const q = async (sql: string) => (await c.env.DB.prepare(sql).first<{ n: number }>())?.n ?? 0;
  const all = c.env.DB;
  const rows = async (sql: string) => (await all.prepare(sql).all()).results;
  return json({
    cards: {
      customers: await q("SELECT COUNT(*) n FROM customers"),
      pendingCustomers: await q("SELECT COUNT(*) n FROM customers WHERE status='pending'"),
      approvedCustomers: await q("SELECT COUNT(*) n FROM customers WHERE status='approved'"),
      rejectedCustomers: await q("SELECT COUNT(*) n FROM customers WHERE status='rejected'"),
      suspendedCustomers: await q("SELECT COUNT(*) n FROM customers WHERE status='suspended'"),
      totalProducts: await q("SELECT COUNT(*) n FROM products WHERE status!='archived'"),
      published: await q("SELECT COUNT(*) n FROM products WHERE status='published'"),
      unpublished: await q("SELECT COUNT(*) n FROM products WHERE status IN ('draft') AND status!='archived'"),
      newOrders: await q("SELECT COUNT(*) n FROM orders WHERE order_status='new_order'"),
      reviewOrders: await q("SELECT COUNT(*) n FROM orders WHERE order_status IN ('under_review','awaiting_payment','payment_submitted')"),
      pendingPayments: await q("SELECT COUNT(*) n FROM payments WHERE status='submitted'"),
      inquiries: await q("SELECT COUNT(*) n FROM customer_inquiries WHERE archived=0"),
    },
    pendingList: await rows("SELECT id,full_name,phone,created_at FROM customers WHERE status='pending' ORDER BY created_at DESC LIMIT 5"),
    latestOrders: await rows("SELECT id,ref,full_name,total,order_status,created_at FROM orders ORDER BY created_at DESC LIMIT 5"),
    updatedProducts: await rows("SELECT id,name,status,updated_at FROM products ORDER BY updated_at DESC LIMIT 5"),
    coas: await rows("SELECT id,title,batch,uploaded_at FROM coa_documents ORDER BY uploaded_at DESC LIMIT 5"),
    activity: await rows("SELECT at,username,action,entity FROM admin_activity_logs ORDER BY at DESC LIMIT 8"),
  });
}

async function putSettings(c: Ctx) {
  const data = await body<Record<string, unknown>>(c.req);
  if (!data) return err(400, "bad_request");
  const allowed: Record<string, (v: unknown) => string | null> = {
    search_visibility: (v) => (v === "visible" || v === "hidden" ? v : null),
    delivery_fee: (v) => (v === "" || v === null ? "" : intOrNull(v) === null ? null : String(intOrNull(v))),
    cod_enabled: (v) => (v === "1" || v === "0" ? v : null),
    disclose_rejection_reason: (v) => (v === "1" || v === "0" ? v : null),
    registration_message: (v) => (typeof v === "string" && v.trim().length > 0 ? clip(v, 4000) : null),
    contact_messenger: (v) => (typeof v === "string" && (v.trim() === "" || /^https:\/\//i.test(v.trim())) ? clip(v, 300) : null),
    contact_whatsapp: (v) => (typeof v === "string" && (v.trim() === "" || /^\+?\d[\d\s-]{6,20}$/.test(v.trim())) ? clip(v, 30) : null),
    contact_phone: (v) => (typeof v === "string" && (v.trim() === "" || /^\+?\d[\d\s-]{6,20}$/.test(v.trim())) ? clip(v, 30) : null),
    payment_instructions: (v) => (typeof v === "string" ? clip(v, 4000) : null),
  };
  for (const [k, fn] of Object.entries(allowed)) {
    if (!(k in data)) continue;
    const val = fn(data[k]);
    if (val === null) return err(400, "invalid_" + k);
    await c.env.DB.prepare("INSERT INTO site_settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k, val).run();
  }
  await log(c.env, c.admin, "settings_updated", "settings", null, data, c.ip);
  return json(await getSettings(c.env));
}

async function listLogs(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const total = (await c.env.DB.prepare("SELECT COUNT(*) n FROM admin_activity_logs").first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare("SELECT * FROM admin_activity_logs ORDER BY at DESC LIMIT ? OFFSET ?").bind(per, offset).all()).results;
  return json({ total, rows });
}

/* ---------------- categories ---------------- */

async function saveCategory(c: Ctx, id: string | null | undefined) {
  const d = await body<Record<string, unknown>>(c.req);
  const name = clip(d?.name, 80);
  if (!d || !name) return err(400, "name_required");
  const slug = slugify(clip(d.slug, 80) || name);
  const status = d.status === "draft" ? "draft" : "published";
  const fields = [name, slug, clip(d.description, 1000), clip(d.image, 300) || null, intOrNull(d.sort) ?? 0, status] as const;
  const isNew = !id;
  try {
    if (id) await c.env.DB.prepare("UPDATE categories SET name=?,slug=?,description=?,image=?,sort=?,status=? WHERE id=?").bind(...fields, id).run();
    else { id = slug; await c.env.DB.prepare("INSERT INTO categories (name,slug,description,image,sort,status,id) VALUES (?,?,?,?,?,?,?)").bind(...fields, id).run(); }
  } catch { return err(409, "slug_in_use"); }
  await log(c.env, c.admin, isNew ? "category_created" : "category_saved", "category", id, { name }, c.ip);
  return json({ ok: true, id });
}

/* ---------------- products ---------------- */

async function uniqueSlug(env: Env, table: string, base: string, exceptId: string | null) {
  let s = base || "item", n = 1;
  for (;;) {
    const hit = await env.DB.prepare(`SELECT id FROM ${table} WHERE slug=?`).bind(s).first<{ id: string }>();
    if (!hit || hit.id === exceptId) return s;
    s = `${base}-${++n}`;
  }
}

async function listProducts(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const p = c.url.searchParams;
  const where: string[] = []; const args: unknown[] = [];
  if (p.get("q")) { where.push("p.name LIKE ? ESCAPE '\\'"); args.push(likeEsc(p.get("q")!)); }
  if (p.get("category")) { where.push("p.category_id=?"); args.push(p.get("category")); }
  const st = p.get("status");
  if (st === "unpublished") where.push("p.status='draft' AND p.unpublished=1");
  else if (st === "draft") where.push("p.status='draft' AND p.unpublished=0");
  else if (st) { where.push("p.status=?"); args.push(st); } else where.push("p.status!='archived'");
  if (p.get("regulatory")) { where.push("p.regulatory_status=?"); args.push(p.get("regulatory")); }
  if (p.get("availability")) { where.push("p.availability=?"); args.push(p.get("availability")); }
  const order = p.get("sort") === "name" ? "p.name COLLATE NOCASE" : "p.updated_at DESC";
  const w = where.length ? "WHERE " + where.join(" AND ") : "";
  const total = (await c.env.DB.prepare(`SELECT COUNT(*) n FROM products p ${w}`).bind(...args).first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare(`SELECT p.id,p.slug,p.name,p.main_image,p.base_price,p.availability,CASE WHEN p.status='draft' AND p.unpublished=1 THEN 'unpublished' ELSE p.status END AS status,p.regulatory_status,p.updated_at,c.name AS category,(SELECT COUNT(*) FROM product_variants v WHERE v.product_id=p.id) AS variants FROM products p LEFT JOIN categories c ON c.id=p.category_id ${w} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, per, offset).all()).results;
  return json({ total, rows });
}

async function getProduct(c: Ctx, id: string) {
  const p = await c.env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first();
  if (!p) return err(404, "not_found");
  const variants = (await c.env.DB.prepare("SELECT * FROM product_variants WHERE product_id=? ORDER BY sort").bind(id).all()).results;
  const images = (await c.env.DB.prepare("SELECT * FROM product_images WHERE product_id=? ORDER BY sort").bind(id).all()).results;
  const row = p as Record<string, any>;
  return json({ ...row, status: row.status === "draft" && row.unpublished ? "unpublished" : row.status, variants, images });
}

async function saveProduct(c: Ctx, id: string | null) {
  const d = await body<Record<string, any>>(c.req);
  const name = clip(d?.name, 140);
  if (!d || !name) return err(400, "name_required");
  const { env } = c;
  const slug = await uniqueSlug(env, "products", slugify(clip(d.slug, 100) || name), id);
  const wanted = PUB_STATUSES.includes(d.status) ? d.status : "draft";
  const avail = ["available", "ask", "unavailable"].includes(d.availability) ? d.availability : "ask";
  const existing = id ? await env.DB.prepare("SELECT regulatory_status FROM products WHERE id=?").bind(id).first<{ regulatory_status: string }>() : null;
  if (id && !existing) return err(404, "not_found");
  const regulatory = REG_STATUSES.includes(d.regulatory_status) ? d.regulatory_status : (existing?.regulatory_status ?? "pending_review");
  // Server-side gate: nothing is published without a verified regulatory status. The UI cannot bypass it.
  if (wanted === "published" && regulatory !== "verified") return err(409, "regulatory_review_required", { message: GATE_MESSAGE });
  const { status, unpublished } = toDb(wanted);
  const t = now();
  const vals = [name, slug, clip(d.short_description, 400), sanitizeHtml(clip(d.full_description, 20000)), clip(d.category_id, 80) || null, clip(d.main_image, 300) || null, intOrNull(d.sort) ?? 0,
    clip(d.overview, 5000), clip(d.specifications, 5000), clip(d.composition, 5000), clip(d.packaging, 2000), clip(d.storage, 2000), clip(d.notes, 5000),
    clip(d.reg_type, 80) || null, clip(d.reg_number, 80) || null, clip(d.reg_holder, 120) || null,
    intOrNull(d.base_price), avail, d.show_price ? 1 : 0, d.inquire_price === false || d.inquire_price === 0 ? 0 : 1, status, regulatory, unpublished];
  const isNew = !id;
  if (isNew) {
    id = uid();
    await env.DB.prepare("INSERT INTO products (name,slug,short_description,full_description,category_id,main_image,sort,overview,specifications,composition,packaging,storage,notes,reg_type,reg_number,reg_holder,base_price,availability,show_price,inquire_price,status,regulatory_status,unpublished,id,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(...vals, id, t, t).run();
  } else {
    const r = await env.DB.prepare("UPDATE products SET name=?,slug=?,short_description=?,full_description=?,category_id=?,main_image=?,sort=?,overview=?,specifications=?,composition=?,packaging=?,storage=?,notes=?,reg_type=?,reg_number=?,reg_holder=?,base_price=?,availability=?,show_price=?,inquire_price=?,status=?,regulatory_status=?,unpublished=?,updated_at=? WHERE id=?").bind(...vals, t, id).run();
    if (!r.meta.changes) return err(404, "not_found");
  }
  const pid = id as string;
  const stmts: D1PreparedStatement[] = [env.DB.prepare("DELETE FROM product_variants WHERE product_id=?").bind(pid), env.DB.prepare("DELETE FROM product_images WHERE product_id=?").bind(pid)];
  (Array.isArray(d.variants) ? d.variants : []).slice(0, 40).forEach((v: any, i: number) => {
    const vname = clip(v?.name, 100); if (!vname) return;
    stmts.push(env.DB.prepare("INSERT INTO product_variants (id,product_id,name,strength,sku,price,availability,image,sort,status) VALUES (?,?,?,?,?,?,?,?,?,?)")
      .bind(clip(v.id, 40) || uid(), pid, vname, clip(v.strength, 100), clip(v.sku, 80), intOrNull(v.price), ["available", "ask", "unavailable"].includes(v.availability) ? v.availability : "available", clip(v.image, 300) || null, i, v.status === "draft" ? "draft" : "published"));
  });
  (Array.isArray(d.images) ? d.images : []).slice(0, 20).forEach((im: any, i: number) => {
    const u = clip(typeof im === "string" ? im : im?.image, 300); if (u) stmts.push(env.DB.prepare("INSERT INTO product_images (id,product_id,image,sort) VALUES (?,?,?,?)").bind(uid(), pid, u, i));
  });
  await env.DB.batch(stmts);
  await log(env, c.admin, isNew ? "product_created" : wanted === "published" ? "product_published" : "product_updated", "product", pid, { name, status: wanted, regulatory }, c.ip);
  return json({ ok: true, id: pid, slug });
}

async function productStatus(c: Ctx, id: string) {
  const d = await body<{ status?: string; regulatory_status?: string }>(c.req);
  const p = await c.env.DB.prepare("SELECT regulatory_status FROM products WHERE id=?").bind(id).first<{ regulatory_status: string }>();
  if (!p) return err(404, "not_found");
  if (d?.regulatory_status !== undefined) {
    if (!REG_STATUSES.includes(d.regulatory_status)) return err(400, "bad_status");
    // Leaving "verified" takes a published product off the catalog immediately.
    await c.env.DB.prepare("UPDATE products SET regulatory_status=?, status=CASE WHEN ?!='verified' AND status='published' THEN 'draft' ELSE status END, unpublished=CASE WHEN ?!='verified' AND status='published' THEN 1 ELSE unpublished END, updated_at=? WHERE id=?").bind(d.regulatory_status, d.regulatory_status, d.regulatory_status, now(), id).run();
    await log(c.env, c.admin, "product_regulatory_status_changed", "product", id, { from: p.regulatory_status, to: d.regulatory_status }, c.ip);
    return json({ ok: true });
  }
  if (!d || !PUB_STATUSES.includes(d.status ?? "")) return err(400, "bad_status");
  if (d.status === "published" && p.regulatory_status !== "verified") return err(409, "regulatory_review_required", { message: GATE_MESSAGE });
  const m = toDb(d.status!);
  await c.env.DB.prepare("UPDATE products SET status=?, unpublished=?, updated_at=? WHERE id=?").bind(m.status, m.unpublished, now(), id).run();
  await log(c.env, c.admin, d.status === "archived" ? "product_archived" : d.status === "published" ? "product_published" : "product_unpublished", "product", id, undefined, c.ip);
  return json({ ok: true });
}

async function duplicateProduct(c: Ctx, id: string) {
  const p = await c.env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first<Record<string, any>>();
  if (!p) return err(404, "not_found");
  const nid = uid(), t = now();
  const slug = await uniqueSlug(c.env, "products", `${p.slug}-copy`, null);
  await c.env.DB.prepare("INSERT INTO products (id,slug,name,short_description,full_description,category_id,main_image,sort,overview,specifications,composition,packaging,storage,notes,reg_type,reg_number,reg_holder,base_price,availability,show_price,inquire_price,status,created_at,updated_at) SELECT ?,?,name || ' (copy)',short_description,full_description,category_id,main_image,sort,overview,specifications,composition,packaging,storage,notes,reg_type,reg_number,reg_holder,base_price,availability,show_price,inquire_price,'draft',?,? FROM products WHERE id=?").bind(nid, slug, t, t, id).run();
  await c.env.DB.prepare("INSERT INTO product_variants (id,product_id,name,strength,sku,price,availability,image,sort,status) SELECT lower(hex(randomblob(16))),?,name,strength,sku,price,availability,image,sort,status FROM product_variants WHERE product_id=?").bind(nid, id).run();
  await c.env.DB.prepare("INSERT INTO product_images (id,product_id,image,sort) SELECT lower(hex(randomblob(16))),?,image,sort FROM product_images WHERE product_id=?").bind(nid, id).run();
  await log(c.env, c.admin, "product_duplicated", "product", nid, { from: id }, c.ip);
  return json({ ok: true, id: nid });
}

/* ---------------- product information ---------------- */

async function listInfo(c: Ctx, productId: string) {
  return json((await c.env.DB.prepare("SELECT * FROM product_information WHERE product_id=? ORDER BY section").bind(productId).all()).results);
}
async function saveInfo(c: Ctx, id: string | null | undefined) {
  const d = await body<Record<string, any>>(c.req);
  if (!d || !INFO_SECTIONS.includes(d.section)) return err(400, "bad_section");
  const review = ["not_reviewed", "in_review", "reviewed"].includes(d.review_status) ? d.review_status : "not_reviewed";
  const html = sanitizeHtml(clip(d.body_html, 100000));
  if (id) {
    const r = await c.env.DB.prepare("UPDATE product_information SET section=?,body_html=?,review_status=?,updated_at=?,status=CASE WHEN status='published' THEN 'draft' ELSE status END WHERE id=?").bind(d.section, html, review, now(), id).run();
    if (!r.meta.changes) return err(404, "not_found");
  } else {
    id = uid();
    if (!(await c.env.DB.prepare("SELECT id FROM products WHERE id=?").bind(clip(d.product_id, 60)).first())) return err(400, "bad_product");
    await c.env.DB.prepare("INSERT INTO product_information (id,product_id,section,body_html,status,review_status,updated_at) VALUES (?,?,?,?, 'draft',?,?)").bind(id, clip(d.product_id, 60), d.section, html, review, now()).run();
  }
  await log(c.env, c.admin, "product_information_saved", "product_information", id, { section: d.section }, c.ip);
  return json({ ok: true, id });
}
async function infoStatus(c: Ctx, id: string) {
  const d = await body<{ status?: string }>(c.req);
  if (!d || !["draft", "published", "archived"].includes(d.status ?? "")) return err(400, "bad_status");
  const row = await c.env.DB.prepare("SELECT section, review_status FROM product_information WHERE id=?").bind(id).first<{ section: string; review_status: string }>();
  if (!row) return err(404, "not_found");
  // Guidelines are never published until a person marks them reviewed.
  if (d.status === "published" && row.section === "guidelines" && row.review_status !== "reviewed") return err(409, "review_required");
  await c.env.DB.prepare("UPDATE product_information SET status=?, updated_at=? WHERE id=?").bind(d.status, now(), id).run();
  await log(c.env, c.admin, "product_information_" + d.status, "product_information", id, undefined, c.ip);
  return json({ ok: true });
}

/* ---------------- COA ---------------- */

async function listCoa(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const p = c.url.searchParams;
  const where: string[] = []; const args: unknown[] = [];
  if (p.get("q")) { where.push("(pr.name LIKE ? ESCAPE '\\' OR d.batch LIKE ? ESCAPE '\\' OR d.title LIKE ? ESCAPE '\\')"); const q = likeEsc(p.get("q")!); args.push(q, q, q); }
  if (p.get("status")) { where.push("d.status=?"); args.push(p.get("status")); } else where.push("d.status!='archived'");
  const w = "WHERE " + where.join(" AND ");
  const total = (await c.env.DB.prepare(`SELECT COUNT(*) n FROM coa_documents d JOIN products pr ON pr.id=d.product_id ${w}`).bind(...args).first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare(`SELECT d.*, pr.name AS product_name FROM coa_documents d JOIN products pr ON pr.id=d.product_id ${w} ORDER BY d.uploaded_at DESC LIMIT ? OFFSET ?`).bind(...args, per, offset).all()).results;
  return json({ total, rows });
}
async function saveCoa(c: Ctx, id: string | null | undefined) {
  const d = await body<Record<string, any>>(c.req);
  const title = clip(d?.title, 200), batch = clip(d?.batch, 80);
  if (!d || !title || !batch) return err(400, "title_and_batch_required");
  if (!(await c.env.DB.prepare("SELECT id FROM products WHERE id=?").bind(clip(d.product_id, 60)).first())) return err(400, "bad_product");
  const status = ["draft", "published", "archived"].includes(d.status) ? d.status : "draft";
  const fileKey = clip(d.file_key, 120);
  if (fileKey && !/^coa\/[a-f0-9]{32}\.pdf$/.test(fileKey)) return err(400, "bad_file");
  const t = now();
  if (id) {
    const old = await c.env.DB.prepare("SELECT file_key FROM coa_documents WHERE id=?").bind(id).first<{ file_key: string }>();
    if (!old) return err(404, "not_found");
    const replaced = fileKey && fileKey !== old.file_key;
    await c.env.DB.prepare("UPDATE coa_documents SET product_id=?,batch=?,title=?,doc_date=?,notes=?,status=?,file_key=?,file_name=COALESCE(?,file_name),size=COALESCE(?,size),updated_at=? WHERE id=?")
      .bind(clip(d.product_id, 60), batch, title, clip(d.doc_date, 20) || null, clip(d.notes, 2000), status, fileKey || old.file_key, replaced ? clip(d.file_name, 200) : null, replaced ? intOrNull(d.size) : null, t, id).run();
    await log(c.env, c.admin, replaced ? "coa_replaced" : "coa_updated", "coa", id, { title, batch }, c.ip);
  } else {
    if (!fileKey) return err(400, "file_required");
    id = uid();
    await c.env.DB.prepare("INSERT INTO coa_documents (id,product_id,batch,title,file_key,file_name,size,doc_date,notes,status,uploaded_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
      .bind(id, clip(d.product_id, 60), batch, title, fileKey, clip(d.file_name, 200), intOrNull(d.size) ?? 0, clip(d.doc_date, 20) || null, clip(d.notes, 2000), status, t, t).run();
    await log(c.env, c.admin, "coa_uploaded", "coa", id, { title, batch }, c.ip);
  }
  return json({ ok: true, id });
}
async function coaStatus(c: Ctx, id: string) {
  const d = await body<{ status?: string }>(c.req);
  if (!d || !["draft", "published", "archived"].includes(d.status ?? "")) return err(400, "bad_status");
  const r = await c.env.DB.prepare("UPDATE coa_documents SET status=?, updated_at=? WHERE id=?").bind(d.status, now(), id).run();
  if (!r.meta.changes) return err(404, "not_found");
  await log(c.env, c.admin, "coa_" + d.status, "coa", id, undefined, c.ip);
  return json({ ok: true });
}

/* ---------------- orders and payments ---------------- */

async function listOrders(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const p = c.url.searchParams;
  const where: string[] = []; const args: unknown[] = [];
  if (p.get("q")) { where.push("(o.ref LIKE ? ESCAPE '\\' OR o.full_name LIKE ? ESCAPE '\\' OR o.mobile LIKE ? ESCAPE '\\')"); const q = likeEsc(p.get("q")!); args.push(q, q, q); }
  if (p.get("status")) { where.push("o.order_status=?"); args.push(p.get("status")); }
  if (p.get("payment")) { where.push("o.payment_status=?"); args.push(p.get("payment")); }
  const w = where.length ? "WHERE " + where.join(" AND ") : "";
  const total = (await c.env.DB.prepare(`SELECT COUNT(*) n FROM orders o ${w}`).bind(...args).first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare(`SELECT o.id,o.ref,o.full_name,o.created_at,o.total,o.has_unpriced,o.payment_method,o.payment_status,o.order_status,(SELECT COALESCE(SUM(qty),0) FROM order_items i WHERE i.order_id=o.id) AS items FROM orders o ${w} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`).bind(...args, per, offset).all()).results;
  return json({ total, rows });
}
async function getOrder(c: Ctx, id: string) {
  const o = await c.env.DB.prepare("SELECT * FROM orders WHERE id=?").bind(id).first();
  if (!o) return err(404, "not_found");
  const q = async (sql: string) => (await c.env.DB.prepare(sql).bind(id).all()).results;
  return json({ ...o, items: await q("SELECT * FROM order_items WHERE order_id=?"), payments: await q("SELECT * FROM payments WHERE order_id=? ORDER BY created_at DESC"), history: await q("SELECT * FROM order_history WHERE order_id=? ORDER BY at DESC") });
}
async function patchOrder(c: Ctx, id: string) {
  const d = await body<Record<string, any>>(c.req);
  const o = await c.env.DB.prepare("SELECT order_status, subtotal, delivery_fee FROM orders WHERE id=?").bind(id).first<{ order_status: string; subtotal: number; delivery_fee: number | null }>();
  if (!d || !o) return err(o ? 400 : 404, o ? "bad_request" : "not_found");
  const sets: string[] = []; const args: unknown[] = [];
  const t = now();
  if (typeof d.internal_notes === "string") { sets.push("internal_notes=?"); args.push(clip(d.internal_notes, 5000)); }
  if ("delivery_fee" in d) {
    const fee = intOrNull(d.delivery_fee);
    sets.push("delivery_fee=?", "total=?"); args.push(fee, o.subtotal + (fee ?? 0));
  }
  let statusChanged = false;
  if (d.order_status && d.order_status !== o.order_status) {
    if (!ORDER_STATUSES.includes(d.order_status)) return err(400, "bad_status");
    sets.push("order_status=?"); args.push(d.order_status); statusChanged = true;
  }
  if (sets.length) {
    await c.env.DB.prepare(`UPDATE orders SET ${sets.join(",")}, updated_at=? WHERE id=?`).bind(...args, t, id).run();
  }
  if (statusChanged) {
    await c.env.DB.prepare("INSERT INTO order_history (id,order_id,at,status,note,by_user) VALUES (?,?,?,?,?,?)").bind(uid(), id, t, d.order_status, clip(d.note, 1000), c.admin!.username).run();
    await log(c.env, c.admin, "order_status_changed", "order", id, { from: o.order_status, to: d.order_status }, c.ip);
  } else if (sets.length) await log(c.env, c.admin, "order_updated", "order", id, undefined, c.ip);
  return json({ ok: true });
}
async function payment(c: Ctx, orderId: string, paymentId: string) {
  const d = await body<{ action?: string; notes?: string }>(c.req);
  if (!d || !["verify", "reject"].includes(d.action ?? "")) return err(400, "bad_action");
  const p = await c.env.DB.prepare("SELECT id FROM payments WHERE id=? AND order_id=?").bind(paymentId, orderId).first();
  if (!p) return err(404, "not_found");
  const status = d.action === "verify" ? "verified" : "rejected";
  const t = now();
  await c.env.DB.prepare("UPDATE payments SET status=?, notes=?, verified_at=? WHERE id=?").bind(status, clip(d.notes, 2000), t, paymentId).run();
  await c.env.DB.prepare("UPDATE orders SET payment_status=?, updated_at=? WHERE id=?").bind(status, t, orderId).run();
  await c.env.DB.prepare("INSERT INTO order_history (id,order_id,at,status,note,by_user) VALUES (?,?,?,?,?,?)").bind(uid(), orderId, t, "payment_" + status, clip(d.notes, 1000), c.admin!.username).run();
  await log(c.env, c.admin, "payment_" + status, "order", orderId, { paymentId }, c.ip);
  return json({ ok: true });
}

/* ---------------- inquiries, articles, content ---------------- */

async function listInquiries(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const s = c.url.searchParams.get("status");
  const archived = c.url.searchParams.get("archived") === "1" ? 1 : 0;
  const where = s ? "WHERE archived=? AND status=?" : "WHERE archived=?";
  const args = s ? [archived, s] : [archived];
  const total = (await c.env.DB.prepare(`SELECT COUNT(*) n FROM customer_inquiries ${where}`).bind(...args).first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare(`SELECT * FROM customer_inquiries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...args, per, offset).all()).results;
  return json({ total, rows });
}
async function saveInquiry(c: Ctx, id: string) {
  const d = await body<Record<string, any>>(c.req);
  if (!d || (d.status && !["new", "in_progress", "responded", "closed"].includes(d.status))) return err(400, "bad_request");
  const r = await c.env.DB.prepare("UPDATE customer_inquiries SET status=COALESCE(?,status), notes=COALESCE(?,notes), archived=COALESCE(?,archived) WHERE id=?")
    .bind(d.status ?? null, typeof d.notes === "string" ? clip(d.notes, 5000) : null, typeof d.archived === "boolean" ? (d.archived ? 1 : 0) : null, id).run();
  if (!r.meta.changes) return err(404, "not_found");
  await log(c.env, c.admin, "inquiry_updated", "inquiry", id, { status: d.status }, c.ip);
  return json({ ok: true });
}

async function saveArticle(c: Ctx, id: string | null | undefined) {
  const d = await body<Record<string, any>>(c.req);
  const title = clip(d?.title, 200);
  if (!d || !title) return err(400, "title_required");
  const slug = await uniqueSlug(c.env, "articles", slugify(clip(d.slug, 100) || title), id ?? null);
  const html = sanitizeHtml(clip(d.content_html, 100000));
  const status = ["draft", "published", "archived"].includes(d.status) ? d.status : "draft";
  const pub = clip(d.published_at, 30) || (status === "published" ? now() : null);
  const t = now();
  if (id) {
    const r = await c.env.DB.prepare("UPDATE articles SET slug=?,title=?,summary=?,thumbnail=?,content_html=?,published_at=?,status=?,updated_at=? WHERE id=?").bind(slug, title, clip(d.summary, 500), clip(d.thumbnail, 300) || null, html, pub, status, t, id).run();
    if (!r.meta.changes) return err(404, "not_found");
  } else {
    id = uid();
    await c.env.DB.prepare("INSERT INTO articles (id,slug,title,summary,thumbnail,content_html,published_at,status,updated_at) VALUES (?,?,?,?,?,?,?,?,?)").bind(id, slug, title, clip(d.summary, 500), clip(d.thumbnail, 300) || null, html, pub, status, t).run();
  }
  await log(c.env, c.admin, "article_saved", "article", id, { title, status }, c.ip);
  return json({ ok: true, id, slug });
}
async function articleStatus(c: Ctx, id: string) {
  const d = await body<{ status?: string }>(c.req);
  if (!d || !["draft", "published", "archived"].includes(d.status ?? "")) return err(400, "bad_status");
  const r = await c.env.DB.prepare("UPDATE articles SET status=?, updated_at=?, published_at=CASE WHEN ?='published' AND published_at IS NULL THEN ? ELSE published_at END WHERE id=?").bind(d.status, now(), d.status, now(), id).run();
  if (!r.meta.changes) return err(404, "not_found");
  await log(c.env, c.admin, "article_" + d.status, "article", id, undefined, c.ip);
  return json({ ok: true });
}

async function saveContent(c: Ctx, key: string) {
  const d = await body<{ draft?: Record<string, unknown> }>(c.req);
  if (!d?.draft || typeof d.draft !== "object") return err(400, "bad_request");
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(d.draft)) if (/^[a-zA-Z]{1,40}$/.test(k) && typeof v === "string") clean[k] = clip(v, 4000);
  await c.env.DB.prepare("INSERT INTO site_content (key,draft,published,updated_at) VALUES (?,?,NULL,?) ON CONFLICT(key) DO UPDATE SET draft=excluded.draft, updated_at=excluded.updated_at").bind(key, JSON.stringify(clean), now()).run();
  await log(c.env, c.admin, "website_content_saved", "content", key, undefined, c.ip);
  return json({ ok: true });
}
async function publishContent(c: Ctx, key: string, action: string) {
  const row = await c.env.DB.prepare("SELECT draft FROM site_content WHERE key=?").bind(key).first<{ draft: string | null }>();
  if (action === "publish") {
    if (!row?.draft) return err(400, "nothing_to_publish");
    await c.env.DB.prepare("UPDATE site_content SET published=draft, updated_at=? WHERE key=?").bind(now(), key).run();
  } else await c.env.DB.prepare("UPDATE site_content SET published=NULL, updated_at=? WHERE key=?").bind(now(), key).run();
  await log(c.env, c.admin, "website_content_" + action + "ed", "content", key, undefined, c.ip);
  return json({ ok: true });
}

/* ---------------- uploads and private files ---------------- */

async function upload(c: Ctx, kind: string | undefined) {
  // image = public site images; catalog = private product images; coa = certificate PDFs; proof = payment proofs.
  if (!kind || !["image", "catalog", "coa", "proof"].includes(kind)) return err(404, "not_found");
  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return err(400, "file_required");
  const max = kind === "coa" ? 10 * 1048576 : 5 * 1048576;
  if (file.size > max) return err(413, "file_too_large");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniff(bytes);
  const ok = type && (kind === "coa" ? type.ext === "pdf" : kind === "image" || kind === "catalog" ? type.ext !== "pdf" : true);
  if (!ok) return err(415, "unsupported_file_type");
  const dir = kind === "image" ? "images" : kind;
  const key = `${dir}/${uid()}.${type.ext}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type.mime } });
  await log(c.env, c.admin, "file_uploaded", kind, key, { size: file.size }, c.ip);
  return json({ ok: true, key, url: kind === "image" || kind === "catalog" ? `/files/${key}` : null, name: file.name.slice(0, 200), size: file.size });
}

async function adminFile(c: Ctx, kind: string | undefined, id: string | undefined) {
  if (!kind || !id) return err(404, "not_found");
  let key: string | null = null;
  if (kind === "coa") key = (await c.env.DB.prepare("SELECT file_key FROM coa_documents WHERE id=?").bind(id).first<{ file_key: string }>())?.file_key ?? null;
  if (kind === "proof") key = (await c.env.DB.prepare("SELECT proof_key FROM payments WHERE id=?").bind(id).first<{ proof_key: string | null }>())?.proof_key ?? null;
  if (!key) return err(404, "not_found");
  const obj = await c.env.FILES.get(key);
  if (!obj) return err(404, "not_found");
  return new Response(obj.body, { headers: { "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream", "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow", "content-disposition": "inline", "x-content-type-options": "nosniff" } });
}

/* ---------------- customer access management ---------------- */

const CUSTOMER_ACTIONS: Record<string, { from: string[]; to: string }> = {
  approve: { from: ["pending", "rejected"], to: "approved" },
  reject: { from: ["pending"], to: "rejected" },
  suspend: { from: ["approved"], to: "suspended" },
  restore: { from: ["suspended"], to: "approved" },
};

async function listCustomers(c: Ctx) {
  const { per, offset } = pageOf(c.url);
  const p = c.url.searchParams;
  const where: string[] = []; const args: unknown[] = [];
  if (p.get("q")) { where.push("(full_name LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\')"); const q = likeEsc(p.get("q")!); args.push(q, q); }
  if (p.get("status")) { where.push("status=?"); args.push(p.get("status")); }
  const w = where.length ? "WHERE " + where.join(" AND ") : "";
  const total = (await c.env.DB.prepare(`SELECT COUNT(*) n FROM customers ${w}`).bind(...args).first<{ n: number }>())!.n;
  const rows = (await c.env.DB.prepare(`SELECT id,full_name,phone,status,created_at,last_login_at FROM customers ${w} ORDER BY CASE status WHEN 'pending' THEN 0 ELSE 1 END, created_at DESC LIMIT ? OFFSET ?`).bind(...args, per, offset).all()).results;
  return json({ total, rows });
}

async function customerProfile(c: Ctx, id: string) {
  const cu = await c.env.DB.prepare("SELECT id,full_name,phone,status,status_note,admin_notes,created_at,decided_at,last_login_at FROM customers WHERE id=?").bind(id).first();
  if (!cu) return err(404, "not_found");
  const history = (await c.env.DB.prepare("SELECT * FROM customer_status_history WHERE customer_id=? ORDER BY at DESC").bind(id).all()).results;
  const orders = (await c.env.DB.prepare("SELECT id,ref,total,order_status,created_at FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 20").bind(id).all()).results;
  const activity = (await c.env.DB.prepare("SELECT at,username,action,detail FROM admin_activity_logs WHERE entity='customer' AND entity_id=? ORDER BY at DESC LIMIT 20").bind(id).all()).results;
  return json({ ...cu, history, orders, activity });
}

async function customerStatus(c: Ctx, id: string) {
  const d = await body<{ action?: string; note?: string }>(c.req);
  const rule = d?.action ? CUSTOMER_ACTIONS[d.action] : undefined;
  if (!d || !rule) return err(400, "bad_action");
  const cu = await c.env.DB.prepare("SELECT status FROM customers WHERE id=?").bind(id).first<{ status: string }>();
  if (!cu) return err(404, "not_found");
  if (!rule.from.includes(cu.status)) return err(409, "invalid_transition", { message: `A ${cu.status} account cannot be ${d.action}d.` });
  const t = now(), note = clip(d.note, 500);
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE customers SET status=?, status_note=?, decided_at=? WHERE id=?").bind(rule.to, note, t, id),
    c.env.DB.prepare("INSERT INTO customer_status_history (id,customer_id,at,from_status,to_status,by_user,note) VALUES (?,?,?,?,?,?,?)").bind(uid(), id, t, cu.status, rule.to, c.admin!.username, note),
    // Access is enforced on every request, but sessions are also removed so a blocked customer is signed out at once.
    ...(rule.to === "approved" ? [] : [c.env.DB.prepare("DELETE FROM customer_sessions WHERE customer_id=?").bind(id)]),
  ]);
  await log(c.env, c.admin, `customer_${d.action}${d.action!.endsWith("e") ? "d" : "ed"}`, "customer", id, { from: cu.status, to: rule.to, note }, c.ip);
  return json({ ok: true, status: rule.to });
}

async function saveCustomerNotes(c: Ctx, id: string) {
  const d = await body<{ admin_notes?: string }>(c.req);
  if (!d || typeof d.admin_notes !== "string") return err(400, "bad_request");
  const r = await c.env.DB.prepare("UPDATE customers SET admin_notes=? WHERE id=?").bind(clip(d.admin_notes, 5000), id).run();
  if (!r.meta.changes) return err(404, "not_found");
  await log(c.env, c.admin, "customer_notes_updated", "customer", id, undefined, c.ip);
  return json({ ok: true });
}
