import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CART, CHECKOUT, PAYMENT_METHODS, UI } from "../content/site";
import { Seo } from "../lib/seo";
import { useCart } from "../lib/cart";
import { amountLabel } from "../lib/format";
import { buildOrder, submitOrderRemote, type Customer } from "../lib/orders";
import { useRemote } from "../lib/remote";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";
import { SlotImage } from "../components/ui/SlotImage";

type Errors = Partial<Record<keyof Customer | "consent", string>>;
const empty: Customer = { fullName: "", mobile: "", email: "", street: "", barangay: "", city: "", province: "", postal: "", notes: "", payment: "" };

function validate(c: Customer, consent: boolean): Errors {
  const e: Errors = {};
  const E = CHECKOUT.errors;
  (["fullName", "mobile", "street", "barangay", "city", "province", "postal"] as const).forEach((k) => { if (!c[k].trim()) e[k] = E.required; });
  if (c.mobile.trim() && !/^(09|\+639)\d{9}$/.test(c.mobile.replace(/[\s-]/g, ""))) e.mobile = E.mobile;
  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) e.email = E.email;
  if (c.postal.trim() && !/^\d{4}$/.test(c.postal.trim())) e.postal = E.postal;
  if (!c.payment) e.payment = E.payment;
  if (!consent) e.consent = E.consent;
  return e;
}

type FieldExtra = { label: string; hint?: string; type?: string; autoComplete?: string; multiline?: boolean; readOnly?: boolean };

