import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../../lib/useReveal";

/** A list item on a hairline that draws itself across when it scrolls into view. */
export function RuleItem({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, state] = useReveal<HTMLLIElement>();
  return (
    <li ref={ref} data-reveal={state} style={{ "--d": `${delay}ms` } as CSSProperties} className={`relative pt-5 ${className}`}>
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-raspberry/20" />
      <span aria-hidden="true" className="rule-fill absolute left-0 top-0 h-px w-full origin-left bg-raspberry/70" />
      {children}
    </li>
  );
}
