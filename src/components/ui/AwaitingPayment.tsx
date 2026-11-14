import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CONFIRMATION } from "../../content/site";
import { useRemote } from "../../lib/remote";

/** Shown to a signed-in customer who placed an order but has not uploaded proof of payment yet. */
export function AwaitingPayment({ className = "" }: { className?: string }) {
  const { customer } = useRemote();
  const [ref, setRef] = useState<string | null>(null);
  useEffect(() => {
    if (!customer) return;
    let live = true;
    fetch("/api/customer/orders/awaiting-payment", { credentials: "same-origin", headers: { "x-pepstop": "1" } })
      .then((r) => r.json().catch(() => null))
      .then((d: { order: { ref: string } | null } | null) => { if (live) setRef(d?.order?.ref ?? null); })
      .catch(() => {});
    return () => { live = false; };
  }, [customer]);
  if (!ref) return null;
  return (
    <p role="status" className={`rounded-xl bg-petal px-4 py-3 text-ink ${className}`}>
      <span className="font-semibold">{CONFIRMATION.awaitingTitle}</span>{" "}
      <Link to="/checkout/confirmation" className="font-semibold text-raspberry underline underline-offset-4">{CONFIRMATION.awaitingLink}</Link>
    </p>
  );
}
