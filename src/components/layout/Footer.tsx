import { Link } from "react-router-dom";
import { Mail, Phone, Clock, Link2 } from "lucide-react";
import { CONTACT, CONTACT_PAGE, CTA, NAV, ORG, UI } from "../../content/site";
import { phone } from "../../lib/phone";
import { Logo } from "../ui/Logo";
import { ArcMotif } from "../ui/ArcMotif";
import { Disclaimer } from "../ui/Disclaimer";

declare const __BUILD_YEAR__: string;

export function Footer() {
  const legal = ORG.legalName && ORG.registration ? `${ORG.legalName} · ${ORG.registration}` : null; // PH-06
  return (
    <footer className="on-dark relative overflow-hidden bg-magenta-deep pb-28 pt-14 text-white md:pb-10">
      <ArcMotif className="pointer-events-none absolute -top-6 right-0 w-72 opacity-40" dark />
      <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-4 max-w-xs text-base text-white/90">{ORG.tagline}</p>
          </div>
          <nav aria-label={UI.footerNavLabel}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">{UI.footerExploreTitle}</h2>
            <ul className="mt-3 space-y-1">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className="inline-flex min-h-11 items-center text-white/90 hover:text-white hover:underline">{n.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">{UI.footerContactTitle}</h2>
            <ul className="mt-3 space-y-1">
              <li><a href={phone.telHref} className="inline-flex min-h-11 items-center gap-2 text-white/90 hover:text-white hover:underline"><Phone className="h-4 w-4 text-gold" aria-hidden="true" />{phone.display}</a></li>
              {CTA.email && CONTACT.email && (
                <li><a href={CTA.email.href} className="inline-flex min-h-11 items-center gap-2 text-white/90 hover:text-white hover:underline"><Mail className="h-4 w-4 text-gold" aria-hidden="true" />{CONTACT.email}</a></li>
              )}
              {CONTACT.facebookUrl && (
                <li><a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-white/90 hover:text-white hover:underline"><Link2 className="h-4 w-4 text-gold" aria-hidden="true" />{CONTACT_PAGE.facebookLabel}</a></li>
              )}
              {CONTACT.hours && (
                <li className="flex min-h-11 items-center gap-2 text-white/90"><Clock className="h-4 w-4 text-gold" aria-hidden="true" />{CONTACT.hours}</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-10 space-y-3 border-t border-white/15 pt-6 text-sm text-white/85">
          <Disclaimer className="!text-white/85" />
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>
              © {__BUILD_YEAR__} {ORG.name}.{legal ? ` ${legal}` : ""}
            </p>
            <Link to="/privacy" className="inline-flex min-h-11 items-center hover:underline">{UI.privacyLink}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
