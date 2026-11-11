import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { NAV, UI } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { trackCta } from "../../lib/analytics";
import { Logo } from "../ui/Logo";
import { MobileNav } from "./MobileNav";
import { CartButton } from "./CartButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-200 ${scrolled ? "border-magenta-deep/10 bg-ivory/95 shadow-soft backdrop-blur" : "border-transparent bg-ivory"}`}>
      <div className={`mx-auto flex max-w-page items-center justify-between gap-4 px-4 transition-all duration-200 sm:px-6 lg:px-8 ${scrolled ? "py-2" : "py-4"}`}>
        <Logo compact={scrolled} />
        <nav aria-label={UI.primaryNavLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `inline-flex min-h-11 items-center rounded-full px-3 text-base font-medium transition-colors hover:text-magenta ${isActive ? "text-magenta underline decoration-gold decoration-2 underline-offset-8" : "text-charcoal"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <CartButton />
          <a
            href={primaryCta.href}
            {...(primaryCta.kind === "messenger" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => trackCta(primaryCta.kind, pathname)}
            className="hidden min-h-12 items-center rounded-full bg-magenta px-6 text-base font-semibold text-white transition-colors hover:bg-magenta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex"
          >
            {primaryCta.navLabel}
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={UI.openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-magenta-deep hover:bg-blush lg:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
