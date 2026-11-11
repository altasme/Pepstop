/** "2026-11-11" -> "November 11, 2026". Fixed locale and UTC so prerender and client agree. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/** 1234.5 -> "PHP 1,234.50". */
export function formatPhp(amount: number): string {
  return `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

import { CART, SHOP } from "../content/site";

const SHOP_PRICE_TBC = CART.priceTbc;
import type { Product } from "../content/products";

/** Amount, or the "confirmed when we reply" text when a price is not set. */
export function amountLabel(amount: number, unpriced: boolean): string {
  return unpriced ? SHOP_PRICE_TBC : formatPhp(amount);
}

/** Card and page price label. Honors showPrice and optional prices. */
export function priceLabel(p: Product): string {
  const prices = p.variants.filter((v) => v.available && v.pricePhp !== null).map((v) => v.pricePhp as number);
  if (!p.showPrice || prices.length === 0) return SHOP.priceOnRequest;
  const min = Math.min(...prices);
  return prices.length > 1 && Math.max(...prices) !== min ? `${SHOP.from} ${formatPhp(min)}` : formatPhp(min);
}
