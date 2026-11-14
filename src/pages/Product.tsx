import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { CTA, PAYMENT_METHODS, SEO, SHOP } from "../content/site";
import { getCategoryName, getProduct, getProducts } from "../content/getContent";
import { Seo } from "../lib/seo";
import { useRemote } from "../lib/remote";
import { UI } from "../content/site";
import { useCart } from "../lib/cart";
import { priceLabel, formatPhp } from "../lib/format";
import { getChannels } from "../lib/cta";
import { ProductImage } from "../components/ui/ProductImage";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Button } from "../components/ui/Button";
import { CtaButton } from "../components/ui/CtaButton";
import { ProductCard } from "../components/ui/ProductCard";
import { SectionHeading } from "../components/ui/SectionHeading";
import NotFound from "./NotFound";

/** Admin-published rich text. The Worker sanitizes it against an allow-list before it is stored. */
function HtmlDetail({ title, html }: { title: string; html: string }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" />
      </summary>
      <div className="pb-5 text-ink/80 [&_a]:text-raspberry [&_a]:underline [&_h2]:mt-3 [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mt-2 [&_table]:w-full [&_td]:border [&_td]:border-line [&_td]:p-2 [&_th]:border [&_th]:border-line [&_th]:p-2 [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: html }} />
    </details>
  );
}

function Detail({ title, children }: { title: string; children: string | string[] }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  if (items.length === 0) return null; // nothing supplied yet: no empty accordion
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
  const remote = useRemote();
  const product = getProduct(slug);
  const cart = useCart();
  const [variantId, setVariantId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (remote.status === "loading") return <section aria-busy="true" className="mx-auto max-w-page px-4 py-24 text-center text-mute">{UI.loading}</section>;
  if (!product) return <NotFound />;

  const unavailable = product.status === "unavailable" || product.availability === "unavailable";
  const selectedId = variantId || product.variants.find((v) => v.available)?.id || "";
  const selected = product.variants.find((v) => v.id === selectedId);
  const chat = getChannels().find((c) => ["messenger", "viber", "whatsapp"].includes(c.kind)) ?? { kind: "call" as const, href: CTA.call.href, icon: "phone" as const, external: false };
  const others = getProducts().filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Seo path={`/shop/${product.slug}`} title={`${product.name}${SEO.titleSuffix}`} description={product.shortDescription || SHOP.bannerBody} noindex />
      <div className="mx-auto max-w-page px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-mute">
          <ol className="flex flex-wrap items-center gap-x-1">
            <li><Link to="/" className="inline-flex min-h-11 items-center px-1.5 hover:text-raspberry hover:underline">{SHOP.breadcrumbHome}</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} /></li>
            <li><Link to="/shop" className="inline-flex min-h-11 items-center hover:text-raspberry hover:underline">{SHOP.back}</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} /></li>
            <li><Link to={`/shop?cat=${product.categoryId}`} className="inline-flex min-h-11 items-center hover:text-raspberry hover:underline">{getCategoryName(product.categoryId)}</Link></li>
          </ol>
        </nav>
        {product.isSample && <p role="note" className="mt-3 rounded-lg bg-petal px-4 py-3 text-sm font-medium text-ink">{SHOP.sampleNote}</p>}
        <div className="mt-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <div className="md:sticky md:top-36 md:self-start">
            <ProductImage src={product.image} alt={product.name} priority sizes="(min-width: 768px) 52vw, 92vw" />
          </div>
          <div>
            <p className="text-sm text-mute">{getCategoryName(product.categoryId)}</p>
            <h1 className="mt-1 font-display text-h1 font-medium text-raspberry-deep">{product.name}</h1>
            {product.shortDescription && <p className="mt-3 text-lg text-ink/80">{product.shortDescription}</p>}
            {(product.protocolImage || product.packaging || product.storage || (product.coas && product.coas.length > 0)) && <p className="mt-3 text-sm text-mute">{SHOP.productIntro}</p>}
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
                      className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold disabled:opacity-40 ${selectedId === v.id ? "border-raspberry bg-raspberry text-white" : "border-edge text-ink hover:border-raspberry"}`}
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
                  <Check className="h-4 w-4 text-raspberry" strokeWidth={2} aria-hidden="true" />{SHOP.added}{" "}
                  <Link to="/cart" className="underline">{SHOP.viewCart}</Link>
                </p>
              )}
            </div>
            <div className="mt-1"><CtaButton channel={chat} label={SHOP.askAbout} variant="secondary" className="w-full" /></div>

            <p className="mt-5 flex items-start gap-2 text-sm text-ink/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-raspberry" strokeWidth={2} aria-hidden="true" />
              <span>{SHOP.assurance[1]}. {SHOP.payWith}: {PAYMENT_METHODS.filter((m) => m.enabled).map((m) => m.label).join(", ")}.</span>
            </p>

            <div className="mt-8 border-t border-line">
              {(product.overview || product.fullDescription) && <Detail title={SHOP.detailsTitle}>{product.overview || product.fullDescription}</Detail>}
              {product.protocolImage && (
                <details className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {SHOP.protocolTitle}
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" />
                  </summary>
                  <div className="pb-5"><a href={product.protocolImage} target="_blank" rel="noreferrer"><img src={product.protocolImage} alt={`${SHOP.protocolTitle}: ${product.name}`} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-line bg-surface" /></a></div>
                </details>
              )}
              <Detail title={SHOP.packagingTitle}>{product.packaging}</Detail>
              <Detail title={SHOP.storageTitle}>{product.storage}</Detail>
              {product.composition && <Detail title={SHOP.compositionTitle}>{product.composition}</Detail>}
              {product.notes && <Detail title={SHOP.notesTitle}>{product.notes}</Detail>}
              {product.info?.filter((i) => i.html.trim() && i.section !== "specifications").map((i) => <HtmlDetail key={i.section} title={i.section === "guidelines" ? "Product guidelines" : i.section[0].toUpperCase() + i.section.slice(1)} html={i.html} />)}
              {product.coas && product.coas.length > 0 ? (
                <details className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">{SHOP.coaTitle}<ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" /></summary>
                  <ul className="space-y-2 pb-5 text-ink/80">{product.coas.map((c) => <li key={c.id}>{c.title} ({SHOP.batchLabel}: {c.batch}) <a className="font-semibold text-raspberry underline" href={`/files/coa/${c.id}`} target="_blank" rel="noreferrer">{SHOP.coaOpen}</a></li>)}</ul>
                </details>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {others.length > 0 && (
        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading title={SHOP.relatedTitle} />
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">{others.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
