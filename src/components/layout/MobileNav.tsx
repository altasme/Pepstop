import { AccountLink } from "./AccountLink";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { NAV, UI } from "../../content/site";
import { getChannels, hasChatChannel } from "../../lib/cta";
import { CHAT_HELPER } from "../../content/site";
import { CtaButton } from "../ui/CtaButton";
import { Logo } from "../ui/Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen menu. Focus is trapped while open, Esc closes, focus returns to the opener.
 * It is portalled to the page body: the sticky header uses a backdrop blur, and a blurred ancestor becomes the containing
 * block for fixed children, which would shrink "full screen" to the height of the header.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const channels = getChannels();

  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={UI.menuTitle}
      className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-claret px-4 pb-8 pt-3 text-white sm:px-6 xl:hidden"
    >
      <div className="flex items-center justify-between">
        <Logo onDark />
        <button ref={closeBtn} type="button" onClick={onClose} aria-label={UI.closeMenu} className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white hover:bg-surface/10">
          <X className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <nav aria-label={UI.mobileNavLabel} className="mt-8">
        <ul className="divide-y divide-white/15 border-y border-white/15">
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `flex min-h-14 items-center text-3xl font-semibold tracking-tight ${isActive ? "text-gold" : "text-white"}`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6"><AccountLink onNavigate={onClose} className="inline-flex min-h-12 items-center rounded-full border border-white/40 px-6 text-lg font-semibold text-white hover:bg-surface/10" /></div>
      <div className="mt-8">
        <p className="mb-3 text-sm text-white/85">{hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="flex flex-col gap-3">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "onDark" : "onDarkOutline"} />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
