import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CART, CHECKOUT, CONFIRMATION } from "../content/site";
import { Seo } from "../lib/seo";
import { amountLabel } from "../lib/format";
import { getChannels } from "../lib/cta";
import { addressLine, loadLastOrder, orderText, paymentLabel, smsHrefWithBody, whatsappHrefWithBody, type Order } from "../lib/orders";
import { PageBanner } from "../components/sections/PageBanner";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CtaButton } from "../components/ui/CtaButton";

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrder(loadLastOrder()), []);

  if (order === undefined) return <><Seo path="/checkout/confirmation" noindex /><PageBanner title={CONFIRMATION.title} /></>;
  if (order === null) {
    return (
      <>
        <Seo path="/checkout/confirmation" noindex />
        <PageBanner title={CONFIRMATION.none} body={CONFIRMATION.noneHint} />
        <div className="mx-auto max-w-page px-4 py-10 sm:px-6"><Button to="/shop">{CART.continue}</Button></div>
      </>
    );
  }

  const text = orderText(order);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  // Chat channels that can carry the order text. Messenger and Viber open blank, so the text is copied first.
  const channels = getChannels().map((c) =>
    c.kind === "sms" ? { ...c, href: smsHrefWithBody(text) } : c.kind === "whatsapp" ? { ...c, href: whatsappHrefWithBody(text) } : c,
  );

  return (
    <>
      <Seo path="/checkout/confirmation" noindex />
      <PageBanner title={CONFIRMATION.title} body={CONFIRMATION.lead} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1fr_24rem] lg:items-start lg:px-8">
        <Card>
          <p className="text-sm text-ink/80">{CONFIRMATION.reference}</p>
          <p className="font-sans text-h3 font-semibold text-ink">{order.ref}</p>
          <ul className="mt-4 divide-y divide-ink/10">
            {order.lines.map((l) => (
              <li key={`${l.name}-${l.variant}`} className="flex justify-between gap-3 py-3 text-sm">
                <span>{l.name}, {l.variant} <span className="text-ink/70">x {l.qty}</span></span>
                <span className="font-semibold tabular-nums">{amountLabel(l.lineTotal, l.unpriced)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-ink">
            <div className="flex justify-between"><dt>{CART.shipping}</dt><dd className="text-sm">{CART.shippingTbc}</dd></div>
            <div className="flex justify-between text-lg"><dt className="font-semibold text-ink">{CART.total}</dt><dd className="font-semibold tabular-nums">{amountLabel(order.subtotal, order.hasUnpriced)}</dd></div>
          </dl>
          <dl className="mt-6 grid gap-3 text-sm text-ink sm:grid-cols-2">
            <div><dt className="font-semibold text-ink">{CONFIRMATION.contactLabel}</dt><dd>{order.customer.fullName}<br />{order.customer.mobile}{order.customer.email && <><br />{order.customer.email}</>}</dd></div>
            <div><dt className="font-semibold text-ink">{CONFIRMATION.deliverTo}</dt><dd>{addressLine(order.customer)}</dd></div>
            <div><dt className="font-semibold text-ink">{CONFIRMATION.payWith}</dt><dd>{paymentLabel(order.customer.payment)}</dd></div>
            {order.customer.notes && <div><dt className="font-semibold text-ink">{CHECKOUT.notesTitle}</dt><dd>{order.customer.notes}</dd></div>}
          </dl>
        </Card>
        <Card>
          <h2 className="font-sans text-h3 font-semibold text-ink">{CONFIRMATION.sendTitle}</h2>
          <p className="mt-2 text-sm text-ink">{CONFIRMATION.stubNote}</p>
          <div className="mt-5 flex flex-col gap-3">
            <Button variant="secondary" onClick={copy}>
              {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              {copied ? CONFIRMATION.copied : CONFIRMATION.copy}
            </Button>
            {channels.map((c, i) => <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "primary" : "secondary"} />)}
          </div>
        </Card>
      </section>
    </>
  );
}
