import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-6 shadow-soft ring-1 ring-magenta-deep/5 ${className}`}>{children}</div>;
}
