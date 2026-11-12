/**
 * Remote content store. The admin panel publishes products, categories, articles and website text to the
 * Worker API. After hydration this store loads them, so the prerendered HTML and the first client render match.
 * While loading, product areas render a skeleton. If the database has no published products the built-in
 * sample slots stay in place; otherwise database products replace them.
 */
import { useSyncExternalStore } from "react";
import { CONTACT, CTA, HOME, IMAGE_SLOTS, ORG, PAYMENT_METHODS, UI, VALUES } from "../content/site";
import { PRODUCTS, PRODUCT_CATEGORIES, type Product, type ProductCategory } from "../content/products";
import { ARTICLES, type Article } from "../content/articles";

export type RemoteArticle = { slug: string; title: string; summary: string; thumbnail?: string | null; content_html?: string; published_at: string | null; updated_at: string };
export type Coa = { id: string; title: string; batch: string; doc_date: string | null; product_name: string; product_slug: string };

type State = {
  status: "loading" | "ready";
  live: boolean;
  products: Product[];
  categories: ProductCategory[];
  categoryImages: Record<string, string>;
  articles: RemoteArticle[] | null; // null = use built-in articles
  featuredSlugs: string[];
  version: number; // bumps when website text overrides are applied
};

const initial: State = { status: "loading", live: false, products: [], categories: PRODUCT_CATEGORIES, categoryImages: {}, articles: null, featuredSlugs: [], version: 0 };
let state: State = initial;
const subs = new Set<() => void>();
const set = (patch: Partial<State>) => { state = { ...state, ...patch }; subs.forEach((f) => f()); };

export const getState = () => state;
export function useRemote(): State {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => state, () => initial);
}

const samples = () => PRODUCTS.map((p) => ({ ...p }));

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { headers: { accept: "application/json" } });
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

let started = false;
export async function startRemote() {
  if (started || typeof window === "undefined") return;
  started = true;
  const [cat, content, articles] = await Promise.all([
    getJson<{ live: boolean; codEnabled: boolean; categories: { id: string; slug: string; name: string; sort: number; image: string | null }[]; products: Product[] }>("/api/public/catalog"),
    getJson<Record<string, Record<string, string>>>("/api/public/content"),
    getJson<RemoteArticle[]>("/api/public/articles"),
  ]);
  const featured = content ? applyContent(content) : [];
  const live = !!cat?.live;
  if (live) {
    PAYMENT_METHODS.forEach((m) => { if (m.id === "cod") m.enabled = !!cat!.codEnabled; });
  }
  set({
    status: "ready",
    live,
    // A database product without a photo shows the honest placeholder, not the default slot image.
    products: live ? cat!.products.map((p) => ({ ...p, image: p.image || "" })) : samples(),
    categories: live && cat!.categories.length ? cat!.categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, sort: c.sort })) : PRODUCT_CATEGORIES,
    categoryImages: Object.fromEntries((cat?.categories ?? []).filter((c) => c.image).map((c) => [c.id, c.image as string])),
    articles: articles && articles.length ? articles : null,
    featuredSlugs: featured,
    version: state.version + 1,
  });
}

export const builtInArticles = (): Article[] => ARTICLES;
