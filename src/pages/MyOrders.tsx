import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CONTACT, MY_ORDERS as M } from "../content/site";
import { Seo } from "../lib/seo";
import { amountLabel, formatPhp } from "../lib/format";
import { PageBanner } from "../components/sections/PageBanner";
import { Button } from "../components/ui/Button";

type Summary = { ref: string; placedAt: string; status: string; paymentStatus: string; awaitingProof: boolean; total: number; hasUnpriced: boolean; items: number };
type Detail = {
  ref: string; placedAt: string; status: string; paymentStatus: string; awaitingProof: boolean; paymentName: string | null; deliveryLabel: string | null; deliveryFee: number | null;
  subtotal: number; total: number; hasUnpriced: boolean;
  address: { street: string; barangay: string; city: string; province: string; postal: string };
  lines: { name: string; variant: string; qty: number; unitPrice: number | null; lineTotal: number }[];
  history: { at: string; status: string }[];
};

/** Fixed locale and zone so the same moment reads the same everywhere. */
const when = (iso: string) => new Date(iso).toLocaleString("en-PH", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
const day = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Manila" });

const label = (status: string, awaiting: boolean, paymentStatus: string) =>
  awaiting ? M.awaitingProof : status === "new_order" && paymentStatus === "cash_on_delivery" ? M.cod : M.status[status] ?? status.replace(/_/g, " ");

function tone(status: string, awaiting: boolean): string {
  if (awaiting || ["new_order", "under_review", "awaiting_payment", "payment_submitted"].includes(status)) return "bg-petal text-claret";
  if (status === "cancelled" || status === "payment_rejected") return "bg-ink/10 text-ink";
  return "bg-claret text-white";
}
const Pill = ({ status, awaiting, paymentStatus }: { status: string; awaiting: boolean; paymentStatus: string }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tone(status, awaiting)}`}>{label(status, awaiting, paymentStatus)}</span>
);

async function load<T>(url: string): Promise<{ ok: true; data: T } | { ok: false; code: number }> {
  try {
    const r = await fetch(url, { headers: { accept: "application/json" }, credentials: "same-origin" });
    if (!r.ok) { await r.text().catch(() => ""); return { ok: false, code: r.status }; }
    return { ok: true, data: (await r.json()) as T };
  } catch { return { ok: false, code: 0 }; }
}

function Help() {
  return (
    <p className="mt-10 text-ink/80">
      {M.help}{" "}
      {CONTACT.messengerUrl ? <a href={CONTACT.messengerUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-raspberry underline">Messenger</a> : <Link to="/contact" className="font-semibold text-raspberry underline">Contact</Link>}
    </p>
  );
}

function List() {
  const [orders, setOrders] = useState<Summary[] | null>(null);
  const [failed, setFailed] = useState(false);
  const run = useCallback(async () => {
    setFailed(false);
    const r = await load<{ orders: Summary[] }>("/api/customer/orders");
    if (r.ok) setOrders(r.data.orders); else setFailed(true);
  }, []);
  useEffect(() => { run(); }, [run]);

  if (failed) return <div role="alert" className="rounded-2xl bg-petal p-6"><p className="text-ink">{M.loadError}</p><div className="mt-4"><Button variant="secondary" onClick={run}>{M.retry}</Button></div></div>;
  if (!orders) return <p role="status" className="text-ink/80">Loading</p>;
  if (!orders.length) return <div className="rounded-2xl bg-petal p-6 sm:p-8"><p className="text-lg text-ink">{M.empty}</p><div className="mt-5"><Button to="/shop">{M.emptyCta}</Button></div></div>;
  return (
    <ul className="grid gap-4">
      {orders.map((o) => (
        <li key={o.ref}>
          <Link to={`/account/orders?ref=${encodeURIComponent(o.ref)}`} className="block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-raspberry sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-ink/80">{M.orderLabel}</p>
                <p className="font-display text-2xl font-medium text-claret">{o.ref}</p>
              </div>
              <Pill status={o.status} awaiting={o.awaitingProof} paymentStatus={o.paymentStatus} />
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-2 text-ink">
              <p className="text-sm text-ink/80">{M.placed} {day(o.placedAt)} · {M.items(o.items)}</p>
              <p className="text-lg font-semibold">{amountLabel(o.total, o.hasUnpriced && o.total === 0)}</p>
            </div>
            <p className="mt-3 text-sm font-semibold text-raspberry">{M.view}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function One({ refCode }: { refCode: string }) {
  const [o, setO] = useState<Detail | null>(null);
  const [state, setState] = useState<"loading" | "missing" | "error" | "ready">("loading");
  const run = useCallback(async () => {
    setState("loading");
    const r = await load<{ order: Detail }>(`/api/customer/orders/${encodeURIComponent(refCode)}`);
    if (r.ok) { setO(r.data.order); setState("ready"); } else setState(r.code === 404 ? "missing" : "error");
  }, [refCode]);
  useEffect(() => { run(); }, [run]);

  const back = <Link to="/account/orders" className="inline-flex min-h-11 items-center text-sm font-semibold text-raspberry underline underline-offset-4">{M.back}</Link>;
  if (state === "loading") return <p role="status" className="text-ink/80">Loading</p>;
  if (state === "missing") return <div>{back}<p className="mt-4 text-lg text-ink">{M.notFound}</p></div>;
  if (state === "error" || !o) return <div role="alert" className="rounded-2xl bg-petal p-6"><p className="text-ink">{M.loadError}</p><div className="mt-4"><Button variant="secondary" onClick={run}>{M.retry}</Button></div></div>;

  const fee = o.deliveryFee;
  return (
    <div>
      {back}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink/80">{M.orderLabel}</p>
          <h2 className="font-display text-3xl font-medium text-claret">{o.ref}</h2>
          <p className="mt-1 text-sm text-ink/80">{M.placed} {when(o.placedAt)}</p>
        </div>
        <Pill status={o.status} awaiting={o.awaitingProof} paymentStatus={o.paymentStatus} />
      </div>
      {o.awaitingProof && <div className="mt-5"><Button to="/checkout/confirmation">{M.payNow}</Button></div>}

      <section className="mt-8" aria-labelledby="mo-items">
        <h3 id="mo-items" className="font-sans text-h3 font-semibold text-ink">{M.itemsTitle}</h3>
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
          {o.lines.map((l, i) => (
            <li key={i} className="flex items-start justify-between gap-4 p-4">
              <div><p className="font-semibold text-ink">{l.name}</p>{l.variant && <p className="text-sm text-ink/80">{l.variant}</p>}<p className="text-sm text-ink/80">Qty {l.qty}</p></div>
              <p className="shrink-0 font-semibold text-ink">{l.unitPrice === null ? "" : formatPhp(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-ink">
          <dt>{M.subtotal}</dt><dd className="text-right">{formatPhp(o.subtotal)}</dd>
          <dt>{M.delivery}</dt><dd className="text-right">{fee === null ? M.deliveryTbc : fee === 0 ? "Free" : formatPhp(fee)}</dd>
          <dt className="font-semibold">{M.total}</dt><dd className="text-right text-lg font-semibold">{formatPhp(o.total)}</dd>
        </dl>
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section aria-labelledby="mo-del">
          <h3 id="mo-del" className="font-sans text-h3 font-semibold text-ink">{M.deliveryTitle}</h3>
          <p className="mt-2 text-ink">{[o.address.street, o.address.barangay, o.address.city, o.address.province, o.address.postal].filter(Boolean).join(", ")}</p>
          {o.deliveryLabel && <p className="mt-1 text-sm text-ink/80">{o.deliveryLabel}</p>}
        </section>
        <section aria-labelledby="mo-pay">
          <h3 id="mo-pay" className="font-sans text-h3 font-semibold text-ink">{M.paymentTitle}</h3>
          <p className="mt-2 text-ink">{o.paymentName ?? ""}</p>
        </section>
      </div>

      <section className="mt-8" aria-labelledby="mo-hist">
        <h3 id="mo-hist" className="font-sans text-h3 font-semibold text-ink">{M.historyTitle}</h3>
        <ol className="mt-3 space-y-0">
          {[...o.history].reverse().map((h, i) => (
            <li key={i} className="relative border-l-2 border-line pb-5 pl-5 last:pb-0">
              <span aria-hidden="true" className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ${i === 0 ? "bg-raspberry" : "bg-edge"}`} />
              <p className="font-semibold text-ink">{M.status[h.status] ?? h.status.replace(/_/g, " ")}</p>
              <p className="text-sm text-ink/80">{when(h.at)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default function MyOrders() {
  const [params] = useSearchParams();
  const code = params.get("ref");
  return (
    <>
      <Seo path="/account/orders" noindex />
      <PageBanner title={M.title} body={M.lead} />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
        {code ? <One refCode={code} /> : <List />}
        <Help />
      </section>
    </>
  );
}