function Field({ id, value, error, onChange, label, hint, type = "text", autoComplete, multiline, readOnly }: FieldExtra & { id: keyof Customer; value: string; error?: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const common = {
    id, name: id, value, autoComplete, readOnly,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined,
  };
  const cls = `w-full rounded-xl border px-4 py-3 text-base text-ink ${readOnly ? "bg-petal" : "bg-white"} ${error ? "border-raspberry" : "border-edge"}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">{label}</label>
      {multiline ? <textarea {...common} rows={3} maxLength={500} className={cls} /> : <input {...common} type={type} className={`${cls} min-h-12`} />}
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-ink/80">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-sm font-semibold text-raspberry">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { lines, subtotal, hasUnpriced, clear } = useCart();
  const navigate = useNavigate();
  const { customer } = useRemote();
  const [c0, setC] = useState<Customer>(empty);
  // Name and phone come from the approved account and cannot be edited here.
  const c: Customer = { ...c0, fullName: customer?.name ?? "", mobile: customer?.phone ?? "" };
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const set = (k: keyof Customer) => (v: string) => setC((p) => ({ ...p, [k]: v }));

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const errs = validate(c, consent);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first === "payment" ? "pay-gcash" : first)?.focus();
      return;
    }
    const order = buildOrder({ ...c, mobile: c.mobile.replace(/\s+/g, " ").trim() }, lines, subtotal, hasUnpriced);
    setSending(true);
    setServerError("");
    try { await submitOrderRemote(order, lines); } catch (e) { setServerError(e instanceof Error && e.message === "rate" ? CHECKOUT.errors.rate : CHECKOUT.errors.server); setSending(false); return; }
    setSending(false);
    clear();
    navigate("/checkout/confirmation");
  };

  const F = (id: keyof Customer, extra: FieldExtra) => (
    <Field key={id} id={id} value={c[id]} error={errors[id]} onChange={set(id)} {...extra} />
  );

  if (lines.length === 0) {
    return (
      <>
        <Seo path="/checkout" noindex />
        <section className="mx-auto max-w-page px-4 pt-10 sm:px-6 md:pt-14 lg:px-8"><SectionHeading as="h1" title={CHECKOUT.title} /></section>
        <section className="mx-auto max-w-prose px-4 py-16 text-center">
          <p className="text-h3 font-semibold text-ink">{CHECKOUT.emptyTitle}</p>
          <div className="mt-6"><Button to="/shop">{CART.continue}</Button></div>
        </section>
      </>
    );
  }

  const errCount = Object.keys(errors).length;
  return (
    <>
      <Seo path="/checkout" noindex />
      <section className="mx-auto max-w-page px-4 pt-10 sm:px-6 md:pt-14 lg:px-8"><SectionHeading as="h1" title={CHECKOUT.title} /><p className="mt-4 max-w-prose text-lg text-ink/80">{CHECKOUT.bannerBody}</p></section>
      <section className="mx-auto max-w-page px-4 pb-20 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="space-y-8">
            {errCount > 0 && <p role="alert" className="rounded-lg bg-raspberry px-4 py-3 text-sm font-semibold text-white">{CHECKOUT.errors.summary}</p>}
            <fieldset className="space-y-4">
              <legend className="mb-2 text-h3 font-semibold text-ink"><span className="mr-2 font-display text-raspberry">1</span>{CHECKOUT.contactTitle}</legend>
              {F("fullName", { label: CHECKOUT.fields.fullName, autoComplete: "name", readOnly: true })}
              <div className="grid gap-4 sm:grid-cols-2">
                {F("mobile", { label: CHECKOUT.fields.mobile, hint: CHECKOUT.fields.accountHint, type: "tel", autoComplete: "tel", readOnly: true })}
                {F("email", { label: CHECKOUT.fields.email, type: "email", autoComplete: "email" })}
              </div>
            </fieldset>
            <fieldset className="space-y-4">
              <legend className="mb-2 text-h3 font-semibold text-ink"><span className="mr-2 font-display text-raspberry">2</span>{CHECKOUT.addressTitle}</legend>
              {F("street", { label: CHECKOUT.fields.street, autoComplete: "address-line1" })}
              <div className="grid gap-4 sm:grid-cols-2">
                {F("barangay", { label: CHECKOUT.fields.barangay, autoComplete: "address-line2" })}
                {F("city", { label: CHECKOUT.fields.city, autoComplete: "address-level2" })}
                {F("province", { label: CHECKOUT.fields.province, autoComplete: "address-level1" })}
                {F("postal", { label: CHECKOUT.fields.postal, autoComplete: "postal-code" })}
              </div>
            </fieldset>
            <fieldset aria-describedby="pay-note">
              <legend className="mb-2 text-h3 font-semibold text-ink"><span className="mr-2 font-display text-raspberry">3</span>{CHECKOUT.paymentTitle}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.filter((m) => m.enabled).map((m) => (
                  <label key={m.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 ${c.payment === m.id ? "border-raspberry ring-1 ring-raspberry" : "border-edge"}`}>
                    <input id={`pay-${m.id}`} type="radio" name="payment" value={m.id} checked={c.payment === m.id} onChange={() => set("payment")(m.id)} className="h-5 w-5 accent-raspberry" />
                    <span className="font-semibold">{m.label}</span>
                  </label>
                ))}
              </div>
              {errors.payment && <p className="mt-2 text-sm font-semibold text-raspberry">{errors.payment}</p>}
              <p id="pay-note" className="mt-3 text-sm text-ink/80">{CHECKOUT.paymentNote}</p>
            </fieldset>
            {F("notes", { label: CHECKOUT.fields.notes, hint: CHECKOUT.fields.notesHint, multiline: true })}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={errors.consent ? true : undefined} className="mt-1 h-5 w-5 shrink-0 accent-raspberry" />
                <span className="text-ink">{CHECKOUT.consent} <Link to="/privacy" className="font-semibold text-raspberry underline underline-offset-4">{CHECKOUT.privacyLinkLabel}</Link>.</span>
              </label>
              {errors.consent && <p className="mt-1 text-sm font-semibold text-raspberry">{errors.consent}</p>}
            </div>
          </div>
          <aside className="bg-petal p-6 lg:sticky lg:top-36">
            <h2 className="text-h3 font-semibold text-ink">{CHECKOUT.summaryTitle}</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.variantId}`} className="flex items-center gap-3 py-3 text-sm">
                  <span className="w-12 shrink-0"><SlotImage slot="product" src={l.product.image} alt="" sizes="48px" compact thumb /></span>
                  <span className="flex-1">{l.product.name}, {l.variant.label} <span className="text-ink/70">x {l.qty}</span></span>
                  <span className="font-semibold tabular-nums">{amountLabel(l.lineTotal, l.unpriced)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-2 border-t border-ink/10 pt-3 text-ink">
              <div className="flex flex-wrap justify-between gap-x-4"><dt>{CART.shipping}</dt><dd className="text-sm">{CART.shippingTbc}</dd></div>
              <div className="flex flex-wrap justify-between gap-x-4 text-lg"><dt className="font-semibold text-ink">{CART.total}</dt><dd className="text-right font-semibold tabular-nums">{amountLabel(subtotal, hasUnpriced)}</dd></div>
            </dl>
            {serverError && <p role="alert" className="mt-4 rounded-xl bg-petal p-3 text-sm font-medium text-raspberry-deep">{serverError}</p>}
            <Button submit disabled={sending} className="mt-5 w-full">{sending ? UI.loading : CHECKOUT.place}</Button>
          </aside>
        </form>
      </section>
    </>
  );
}
