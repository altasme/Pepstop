import { useEffect, useRef, type ReactNode } from "react";

/** Slow vertical drift for a full-bleed photograph. Desktop (1024 and up) only, off under reduced motion. */
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 1023px)").matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      el.style.transform = `translate3d(0, ${Math.min(window.scrollY, 900) * 0.12}px, 0) scale(1.1)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className={`h-full w-full origin-top will-change-transform ${className}`}>{children}</div>;
}
