import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, as: Tag = "h2", align = "left", onDark = false, className = "", id }: Props) {
  const size = Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-prose ${className}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.14em] ${onDark ? "text-gold" : "text-rose-ink"}`}>{eyebrow}</p>
      )}
      <Tag id={id} className={`font-heading font-semibold ${size} ${onDark ? "text-white" : "text-magenta-deep"}`}>{title}</Tag>
    </div>
  );
}
