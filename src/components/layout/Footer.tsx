import { Link } from "react-router-dom";
import { CONTACT, CONTACT_PAGE, CTA, NAV, ORG, UI } from "../../content/site";
import { phone } from "../../lib/phone";
import { Logo } from "../ui/Logo";

declare const __BUILD_YEAR__: string;

const colHead = "text-sm font-semibold text-white";
const link = "inline-flex min-h-11 items-center text-white/80 hover:text-white hover:underline";

export function Footer() {
  const legal = ORG.legalName && ORG.registration ? `${ORG.legalName} · ${ORG.registration}` : null; // PH-06
  return (
    <footer className="on-dark bg-ink pb-28 pt-16 text-white md:pb-10">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-xs text-white/80">{ORG.tagline}</p>
          </div>
          <nav aria-label={UI.footerNavLabel}>
            <h2 className={colHead}>{UI.footerExploreTitle}</h2>
            <ul className="mt-3">
              {NAV.map((n) => (
                <li key={n.to}><Link to={n.to} className={link}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={colHead}>{UI.footerContactTitle}</h2>
            <ul className="mt-3">
              <li><a href={phone.telHref} className={link}>{phone.display}</a></li>
              {CTA.email && CONTACT.email && <li><a href={CTA.email.href} className={link}>{CONTACT.email}</a></li>}
              {CONTACT.facebookUrl && <li><a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className={link}>{CONTACT_PAGE.facebookLabel}</a></li>}
              {CONTACT.hours && <li className="flex min-h-11 items-center text-white/80">{CONTACT.hours}</li>}
            </ul>
          </div>
        </div>
        <div className="mt-14 space-y-3 border-t border-white/15 pt-6 text-sm text-white/75">
          <p className="max-w-3xl">{UI.disclaimer}</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p>© {__BUILD_YEAR__} {ORG.name}.{legal ? ` ${legal}` : ""}</p>
            <Link to="/privacy" className="inline-flex min-h-11 items-center hover:text-white hover:underline">{UI.privacyLink}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
