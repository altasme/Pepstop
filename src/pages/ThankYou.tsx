import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CONTACT, CTA, THANKS } from "../content/site";
import { Seo } from "../lib/seo";
import { loadLastOrder } from "../lib/orders";
import { PageBanner } from "../components/sections/PageBanner";
import { Button } from "../components/ui/Button";
import { CtaButton } from "../components/ui/CtaButton";

/** Shown once the proof of payment is uploaded. The customer screenshots it and sends it to The Pep Stop on Messenger. */
export default function ThankYou() {
  const [ref, setRef] = useState<string | null | undefined>(undefined);
  const [cod, setCod] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { const o = loadLastOrder(); setRef(o?.ref ?? null); setCod(!!o?.cod); }, []);
  const copy = async () => {
    if (!ref) return;
    try { await navigator.clipboard.writeText(ref); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  return (
    <>
      <Seo path="/checkout/thank-you" noindex />
      <PageBanner title={THANKS.title} body={ref === null ? THANKS.noOrder : cod ? THANKS.leadCod : THANKS.lead} />
      <section className="mx-auto max-w-prose px-4 py-12 sm:px-6 md:py-16">
        {ref && (
          <div className="rounded-[20px] bg-petal p-6 text-center">
            <p className="text-sm text-ink/80">{THANKS.orderLabel}</p>
            <p className="mt-1 font-display text-4xl font-medium text-claret sm:text-5xl">{ref}</p>
            <button type="button" onClick={copy} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-raspberry underline underline-offset-4">
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? THANKS.copied : THANKS.copy}
            </button>
          </div>
        )}
        <div className="mt-8">
          <h2 className="font-sans text-h3 font-semibold text-ink">{THANKS.stepTitle}</h2>
          <p className="mt-2 text-lg text-ink/80">{THANKS.step}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {CONTACT.messengerUrl && <CtaButton channel={{ kind: "messenger", href: CTA.primary.href, icon: "messenger", external: true }} label={THANKS.messenger} variant="primary" />}
            <Button to="/shop" variant="secondary">{THANKS.shop}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
