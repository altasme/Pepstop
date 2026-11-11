import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Subtle fade-in on scroll. Content is visible in the prerendered HTML and for anything already in view
 * at hydration; only below-the-fold blocks are faded. Disabled under prefers-reduced-motion (see index.css).
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${state === "hidden" ? "reveal-hidden" : state === "shown" ? "reveal-shown" : ""} ${className}`}>
      {children}
    </div>
  );
}
