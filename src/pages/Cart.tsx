import { CART } from "../content/site";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { formatPhp } from "../lib/format";
import { PageBanner } from "../components/sections/PageBanner";
import { Button } from "../components/ui/Button";
import { CartLines } from "../components/ui/CartLines";
import { Card } from "../components/ui/Card";

export default function Cart() {
  const { lines, subtotal } = useCart();
  return (
    <>
      <Seo path="/cart" noindex />
      <PageBanner title={CART.title} />
      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {lines.length === 0 ? (
          <div className="mx-auto max-w-prose rounded-2xl bg-blush p-10 text-center">
            <p className="font-heading text-h3 font-semibold text-magenta-deep">{CART.empty}</p>
            <p className="mt-2 text-charcoal">{CART.emptyHint}</p>
            <div className="mt-6"><Button to="/shop">{CART.continue}</Button></div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <CartLines />
            <Card className="lg:sticky lg:top-28">
              <dl className="space-y-3 text-charcoal">
                <div className="flex justify-between"><dt>{CART.subtotal}</dt><dd className="font-semibold tabular-nums">{formatPhp(subtotal)}</dd></div>
                <div className="flex justify-between"><dt>{CART.shipping}</dt><dd className="text-right text-sm">{CART.shippingTbc}</dd></div>
                <div className="flex justify-between border-t border-magenta-deep/10 pt-3 text-lg"><dt className="font-semibold text-magenta-deep">{CART.total}</dt><dd className="font-semibold tabular-nums">{formatPhp(subtotal)}</dd></div>
              </dl>
              <p className="mt-4 text-sm text-charcoal/80">{CART.note}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Button to="/checkout">{CART.checkout}</Button>
                <Button to="/shop" variant="secondary">{CART.continue}</Button>
              </div>
            </Card>
          </div>
        )}
      </section>
    </>
  );
}
