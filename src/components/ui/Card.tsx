import type { ReactNode } from "react";

/** Flat container: hairline, no shadow. Never nested. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[20px] border border-line bg-surface p-5 sm:p-6 ${className}`}>{children}</div>;
}
