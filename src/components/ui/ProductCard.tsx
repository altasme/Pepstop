import { Link } from "react-router-dom";
import { SHOP } from "../../content/site";
import { getCategoryName } from "../../content/getContent";
import type { Product } from "../../content/products";
import { priceLabel } from "../../lib/format";
import { SlotImage } from "./SlotImage";

export function ProductCard({ product }: { product: Product }) {
  const avail = SHOP.availability[product.status === "unavailable" ? "unavailable" : product.availability];
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-magenta-deep/5 transition-transform duration-200 hover:-translate-y-1"
    >
      <SlotImage slot="product" src={product.image} label={product.name} alt={product.name} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw" compact />
      <div className="flex flex-1 flex-col p-3 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-ink">{getCategoryName(product.categoryId)}</p>
        <h3 className="mt-1 font-heading text-2xl font-semibold leading-tight text-magenta-deep">{product.name}</h3>
        {product.shortDescription && <p className="mt-1 text-sm text-charcoal">{product.shortDescription}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <span className="font-semibold text-charcoal">{priceLabel(product)}</span>
          <span className="text-sm text-charcoal/80">{avail}</span>
        </div>
        {product.isSample && <span className="mt-2 inline-block w-fit rounded-full bg-gold-ink px-2.5 py-0.5 text-xs font-semibold text-white">{SHOP.sampleBadge}</span>}
      </div>
    </Link>
  );
}
