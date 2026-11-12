import { Link } from "react-router-dom";
import { SHOP } from "../../content/site";
import { getCategoryName } from "../../content/getContent";
import type { Product } from "../../content/products";
import { priceLabel } from "../../lib/format";
import { SlotImage } from "./SlotImage";

export function ProductCard({ product }: { product: Product }) {
  const avail = SHOP.availability[product.status === "unavailable" ? "unavailable" : product.availability];
  return (
    <Link to={`/shop/${product.slug}`} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[20px]">
        <SlotImage slot="product" src={product.image} alt={product.name} sizes="(min-width: 1024px) 22vw, 45vw" compact badge={product.isSample ? SHOP.sampleBadge : undefined} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-2 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-raspberry opacity-0 shadow-lift transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block">{SHOP.viewProduct}</span>
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-sm text-mute">{getCategoryName(product.categoryId)}</p>
        <h3 className="mt-0.5 text-base font-semibold leading-snug text-ink group-hover:underline sm:text-lg">{product.name}</h3>
        {product.shortDescription && <p className="mt-1 text-sm text-mute">{product.shortDescription}</p>}
        <p className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
          <span className="font-semibold text-raspberry">{priceLabel(product)}</span>
          <span className="text-mute">{avail}</span>
        </p>
      </div>
    </Link>
  );
}
