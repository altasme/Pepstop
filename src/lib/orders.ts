/**
 * Front-end order handling (COMMERCE_MODE "frontend"). Nothing is sent to a server.
 * The order is kept in sessionStorage for the confirmation screen, then sent by the customer through chat.
 * Phase 2A replaces `submitOrder` with a POST to the orders endpoint.
 */
import { CONFIRMATION, CONTACT, ORG, PAYMENT_METHODS } from "../content/site";
import type { ResolvedLine } from "./cart";
import { amountLabel } from "./format";

export type Customer = {
  fullName: string; mobile: string; email: string;
  street: string; barangay: string; city: string; province: string; postal: string;
  notes: string; payment: string; delivery: string;
};

export type Order = {
  ref: string;
  placedAt: string;
  customer: Customer;
  lines: { name: string; variant: string; qty: number; unitPrice: number; lineTotal: number; isSample: boolean; unpriced: boolean }[];
  subtotal: number;
  hasUnpriced: boolean;
  /** Delivery fee set by the chosen option, or null when it is confirmed later. */
  deliveryFee?: number | null;
  deliveryLabel?: string | null;
  total?: number;
  paymentName?: string;
  /** Cash on delivery: nothing to pay or upload now. */
  cod?: boolean;
  /** True when the order was saved by the server and can receive payment details. */
  remote?: boolean;
};

const KEY = "pepstop:lastOrder";

export function makeRef(): string {
  return `PS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export function buildOrder(customer: Customer, lines: ResolvedLine[], subtotal: number, hasUnpriced: boolean): Order {
  return {
    ref: makeRef(),
    placedAt: new Date().toISOString(),
    customer,
    subtotal,
    hasUnpriced,
    lines: lines.map((l) => ({ name: l.product.name, variant: l.variant.label, qty: l.qty, unitPrice: l.unitPrice, lineTotal: l.lineTotal, isSample: !!l.product.isSample, unpriced: l.unpriced })),
  };
}

/** Sends the order to the Worker. Returns the saved order (with the server reference) or throws a short message. */
export async function submitOrderRemote(order: Order, lines: ResolvedLine[]): Promise<Order> {
  const res = await fetch("/api/customer/orders", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json", "x-pepstop": "1" },
    body: JSON.stringify({ customer: order.customer, items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, qty: l.qty })) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error === "too_many_requests" ? "rate" : data.error ?? "failed");
  return submitOrder({ ...order, ref: data.ref, remote: true, deliveryFee: data.deliveryFee ?? null, deliveryLabel: data.deliveryLabel ?? null, total: data.total ?? order.subtotal, cod: !!data.cod });
}

/** Front-end stub. Returns the order unchanged; the backend call goes here in Phase 2A. */
export function submitOrder(order: Order): Order {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
  return order;
}

export function loadLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

export const paymentLabel = (id: string, name?: string) => name ?? PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;

export function addressLine(c: Customer): string {
  return [c.street, `Brgy. ${c.barangay}`, c.city, c.province, c.postal].join(", ");
}

/** Plain text summary used for the chat message and the copy button. */
export function orderText(o: Order): string {
  const items = o.lines.map((l) => `- ${l.name} (${l.variant}) x ${l.qty}: ${amountLabel(l.lineTotal, l.unpriced)}`).join("\n");
  return [
    CONFIRMATION.messageIntro,
    `${CONFIRMATION.reference}: ${o.ref}`,
    items,
    `Subtotal: ${amountLabel(o.subtotal, o.hasUnpriced)}`,
    o.deliveryLabel ? `Delivery: ${o.deliveryLabel}, ${o.deliveryFee ? amountLabel(o.deliveryFee, false) : "free"}` : "Delivery fee: to be confirmed",
    o.total !== undefined && !o.hasUnpriced ? `Total: ${amountLabel(o.total, false)}` : "",
    `Name: ${o.customer.fullName}`,
    `Mobile: ${o.customer.mobile}${o.customer.email ? ` | Email: ${o.customer.email}` : ""}`,
    `Deliver to: ${addressLine(o.customer)}`,
    `Payment: ${paymentLabel(o.customer.payment, o.paymentName)}`,
    o.customer.notes ? `Notes: ${o.customer.notes}` : "",
    `${ORG.name}`,
  ].filter(Boolean).join("\n");
}

export const smsHrefWithBody = (body: string) => `sms:${CONTACT.phoneE164}?&body=${encodeURIComponent(body)}`;
export const whatsappHrefWithBody = (body: string) => `https://wa.me/${CONTACT.phoneE164.replace("+", "")}?text=${encodeURIComponent(body)}`;
