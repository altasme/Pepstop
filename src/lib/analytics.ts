/** Cloudflare Web Analytics wrapper (cookieless). Payloads carry { page, cta } or { slug } only. */
import { ANALYTICS } from "../content/site";

export type CtaKind = "messenger" | "call" | "sms" | "viber" | "whatsapp" | "email" | "phone";

type Payload = Record<string, string>;
type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

let started = false;

export function initAnalytics() {
  if (started || typeof document === "undefined") return;
  started = true;
  if (ANALYTICS.cfBeaconToken) {
    const s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: ANALYTICS.cfBeaconToken }));
    document.head.appendChild(s);
  }
  // Meta Pixel (★C8) is intentionally not loaded in Phase 1 unless an ID is supplied; loader goes here.
}

export function track(event: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("pepstop:event", { detail: { event, ...payload } }));
  if (ANALYTICS.metaPixelId) (window as FbqWindow).fbq?.("trackCustom", event, payload);
  if (import.meta.env.DEV) console.debug("[analytics]", event, payload);
}

export const trackCta = (kind: CtaKind, page: string) => track(`cta_${kind}_click`, { page, cta: kind });
export const trackArticleView = (slug: string) => track("article_view", { slug });
