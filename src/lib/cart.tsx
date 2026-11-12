import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProductById } from "../content/getContent";
import { useRemote } from "./remote";
import type { Product, Variant } from "../content/products";

export type CartLine = { productId: string; variantId: string; qty: number };
export type ResolvedLine = CartLine & { product: Product; variant: Variant; unitPrice: number; lineTotal: number; unpriced: boolean };

const KEY = "pepstop:cart";
const MAX_QTY = 99;

type CartApi = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  /** True when any line has no price yet; totals are then confirmed by reply. */
  hasUnpriced: boolean;
  add: (productId: string, variantId: string, qty: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l && typeof l.productId === "string" && typeof l.variantId === "string" && l.qty > 0) : [];
  } catch {
    return [];
  }
}

function save(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: cart lives in memory only */
  }
}

/** Cart state in the browser only. Server render and first client render are empty; stored lines load after mount. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const remote = useRemote();

  useEffect(() => {
    setRaw(load());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setRaw(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (l: CartLine[]) => CartLine[]) => {
    setRaw((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const api = useMemo<CartApi>(() => {
    const lines: ResolvedLine[] = [];
    for (const l of raw) {
      const product = getProductById(l.productId);
      const variant = product?.variants.find((v) => v.id === l.variantId);
      if (!product || !variant) continue;
      const unitPrice = variant.pricePhp ?? 0;
      lines.push({ ...l, product, variant, unitPrice, lineTotal: unitPrice * l.qty, unpriced: variant.pricePhp === null || !product.showPrice });
    }
    const clamp = (q: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(q) || 1));
    return {
      lines: ready ? lines : [],
      count: ready ? lines.reduce((n, l) => n + l.qty, 0) : 0,
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      hasUnpriced: lines.some((l) => l.unpriced),
      add: (productId, variantId, qty) =>
        update((prev) => {
          const i = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
          if (i === -1) return [...prev, { productId, variantId, qty: clamp(qty) }];
          const copy = [...prev];
          copy[i] = { ...copy[i], qty: clamp(copy[i].qty + qty) };
          return copy;
        }),
      setQty: (productId, variantId, qty) =>
        update((prev) => prev.map((l) => (l.productId === productId && l.variantId === variantId ? { ...l, qty: clamp(qty) } : l))),
      remove: (productId, variantId) => update((prev) => prev.filter((l) => !(l.productId === productId && l.variantId === variantId))),
      clear: () => update(() => []),
    };
  }, [raw, ready, update, remote.status, remote.products]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
