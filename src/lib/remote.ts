/**
 * Remote store. Public website text and journal articles load for everyone. The product catalog is private:
 * it loads only for a signed-in customer whose account an administrator has approved, and the Worker re-checks
 * that status on every request. The first client render matches the prerendered HTML (nothing private in it).
 */
import { useSyncExternalStore } from "react";
import { CONTACT, CTA, HOME, IMAGE_SLOTS, ORG, PAYMENT_METHODS, UI, VALUES } from "../content/site";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "../content/products";
import { ARTICLES, type Article } from "../content/articles";

export type RemoteArticle = { slug: string; title: string; summary: string; thumbnail?: string | null; content_html?: string; published_at: string | null; updated_at: string };
export type Coa = { id: string; title: string; batch: string; doc_date: string | null; product_name: string; product_slug: string };
export type Me = { authenticated: boolean; status?: "pending" | "approved" | "rejected" | "suspended"; name?: string; phone?: string };
export type PayDetail = { id: string; label: string; kind: string; accountName: string; accountNumber: string; instructions: string; qr: string | null };
export type DeliveryOption = { id: string; label: string; fee: number; note: string };
export type RegistrationInfo = { message: string; messenger: string; whatsapp: string; phone: string };

type State = {
  status: "loading" | "ready";
  /** The signed-in, approved customer, or null. */
  customer: { name: string; phone: string } | null;
  products: Product[];
  categories: ProductCategory[];
  categoryImages: Record<string, string>;
  paymentMethods: PayDetail[];
  deliveryOptions: DeliveryOption[];
  freeDeliveryMin: number | null;
  articles: RemoteArticle[] | null; // null = use built-in articles
  featuredSlugs: string[];
  version: number; // bumps when website text overrides are applied
};

const initial: State = { status: "loading", customer: null, products: [], categories: PRODUCT_CATEGORIES, categoryImages: {}, paymentMethods: [], deliveryOptions: [], freeDeliveryMin: null, articles: null, featuredSlugs: [], version: 0 };
let state: State = initial;
const subs = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; subs.forEach((f) => f()); };

export const getState = () => state;
export function useRemote(): State {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => state, () => initial);
}

const H = { "x-pepstop": "1" };
async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { headers: { accept: "application/json" }, credentials: "same-origin" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

const paras = (s: string) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

/** Applies published website text over the built-in copy. Empty fields leave the built-in text alone. */
function applyContent(c: Record<string, Record<string, string>>) {
  const h = c.home ?? {};
  if (h.announcement) HOME.announcement = h.announcement;
  if (h.heroTitle) HOME.heroTitle = h.heroTitle;
  if (h.heroSupport) HOME.heroSupport = h.heroSupport;
  if (h.heroPrimaryLabel) HOME.heroShop = { ...HOME.heroShop, label: h.heroPrimaryLabel };
  if (h.heroSecondaryLabel) HOME.heroTalk = h.heroSecondaryLabel;
  if (h.heroImage) IMAGE_SLOTS.hero.src = h.heroImage;
  if (h.heroImageMobile) IMAGE_SLOTS.heroMobile.src = h.heroImageMobile;
  if (h.storyHeading) HOME.storyHeading = h.storyHeading;
  if (h.storyBody) HOME.storyBody = paras(h.storyBody);
  const a = c.about ?? {};
  if (a.intro) ORG.intro = paras(a.intro);
  if (a.mission) ORG.mission = a.mission;
  if (a.vision) ORG.vision = a.vision;
  if (a.image) IMAGE_SLOTS.story.src = a.image;
  if (a.values) {
    const v = a.values.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p[0]);
    if (v.length) VALUES.splice(0, VALUES.length, ...v.map((p, i) => ({ id: `value-${i}`, title: p[0], body: p[1] ?? "" })));
  }
  const k = c.contact ?? {};
  if (k.email) { CONTACT.email = k.email; CTA.email = { href: `mailto:${k.email}?subject=Inquiry%20from%20website`, label: "Email Us" }; }
  if (k.facebookUrl) CONTACT.facebookUrl = k.facebookUrl;
  if (k.hours) CONTACT.hours = k.hours;
  const f = c.footer ?? {};
  if (f.brandDescription) UI.footerBrand = f.brandDescription;
  if (f.disclaimer) UI.disclaimer = f.disclaimer;
  if (f.copyright) UI.rights = f.copyright;
  UI.socials = [f.facebook ? { label: "Facebook", href: f.facebook } : null, f.instagram ? { label: "Instagram", href: f.instagram } : null].filter((x): x is { label: string; href: string } => !!x);
  return h.featuredSlugs ? h.featuredSlugs.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

type CatalogResponse = { paymentMethods: PayDetail[]; deliveryOptions: DeliveryOption[]; freeDeliveryMin: number | null; categories: { id: string; slug: string; name: string; sort: number; image: string | null }[]; products: Product[] };

/** Loads the private catalog. Only called once the Worker has confirmed an approved customer. */
async function loadCatalog() {
  const cat = await getJson<CatalogResponse>("/api/customer/catalog");
  if (!cat) return { products: [] as Product[], categories: PRODUCT_CATEGORIES, categoryImages: {}, paymentMethods: [], deliveryOptions: [], freeDeliveryMin: null };
  return {
    products: cat.products.map((p) => ({ ...p, image: p.image || "" })), // no photo: honest placeholder
    categories: cat.categories.length ? cat.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, sort: c.sort })) : PRODUCT_CATEGORIES,
    categoryImages: Object.fromEntries(cat.categories.filter((c) => c.image).map((c) => [c.id, c.image as string])),
    paymentMethods: cat.paymentMethods ?? [],
    deliveryOptions: cat.deliveryOptions ?? [],
    freeDeliveryMin: cat.freeDeliveryMin ?? null,
  };
}

