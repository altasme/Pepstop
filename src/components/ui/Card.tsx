import type { ReactNode } from "react";

/** Flat container: hairline, no shadow. Never nested. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-line bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}
