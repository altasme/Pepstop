import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { CART, CHECKOUT, CONFIRMATION } from "../content/site";
import { Seo } from "../lib/seo";
import { useRemote } from "../lib/remote";
import { amountLabel, formatPhp } from "../lib/format";
import { getChannels } from "../lib/cta";
import { addressLine, loadLastOrder, orderText, paymentLabel, smsHrefWithBody, whatsappHrefWithBody, type Order } from "../lib/orders";
import { PageBanner } from "../components/sections/PageBanner";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CtaButton } from "../components/ui/CtaButton";

function PaymentDetails({ order, paid }: { order: Order; paid: boolean }) {
  const navigate = useNavigate();
  const { paymentMethods } = useRemote();
  const method = paymentMethods.find((m) => m.id === order.customer.payment);
  const due = order.total !== undefined && !order.hasUnpriced ? formatPhp(order.total) : null;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "need">(paid ? "sent" : "idle");
  const input = "mt-1 min-h-12 w-full rounded-xl border border-edge bg-surface px-4 text-base text-ink";
  return (
    <Card>
      <h2 className="font-sans text-h3 font-semibold text-ink">{CONFIRMATION.payTitle}</h2>
      <p className="mt-2 text-sm text-ink">{CONFIRMATION.payBody}</p>
      {method && (
        <div className="mt-3 rounded-xl bg-petal p-4 text-sm text-ink">
          <p className="font-semibold">{CONFIRMATION.payHow}: {method.label}</p>
          {due && <p className="mt-2">{CONFIRMATION.payTotal}: <span className="font-semibold">{due}</span></p>}
          {method.qr && <img src={method.qr} alt={`${CONFIRMATION.payScan} ${method.label}`} className="mx-auto mt-3 max-h-96 w-auto rounded-xl border border-edge bg-surface" />}
          {method.accountName && <p className="mt-2">{CONFIRMATION.payAccountName}: <span className="font-semibold">{method.accountName}</span></p>}
          {method.accountNumber && <p className="mt-1">{CONFIRMATION.payAccountNumber}: <span className="font-semibold">{method.accountNumber}</span></p>}
          {method.instructions && <p className="mt-2 whitespace-pre-line">{method.instructions}</p>}
        </div>
      )}
      {state === "sent" ? <p role="status" className="mt-4 rounded-xl bg-petal p-3 text-sm font-medium text-ink">{CONFIRMATION.paySent}</p> : (
        <form className="mt-4 grid gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const file = (e.currentTarget.elements.namedItem("proof") as HTMLInputElement).files?.[0];
          if (!file) { setState("need"); return; }
          setState("sending");
          const fd = new FormData();
          fd.set("proof", file);
          try { const r = await fetch(`/api/customer/orders/${encodeURIComponent(order.ref)}/payment`, { method: "POST", credentials: "same-origin", headers: { "x-pepstop": "1" }, body: fd }); if (r.ok) { navigate("/checkout/thank-you"); return; } setState("error"); } catch { setState("error"); }
        }}>
          <label className="text-sm font-semibold text-ink">{CONFIRMATION.payProof}<input name="proof" type="file" required accept="image/png,image/jpeg,image/webp" className={input} /></label>
          {(state === "error" || state === "need") && <p role="alert" className="text-sm font-medium text-raspberry-deep">{state === "need" ? CONFIRMATION.payNeed : CONFIRMATION.payError}</p>}
          <Button submit disabled={state === "sending"}>{CONFIRMATION.paySubmit}</Button>
        </form>
      )}
    </Card>
  );
}

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    // The server knows which order still needs its proof of payment, even after the tab was closed.
    const stored = loadLastOrder();
    fetch("/api/customer/orders/awaiting-payment", { credentials: "same-origin", headers: { "x-pepstop": "1" } })
      .then((r) => r.json().catch(() => null))
      .then((d: { order: Order | null } | null) => {
        if (d?.order) { setOrder(d.order); return; }
        setPaid(!!stored?.remote);
        setOrder(stored);
      })
      .catch(() => setOrder(stored));
  }, []);

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
    c.kind === "sms"
      ? { ...c, href: smsHrefWithBody(text), label: CONFIRMATION.sendSms }
      : c.kind === "whatsapp"
        ? { ...c, href: whatsappHrefWithBody(text), label: CONFIRMATION.sendWhatsapp }
        : c.kind === "messenger"
          ? { ...c, label: CONFIRMATION.sendMessenger }
          : c,
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
            <div className="flex flex-wrap justify-between gap-x-4"><dt>{CART.shipping}</dt><dd className="text-sm">{order.deliveryLabel ? `${order.deliveryLabel}: ${order.deliveryFee ? formatPhp(order.deliveryFee) : CHECKOUT.deliveryFree}` : CART.shippingTbc}</dd></div>
            <div className="flex flex-wrap justify-between gap-x-4 text-lg"><dt className="font-semibold text-ink">{CART.total}</dt><dd className="font-semibold tabular-nums">{amountLabel(order.total ?? order.subtotal, order.hasUnpriced)}</dd></div>
          </dl>
          <dl className="mt-6 grid gap-3 text-sm text-ink sm:grid-cols-2">
            <div><dt className="font-semibold text-ink">{CONFIRMATION.contactLabel}</dt><dd>{order.customer.fullName}<br />{order.customer.mobile}{order.customer.email && <><br />{order.customer.email}</>}</dd></div>
            <div><dt className="font-semibold text-ink">{CONFIRMATION.deliverTo}</dt><dd>{addressLine(order.customer)}</dd></div>
            <div><dt className="font-semibold text-ink">{CONFIRMATION.payWith}</dt><dd>{paymentLabel(order.customer.payment, order.paymentName)}</dd></div>
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
        {order.remote && <PaymentDetails order={order} paid={paid} />}
      </section>
    </>
  );
}
