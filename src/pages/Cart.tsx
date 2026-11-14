import { useRemote } from "../lib/remote";
import { CART } from "../content/site";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { amountLabel } from "../lib/format";
import { Button } from "../components/ui/Button";
import { CartLines } from "../components/ui/CartLines";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Sprig } from "../components/ui/Sprig";
import { SparkleField } from "../components/ui/SparkleField";

export default function Cart() {
  const { lines, subtotal, hasUnpriced } = useCart();
  const { deliveryOptions } = useRemote();
  return (
    <>
      <Seo path="/cart" noindex />
      <section className="mx-auto max-w-page px-4 pb-20 pt-10 sm:px-6 md:pt-14 lg:px-8">
        <SectionHeading as="h1" title={CART.title} />
        {lines.length === 0 ? (
          <div className="relative mt-10 min-h-[22rem] max-w-prose">
            <Sprig className="pointer-events-none absolute -bottom-6 right-0 hidden h-72 w-auto text-raspberry/50 sm:block" />
            <SparkleField className="hidden sm:block" spots={[{ x: "70%", y: "6%", size: 12, delay: 0.4 }, { x: "92%", y: "40%", size: 9, delay: 1.8, fill: "var(--raspberry)" }]} />
            <p className="text-xl font-semibold text-ink">{CART.empty}</p>
            <p className="mt-2 text-ink/80">{CART.emptyHint}</p>
            <div className="mt-6"><Button to="/shop">{CART.continue}</Button></div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
            <CartLines />
            <aside className="bg-petal p-6 lg:sticky lg:top-36">
              <dl className="space-y-3 text-ink">
                <div className="flex flex-wrap justify-between gap-x-4"><dt>{CART.subtotal}</dt><dd className="text-right font-semibold tabular-nums">{amountLabel(subtotal, hasUnpriced)}</dd></div>
                <div className="flex justify-between gap-4"><dt>{CART.shipping}</dt><dd className="text-right text-sm text-mute">{deliveryOptions.length > 0 ? CART.shippingChoose : CART.shippingTbc}</dd></div>
                <div className="flex flex-wrap justify-between gap-x-4 border-t border-ink/15 pt-3 text-lg"><dt className="font-semibold">{CART.total}</dt><dd className="text-right font-semibold tabular-nums">{amountLabel(subtotal, hasUnpriced)}</dd></div>
              </dl>
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
