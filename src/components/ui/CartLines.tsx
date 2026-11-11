import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { CART } from "../../content/site";
import { useCart } from "../../lib/cart";
import { amountLabel, formatPhp } from "../../lib/format";
import { QuantityStepper } from "./QuantityStepper";
import { SlotImage } from "./SlotImage";

export function CartLines() {
  const { lines, setQty, remove } = useCart();
  return (
    <ul className="divide-y divide-line border-y border-line">
      {lines.map((l) => (
        <li key={`${l.productId}-${l.variantId}`} className="grid grid-cols-[5.5rem_1fr] gap-4 py-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
          <div className="w-[5.5rem] sm:w-28"><SlotImage slot="product" src={l.product.image} label="" alt={l.product.name} sizes="112px" compact /></div>
          <div className="min-w-0">
            <Link to={`/shop/${l.product.slug}`} className="text-lg font-semibold text-ink hover:underline">{l.product.name}</Link>
            <p className="text-sm text-mute">{l.variant.label}</p>
            <p className="mt-1 text-sm text-mute">{l.unpriced ? CART.priceTbc : formatPhp(l.unitPrice)}</p>
          </div>
          <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
            <QuantityStepper value={l.qty} onChange={(n) => setQty(l.productId, l.variantId, n)} label={`${CART.qty}: ${l.product.name}, ${l.variant.label}`} />
            {!l.unpriced && <p className="font-semibold tabular-nums">{amountLabel(l.lineTotal, false)}</p>}
            <button type="button" onClick={() => remove(l.productId, l.variantId)} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-mute underline hover:text-raspberry">
              <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />{CART.remove}<span className="sr-only"> {l.product.name}, {l.variant.label}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
