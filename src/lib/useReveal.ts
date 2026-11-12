import { useEffect, useRef, useState } from "react";

export type RevealState = "visible" | "hidden" | "shown";

/**
 * Scroll-in state shared by every animated element. Server HTML and anything already on screen at hydration
 * stay "visible" (fully drawn, never hidden); only below-the-fold elements go "hidden" then "shown" once.
 */
export function useReveal<T extends Element>(margin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("visible");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, state] as const;
}
