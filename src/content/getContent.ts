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
import { PRODUCTS, PRODUCT_CATEGORIES, type Product } from "./products";

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
  return [...FOCUS_AREAS].sort((a, b) => a.order - b.order);
}

const byNewest = (a: Article, b: Article) => b.updatedAt.localeCompare(a.updatedAt);

/** Published articles, newest first. */
export function getPublishedArticles(): Article[] {
  assertStatic();
  return ARTICLES.filter((a) => a.published).sort(byNewest);
}

/**
 * Article by slug. Unpublished articles resolve only in the dev server so drafts can be
 * previewed locally; they never resolve in a production build.
 */
export function getArticle(slug: string): Article | undefined {
  assertStatic();
  return ARTICLES.find((a) => a.slug === slug && (a.published || import.meta.env.DEV));
}

export function getArticlesForFocusArea(focusAreaId: string): Article[] {
  return getPublishedArticles().filter((a) => a.focusAreaId === focusAreaId);
}

/* ---- Products (storefront) ---- */

/** Products visible in the shop: published or unavailable, never draft or archived. */
export function getProducts(): Product[] {
  assertStatic();
  return PRODUCTS.filter((p) => p.status === "published" || p.status === "unavailable").sort((a, b) => a.order - b.order);
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export const getCategories = () => [...PRODUCT_CATEGORIES].sort((a, b) => a.sort - b.sort);

export const getCategoryName = (id: string) => PRODUCT_CATEGORIES.find((c) => c.id === id)?.name ?? "";

export const getFeaturedProducts = (n = 3) => getProducts().slice(0, n);