async function resolveAccount(): Promise<Pick<State, "customer" | "products" | "categories" | "categoryImages" | "paymentMethods" | "deliveryOptions" | "freeDeliveryMin">> {
  const me = await getJson<Me>("/api/customer/me");
  if (!me?.authenticated || me.status !== "approved") return { customer: null, products: [], categories: PRODUCT_CATEGORIES, categoryImages: {}, paymentMethods: [], deliveryOptions: [], freeDeliveryMin: null };
  return { customer: { name: me.name ?? "", phone: me.phone ?? "" }, ...(await loadCatalog()) };
}

let started = false;
export async function startRemote() {
  if (started || typeof window === "undefined") return;
  started = true;
  const [account, content, articles, pay] = await Promise.all([resolveAccount(), getJson<Record<string, Record<string, string>>>("/api/public/content"), getJson<RemoteArticle[]>("/api/public/articles"), getJson<{ id: string; label: string }[]>("/api/public/payments")]);
  // Public pages show only the names of the payment methods the administrator has switched on.
  if (pay) PAYMENT_METHODS.splice(0, PAYMENT_METHODS.length, ...pay.map((m) => ({ id: m.id, label: m.label, enabled: true })));
  const featured = content ? applyContent(content) : [];
  set({ ...account, status: "ready", articles: articles && articles.length ? articles : null, featuredSlugs: featured, version: state.version + 1 });
}

/** Re-reads the account and catalog after logging in or out. */
export async function refreshAccount() {
  set({ ...(await resolveAccount()), status: "ready" });
}

export type AuthResult = { ok: true } | { ok: false; code: string; reason?: string };
async function post(path: string, body: unknown): Promise<AuthResult> {
  try {
    const r = await fetch(path, { method: "POST", credentials: "same-origin", headers: { ...H, "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    return r.ok ? { ok: true } : { ok: false, code: d.error ?? "generic", reason: d.reason };
  } catch {
    return { ok: false, code: "generic" };
  }
}
export const registerCustomer = (b: { fullName: string; phone: string; password: string; confirm: string; consent: boolean; website: string }) => post("/api/customer/register", b);
export async function loginCustomer(b: { phone: string; password: string }): Promise<AuthResult> {
  const r = await post("/api/customer/login", b);
  if (r.ok) await refreshAccount();
  return r;
}
export async function logoutCustomer() {
  await post("/api/customer/logout", {});
  await refreshAccount();
}
export const getRegistrationInfo = () => getJson<RegistrationInfo>("/api/public/registration-info");
export const getCoaList = (q: string) => getJson<{ rows: Coa[] }>(`/api/customer/coa?q=${encodeURIComponent(q)}`);

export const builtInArticles = (): Article[] => ARTICLES;
