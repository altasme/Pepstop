import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../../lib/useReveal";

/** Rise-and-fade on scroll. `delay` (ms) staggers siblings. Content is visible without JavaScript. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, state] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-reveal={state} style={{ "--d": `${delay}ms` } as CSSProperties} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
