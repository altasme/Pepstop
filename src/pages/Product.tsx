import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { CTA, SHOP } from "../content/site";
import { getCategoryName, getProduct, getProducts } from "../content/getContent";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { priceLabel, formatPhp } from "../lib/format";
import { getChannels } from "../lib/cta";
import { SEO } from "../content/site";
import { SlotImage } from "../components/ui/SlotImage";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { CtaButton } from "../components/ui/CtaButton";
import { Disclaimer } from "../components/ui/Disclaimer";
import { ProductCard } from "../components/ui/ProductCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import NotFound from "./NotFound";

function Detail({ title, children }: { title: string; children: string | string[] }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className="border-t border-magenta-deep/10 py-5">
      <h2 className="font-heading text-2xl font-semibold text-magenta-deep">{title}</h2>
      {items.length === 0 || (items.length === 1 && !items[0]) ? (
        <p className="mt-2 text-charcoal/80">{SHOP.notProvided}</p>
      ) : items.length > 1 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-charcoal">{items.map((i) => <li key={i}>{i}</li>)}</ul>
      ) : (
        <p className="mt-2 text-charcoal">{items[0]}</p>
      )}
    </div>
  );
}

export default function Product() {
  const { slug = "" } = useParams();
  const product = getProduct(slug);
  const cart = useCart();
  const [variantId, setVariantId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <NotFound />;

  const unavailable = product.status === "unavailable" || product.availability === "unavailable";
  const selectedId = variantId || (product.variants.length === 1 ? product.variants[0].id : "");
  const selected = product.variants.find((v) => v.id === selectedId);
  const chat = getChannels().find((c) => ["messenger", "viber", "whatsapp"].includes(c.kind)) ?? { kind: "call" as const, href: CTA.call.href, icon: "phone" as const, external: false };
  const others = getProducts().filter((p) => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 3);

  return (
    <>
      <Seo path={`/shop/${product.slug}`} title={`${product.name}${SEO.titleSuffix}`} description={product.shortDescription || SHOP.bannerBody} noindex={!!product.isSample} />
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 font-semibold text-magenta hover:text-magenta-deep"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{SHOP.back}</Link>
        {product.isSample && <p role="note" className="mt-3 rounded-xl bg-gold-ink px-4 py-3 text-sm font-semibold text-white">{SHOP.sampleNote}</p>}
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
          <SlotImage slot="product" src={product.image} label={product.name} alt={product.name} priority sizes="(min-width: 768px) 45vw, 90vw" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-ink">{getCategoryName(product.categoryId)}</p>
            <h1 className="mt-2 font-heading text-h1 font-semibold text-magenta-deep">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-lg text-charcoal">{product.shortDescription}</p>}
            {product.regNumber && <p className="mt-2 text-sm text-charcoal">{SHOP.regLabel} {product.regNumber}</p>}
            <p className="mt-5 text-2xl font-semibold text-charcoal">{selected && product.showPrice && selected.pricePhp !== null ? formatPhp(selected.pricePhp) : priceLabel(product)}</p>
            <p className="mt-1 text-sm text-charcoal/80">{SHOP.availability[unavailable ? "unavailable" : product.availability]}</p>

            {product.variants.length > 1 && (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold text-magenta-deep">{SHOP.chooseOption}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.available}
                      aria-pressed={selectedId === v.id}
                      onClick={() => { setVariantId(v.id); setAdded(false); }}
                      className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold disabled:opacity-40 ${selectedId === v.id ? "border-magenta bg-magenta text-white" : "border-magenta/40 text-magenta hover:bg-blush"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {!unavailable && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <QuantityStepper value={qty} onChange={setQty} label={SHOP.quantity} />
                <Button
                  disabled={!selected}
                  onClick={() => { if (selected) { cart.add(product.id, selected.id, qty); setAdded(true); } }}
                >
                  {SHOP.addToCart}
                </Button>
              </div>
            )}
            <div aria-live="polite" className="mt-3 min-h-6">
              {added && (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-magenta-deep">
                  <Check className="h-4 w-4" aria-hidden="true" />{SHOP.added}.{" "}
                  <Link to="/cart" className="underline underline-offset-4">{SHOP.viewCart}</Link>
                </p>
              )}
            </div>
            <div className="mt-2"><CtaButton channel={chat} label={SHOP.askAbout} variant="secondary" /></div>

            <div className="mt-8">
              {product.fullDescription && <Detail title={SHOP.detailsTitle}>{product.fullDescription}</Detail>}
              <Detail title={SHOP.specsTitle}>{product.specifications}</Detail>
              <Detail title={SHOP.packagingTitle}>{product.packaging}</Detail>
              <Detail title={SHOP.storageTitle}>{product.storage}</Detail>
            </div>
          </div>
        </div>
        <Disclaimer text={SHOP.productDisclaimer} className="mt-10" />
      </div>
      {others.length > 0 && (
        <section className="bg-blush">
          <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading title={SHOP.relatedTitle} />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{others.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
