import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { CART } from "../../content/site";
import { useCart } from "../../lib/cart";
import { formatPhp } from "../../lib/format";
import { QuantityStepper } from "./QuantityStepper";
import { SlotImage } from "./SlotImage";

export function CartLines() {
  const { lines, setQty, remove } = useCart();
  return (
    <ul className="divide-y divide-magenta-deep/10 rounded-2xl bg-white shadow-soft ring-1 ring-magenta-deep/5">
      {lines.map((l) => (
        <li key={`${l.productId}-${l.variantId}`} className="grid grid-cols-[5rem_1fr] gap-4 p-4 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
          <div className="w-20 sm:w-24"><SlotImage slot="product" src={l.product.image} label="" alt={l.product.name} sizes="96px" compact /></div>
          <div className="min-w-0">
            <Link to={`/shop/${l.product.slug}`} className="font-heading text-xl font-semibold text-magenta-deep hover:underline">{l.product.name}</Link>
            <p className="text-sm text-charcoal">{l.variant.label}</p>
            <p className="mt-1 text-sm text-charcoal/80">{formatPhp(l.unitPrice)}</p>
          </div>
          <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
            <QuantityStepper value={l.qty} onChange={(n) => setQty(l.productId, l.variantId, n)} label={`${CART.qty}: ${l.product.name}, ${l.variant.label}`} />
            <p className="font-semibold tabular-nums">{formatPhp(l.lineTotal)}</p>
            <button type="button" onClick={() => remove(l.productId, l.variantId)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-rose-ink hover:underline">
              <Trash2 className="h-4 w-4" aria-hidden="true" />{CART.remove}<span className="sr-only"> {l.product.name}, {l.variant.label}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
