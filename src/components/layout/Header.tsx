import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { HOME, NAV, UI } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { trackCta } from "../../lib/analytics";
import { Logo } from "../ui/Logo";
import { Sparkle } from "../ui/Sparkle";
import { getFocusAreas } from "../../content/getContent";
import { MobileNav } from "./MobileNav";
import { CartButton } from "./CartButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const areas = getFocusAreas();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <p className="on-dark flex items-center justify-center gap-2 bg-raspberry px-4 py-2 text-center text-sm font-medium text-white"><Sparkle className="h-3 w-3 shrink-0" />{HOME.announcement}<Sparkle className="h-3 w-3 shrink-0" /></p>
      <header className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-[border-color] duration-200 ${scrolled ? "border-line" : "border-transparent"}`}>
        <div className={`mx-auto flex max-w-page items-center justify-between gap-4 px-4 transition-all duration-200 ease-out sm:px-6 lg:px-8 ${scrolled ? "py-2" : "py-3"}`}>
          <Logo compact={scrolled} />
          <nav aria-label={UI.primaryNavLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `inline-flex min-h-11 items-center px-3 text-base font-medium transition-colors hover:text-raspberry ${isActive ? "text-raspberry underline decoration-2 underline-offset-[10px]" : "text-ink"}`
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
              className="hidden min-h-11 items-center rounded-full bg-raspberry px-5 text-base font-semibold text-white transition-colors hover:bg-raspberry-deep sm:inline-flex"
            >
              {primaryCta.navLabel}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={UI.openMenu}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-petal lg:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav aria-label={UI.collectionsBarLabel} className="hidden border-t border-line lg:block">
          <ul className="mx-auto flex max-w-page items-center justify-center gap-1 px-8">
            {areas.map((a) => (
              <li key={a.id}>
                <Link to={`/shop?cat=${a.id}`} className="inline-flex min-h-11 items-center px-4 text-sm font-medium text-ink/80 transition-colors hover:text-raspberry">{a.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav open={open} onClose={() => setOpen(false)} />
      </header>
    </>
  );
}
