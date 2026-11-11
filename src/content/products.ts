/**
 * Product data (CLAUDE.md v1.2). Shapes mirror the Phase 2A D1 tables (products, product_variants,
 * product_categories) so CATALOGUE_SOURCE = "db" swaps the source in getContent.ts only.
 *
 * Altaventures does not author product content. The records below are LABELED SAMPLE SLOTS:
 * generic names, no descriptions, no claims, zero prices. The client replaces them with real
 * records (set isSample to false or delete the field). Sample products are noindex and excluded
 * from the sitemap.
 */
export type Availability = "available" | "ask" | "unavailable";

export type Variant = { id: string; label: string; pricePhp: number | null; available: boolean };

export type ProductCategory = { id: string; name: string; slug: string; sort: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  image: string | null; // Cloudinary public id
  shortDescription: string;
  fullDescription: string;
  specifications: string[]; // one line each
  variants: Variant[];
  packaging: string;
  storage: string;
  regType: string | null; // optional, client-entered display fields
  regNumber: string | null;
  regHolder: string | null;
  availability: Availability;
  showPrice: boolean;
  status: "draft" | "published" | "unavailable" | "archived";
  order: number;
  isSample?: boolean;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: "beauty-skincare", name: "Beauty & Skincare", slug: "beauty-skincare", sort: 1 },
  { id: "health-wellness", name: "Health & Wellness", slug: "health-wellness", sort: 2 },
  { id: "emerging-wellness-innovations", name: "Emerging Wellness Innovations", slug: "emerging-wellness-innovations", sort: 3 },
];

const sample = (n: number, categoryId: string): Product => ({
  id: `sample-${n}`,
  slug: `sample-product-${n}`,
  name: `Sample product ${n}`,
  categoryId,
  image: null,
  shortDescription: "",
  fullDescription: "",
  specifications: [],
  variants: [
    { id: `sample-${n}-a`, label: "Option A", pricePhp: 0, available: true },
    { id: `sample-${n}-b`, label: "Option B", pricePhp: 0, available: true },
  ],
  packaging: "",
  storage: "",
  regType: null,
  regNumber: null,
  regHolder: null,
  availability: "ask",
  showPrice: true,
  status: "published",
  order: n,
  isSample: true,
});

export const PRODUCTS: Product[] = [
  sample(1, "beauty-skincare"),
  sample(2, "beauty-skincare"),
  sample(3, "health-wellness"),
  sample(4, "health-wellness"),
  sample(5, "emerging-wellness-innovations"),
  sample(6, "emerging-wellness-innovations"),
];
