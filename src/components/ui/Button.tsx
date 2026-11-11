import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "onDark" | "onDarkOutline";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold leading-none transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-raspberry text-white hover:bg-raspberry-deep",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
  onDark: "bg-white text-ink hover:bg-petal",
  onDarkOutline: "border border-white/60 text-white hover:bg-white hover:text-ink",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Internal route. */
  to?: string;
  /** External or protocol link (tel:, sms:, https:). */
  href?: string;
  external?: boolean;
  onClick?: () => void;
  /** Render a real <button> (no to/href). */
  submit?: boolean;
  disabled?: boolean;
};

export function Button({ children, variant = "primary", className = "", to, href, external, onClick, submit, disabled }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (!to && !href) {
    return <button type={submit ? "submit" : "button"} className={`${cls} disabled:cursor-not-allowed disabled:opacity-40`} onClick={onClick} disabled={disabled}>{children}</button>;
  }
  if (to) return <Link to={to} className={cls} onClick={onClick}>{children}</Link>;
  return (
    <a href={href} className={cls} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
