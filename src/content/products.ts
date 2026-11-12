/**
 * Product data (CLAUDE.md v1.2). Shapes mirror the Phase 2A D1 tables (products, product_variants,
 * product_categories) so CATALOGUE_SOURCE = "db" swaps the source in getContent.ts only.
 *
 * Altaventures does not author product content. The records below are LABELED SAMPLE SLOTS:
 * generic names, no descriptions, no claims, no prices. The client replaces them with real
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
  { id: "weight-wellness", name: "Weight & Wellness", slug: "weight-wellness", sort: 1 },
  { id: "next-generation-wellness", name: "Next-Generation Wellness", slug: "next-generation-wellness", sort: 2 },
  { id: "skin-beauty", name: "Skin & Beauty", slug: "skin-beauty", sort: 3 },
  { id: "vitality-cellular-health", name: "Vitality & Cellular Health", slug: "vitality-cellular-health", sort: 4 },
  { id: "energy-cellular-wellness", name: "Energy & Cellular Wellness", slug: "energy-cellular-wellness", sort: 5 },
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
    { id: `sample-${n}-a`, label: "Option A", pricePhp: null, available: true },
    { id: `sample-${n}-b`, label: "Option B", pricePhp: null, available: true },
  ],
  packaging: "",
  storage: "",
  regType: null,
  regNumber: null,
  regHolder: null,
  availability: "ask",
  showPrice: false,
  status: "published",
  order: n,
  isSample: true,
});

export const PRODUCTS: Product[] = [
  sample(1, "weight-wellness"),
  sample(2, "next-generation-wellness"),
  sample(3, "skin-beauty"),
  sample(4, "vitality-cellular-health"),
  sample(5, "energy-cellular-wellness"),
  sample(6, "skin-beauty"),
];
