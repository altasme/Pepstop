import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { CTA, SEO, SHOP } from "../content/site";
import { getCategoryName, getProduct, getProducts } from "../content/getContent";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { priceLabel, formatPhp } from "../lib/format";
import { getChannels } from "../lib/cta";
import { SlotImage } from "../components/ui/SlotImage";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { CtaButton } from "../components/ui/CtaButton";
import { Disclaimer } from "../components/ui/Disclaimer";
import { ProductCard } from "../components/ui/ProductCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import NotFound from "./NotFound";

function Detail({ title, children }: { title: string; children: string | string[] }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <details className="group border-b border-line" open={false}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" />
      </summary>
      <div className="pb-5 text-ink/80">
        {items.length === 0 ? <p className="text-mute">{SHOP.notProvided}</p> : items.length > 1 ? <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul> : <p>{items[0]}</p>}
      </div>
    </details>
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
  const selectedId = variantId || product.variants.find((v) => v.available)?.id || "";
  const selected = product.variants.find((v) => v.id === selectedId);
  const chat = getChannels().find((c) => ["messenger", "viber", "whatsapp"].includes(c.kind)) ?? { kind: "call" as const, href: CTA.call.href, icon: "phone" as const, external: false };
  const others = getProducts().filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Seo path={`/shop/${product.slug}`} title={`${product.name}${SEO.titleSuffix}`} description={product.shortDescription || SHOP.bannerBody} noindex={!!product.isSample} />
      <div className="mx-auto max-w-page px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink underline hover:text-raspberry"><ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />{SHOP.back}</Link>
        {product.isSample && <p role="note" className="mt-3 rounded-lg bg-petal px-4 py-3 text-sm font-medium text-ink">{SHOP.sampleNote}</p>}
        <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div className="md:sticky md:top-28 md:self-start">
            <SlotImage slot="product" src={product.image} label={product.name} alt={product.name} priority sizes="(min-width: 768px) 52vw, 92vw" />
          </div>
          <div>
            <p className="text-sm text-mute">{getCategoryName(product.categoryId)}</p>
            <h1 className="mt-1 font-display text-h1 font-medium text-raspberry-deep">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-lg text-ink/80">{product.shortDescription}</p>}
            {product.regNumber && <p className="mt-2 text-sm text-mute">{SHOP.regLabel} {product.regNumber}</p>}
            <p className="mt-5 text-2xl font-semibold text-ink">{selected && product.showPrice && selected.pricePhp !== null ? formatPhp(selected.pricePhp) : priceLabel(product)}</p>
            <p className="mt-1 text-sm text-mute">{SHOP.availability[unavailable ? "unavailable" : product.availability]}</p>

            {product.variants.length > 1 && (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-semibold text-ink">{SHOP.chooseOption}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.available}
                      aria-pressed={selectedId === v.id}
                      onClick={() => { setVariantId(v.id); setAdded(false); }}
                      className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold disabled:opacity-40 ${selectedId === v.id ? "border-raspberry bg-raspberry text-white" : "border-line text-ink hover:border-raspberry"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {!unavailable && (
              <div className="mt-6 flex items-center gap-3">
                <QuantityStepper value={qty} onChange={setQty} label={SHOP.quantity} />
                <Button className="flex-1" disabled={!selected} onClick={() => { if (selected) { cart.add(product.id, selected.id, qty); setAdded(true); } }}>
                  {SHOP.addToCart}
                </Button>
              </div>
            )}
            <div aria-live="polite" className="mt-3 min-h-6">
              {added && (
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <Check className="h-4 w-4 text-raspberry" strokeWidth={2} aria-hidden="true" />{SHOP.added}.{" "}
                  <Link to="/cart" className="underline">{SHOP.viewCart}</Link>
                </p>
              )}
            </div>
            <div className="mt-1"><CtaButton channel={chat} label={SHOP.askAbout} variant="secondary" className="w-full" /></div>

            <div className="mt-8 border-t border-line">
              {product.fullDescription && <Detail title={SHOP.detailsTitle}>{product.fullDescription}</Detail>}
              <Detail title={SHOP.specsTitle}>{product.specifications}</Detail>
              <Detail title={SHOP.packagingTitle}>{product.packaging}</Detail>
              <Detail title={SHOP.storageTitle}>{product.storage}</Detail>
            </div>
            <Disclaimer text={SHOP.productDisclaimer} className="mt-6" />
          </div>
        </div>
      </div>
      {others.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading title={SHOP.relatedTitle} />
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">{others.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
