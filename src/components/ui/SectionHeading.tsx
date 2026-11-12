import type { ReactNode } from "react";
import { useReveal } from "../../lib/useReveal";

type Props = {
  title: ReactNode;
  as?: "h1" | "h2" | "h3";
  onDark?: boolean;
  className?: string;
  id?: string;
};

/** The heading carries its own weight (no label above it) and rises out of a mask on scroll. */
export function SectionHeading({ title, as: Tag = "h2", onDark = false, className = "", id }: Props) {
  const size = Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3";
  const [ref, state] = useReveal<HTMLHeadingElement>();
  return (
    <Tag ref={ref} id={id} data-reveal={state} className={`head max-w-[22ch] font-display font-medium ${size} ${onDark ? "text-white" : "text-ink"} ${className}`}>
      {title}
    </Tag>
  );
}
