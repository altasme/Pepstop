/**
 * Content access seam (CLAUDE.md §5). Every page and component reads copy through here.
 * Phase 1 returns static content. In Phase 2A, `CONTENT_SOURCE = "store"` swaps the source
 * in this file only; the shapes returned must stay identical.
 */
import {
  ABOUT, ANALYTICS, CHAT_HELPER, CONTACT, CONTACT_PAGE, CONTENT_SOURCE, CTA, EDUCATION, FOCUS_AREAS,
  HEALTH_BEAUTY, HOME, IMAGE_SLOTS, LEGAL, MEDIA, NAV, NOT_FOUND, ORG, PRIVACY, SEO, STICKY_CTA_HIDDEN_ON,
  UI, VALUES, INQUIRY_MODE, SHOP, CART, CHECKOUT, CONFIRMATION, PAYMENT_METHODS, TRUST,
} from "./site";
import { ARTICLES, type Article } from "./articles";
import { PRODUCT_CATEGORIES, type Product } from "./products";
import { getState, type RemoteArticle } from "../lib/remote";

function assertStatic() {
  if (CONTENT_SOURCE !== "static") {
    throw new Error('CONTENT_SOURCE "store" is a Phase 2A feature and is not built.');
  }
}

export function getSite() {
  assertStatic();
  return {
    ORG, CONTACT, CTA, NAV, UI, HOME, ABOUT, HEALTH_BEAUTY, EDUCATION, CONTACT_PAGE, NOT_FOUND,
    LEGAL, PRIVACY, SEO, ANALYTICS, MEDIA, IMAGE_SLOTS, CHAT_HELPER, VALUES, INQUIRY_MODE, STICKY_CTA_HIDDEN_ON,
    SHOP, CART, CHECKOUT, CONFIRMATION, PAYMENT_METHODS, TRUST,
  };
}

export function getFocusAreas() {
  assertStatic();
  const imgs = getState().categoryImages;
  return [...FOCUS_AREAS].map((a) => ({ ...a, image: imgs[a.id] ?? a.image })).sort((a, b) => a.order - b.order);
}

const byNewest = (a: Article, b: Article) => b.updatedAt.localeCompare(a.updatedAt);

/** Published articles, newest first. */
export function getPublishedArticles(): Article[] {
  assertStatic();
  const remote = getState().articles;
  if (remote) return remote.map(toArticle);
  return ARTICLES.filter((a) => a.published).sort(byNewest);
}

/** Admin-published articles carry sanitized HTML in `html`; built-in drafts use plain `body`. */
const toArticle = (r: RemoteArticle): Article => ({ slug: r.slug, title: r.title, summary: r.summary, body: "", html: r.content_html, published: true, updatedAt: r.updated_at.slice(0, 10) });

/**
 * Article by slug. Unpublished articles resolve only in the dev server so drafts can be
 * previewed locally; they never resolve in a production build.
 */
export function getArticle(slug: string): Article | undefined {
  assertStatic();
  const remote = getState().articles?.find((a) => a.slug === slug);
  if (remote) return toArticle(remote);
  if (getState().articles) return undefined;
  return ARTICLES.find((a) => a.slug === slug && (a.published || import.meta.env.DEV));
}

export function getArticlesForFocusArea(focusAreaId: string): Article[] {
  return getPublishedArticles().filter((a) => a.focusAreaId === focusAreaId);
}

/* ---- Products (storefront). Read from the remote store: database products when published, else sample slots. ---- */

/** Products visible in the shop: published or unavailable, never draft or archived. Empty while the catalog loads. */
export function getProducts(): Product[] {
  return getState().products.filter((p) => p.status === "published" || p.status === "unavailable").sort((a, b) => a.order - b.order);
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export const getCategories = () => [...getState().categories].sort((a, b) => a.sort - b.sort);

export const getCategoryName = (id: string) => getState().categories.find((c) => c.id === id)?.name ?? PRODUCT_CATEGORIES.find((c) => c.id === id)?.name ?? "";

export function getFeaturedProducts(n = 3) {
  const { featuredSlugs } = getState();
  const all = getProducts();
  const picked = featuredSlugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => !!p);
  return (picked.length ? picked : all).slice(0, n);
}
