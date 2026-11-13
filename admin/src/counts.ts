import { useEffect, useRef, useState } from "react";
import { api } from "./api";

export type Counts = { customers: number; orders: number; payments: number; inquiries: number };
const ZERO: Counts = { customers: 0, orders: 0, payments: 0, inquiries: 0 };
const POLL_MS = 30000;

/**
 * Counts of work waiting for the administrator: registrations to approve, new orders, payments to verify, new inquiries.
 * Refreshed every 30 seconds while the tab is visible, whenever the tab regains focus, and on every page change.
 * `onIncrease` fires when a count rises between two reads, so a new order or registration is noticed without a reload.
 */
export function useCounts(refreshKey: string, onIncrease: (what: "customers" | "orders" | "payments" | "inquiries", by: number) => void) {
  const [counts, setCounts] = useState<Counts>(ZERO);
  const last = useRef<Counts | null>(null);
  const notify = useRef(onIncrease);
  notify.current = onIncrease;

  useEffect(() => {
    let live = true;
    const read = async () => {
      if (document.hidden) return;
      try {
        const c = await api<Counts>("GET", "/counts");
        if (!live) return;
        const prev = last.current;
        if (prev) (Object.keys(c) as (keyof Counts)[]).forEach((k) => { if (c[k] > prev[k]) notify.current(k, c[k] - prev[k]); });
        last.current = c;
        setCounts(c);
      } catch { /* a failed poll is silent; the next one retries */ }
    };
    read();
    const t = setInterval(read, POLL_MS);
    const onVis = () => { if (!document.hidden) read(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { live = false; clearInterval(t); document.removeEventListener("visibilitychange", onVis); };
  }, [refreshKey]);

  // The browser tab shows the total, so it can be noticed from another tab.
  const total = counts.customers + counts.orders + counts.payments;
  useEffect(() => { document.title = `${total > 0 ? `(${total}) ` : ""}The Pep Stop Admin`; }, [total]);
  return counts;
}
