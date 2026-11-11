import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "onDark" | "onDarkOutline";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold leading-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-magenta text-white hover:bg-magenta-deep",
  secondary: "border-2 border-magenta text-magenta hover:bg-magenta hover:text-white",
  onDark: "bg-ivory text-magenta-deep hover:bg-blush",
  onDarkOutline: "border-2 border-gold text-white hover:bg-white/10",
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
    return <button type={submit ? "submit" : "button"} className={`${cls} disabled:opacity-50`} onClick={onClick} disabled={disabled}>{children}</button>;
  }
  if (to) return <Link to={to} className={cls} onClick={onClick}>{children}</Link>;
  return (
    <a
      href={href}
      className={cls}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
