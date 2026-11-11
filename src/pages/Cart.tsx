import { CART } from "../content/site";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { formatPhp } from "../lib/format";
import { Button } from "../components/ui/Button";
import { CartLines } from "../components/ui/CartLines";
import { SectionHeading } from "../components/ui/SectionHeading";

export default function Cart() {
  const { lines, subtotal } = useCart();
  return (
    <>
      <Seo path="/cart" noindex />
      <section className="mx-auto max-w-page px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:px-8">
        <SectionHeading as="h1" title={CART.title} />
        {lines.length === 0 ? (
          <div className="mt-10 max-w-prose">
            <p className="text-xl font-semibold text-ink">{CART.empty}</p>
            <p className="mt-2 text-ink/80">{CART.emptyHint}</p>
            <div className="mt-6"><Button to="/shop">{CART.continue}</Button></div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
            <CartLines />
            <aside className="rounded-xl bg-petal p-6 lg:sticky lg:top-28">
              <dl className="space-y-3 text-ink">
                <div className="flex justify-between"><dt>{CART.subtotal}</dt><dd className="font-semibold tabular-nums">{formatPhp(subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt>{CART.shipping}</dt><dd className="text-right text-sm text-mute">{CART.shippingTbc}</dd></div>
                <div className="flex justify-between border-t border-ink/15 pt-3 text-lg"><dt className="font-semibold">{CART.total}</dt><dd className="font-semibold tabular-nums">{formatPhp(subtotal)}</dd></div>
              </dl>
              <p className="mt-4 text-sm text-mute">{CART.note}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Button to="/checkout">{CART.checkout}</Button>
                <Button to="/shop" variant="secondary">{CART.continue}</Button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
