import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { STICKY_CTA_HIDDEN_ON } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";

/** Mobile only (below 768px). Appears once the visitor scrolls past the hero. Hidden on Contact and Privacy. */
export function StickyCtaBar() {
  const { pathname } = useLocation();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (STICKY_CTA_HIDDEN_ON.includes(pathname) || pathname.startsWith("/shop/") || !past) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-16px_rgb(var(--c-ink)/0.3)] backdrop-blur md:hidden">
      <CtaButton
        channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
        label={primaryCta.label}
        className="w-full"
      />
    </div>
  );
}
