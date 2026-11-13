import { Link } from "react-router-dom";
import { useRemote } from "../../lib/remote";
import { COA, CONTACT, CONTACT_PAGE, CTA, NAV, ORG, PAYMENT_METHODS, UI } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { phone } from "../../lib/phone";
import { Logo } from "../ui/Logo";
import { Sprig } from "../ui/Sprig";
import { SparkleField } from "../ui/SparkleField";

declare const __BUILD_YEAR__: string;

const colHead = "text-sm font-semibold text-white";
const link = "inline-flex min-h-11 items-center text-white/80 hover:text-white hover:underline";
const company = NAV.filter((n) => ["/about", "/health-beauty", "/education"].includes(n.to));

export function Footer() {
  const { customer } = useRemote();
  const legal = ORG.legalName && ORG.registration ? `${ORG.legalName} · ${ORG.registration}` : null; // PH-06
  const areas = getFocusAreas();
  return (
    <footer className="on-dark relative overflow-hidden bg-claret pb-28 pt-16 text-white md:pb-10">
      <Sprig className="pointer-events-none absolute -bottom-10 -right-6 hidden h-[26rem] w-auto text-white/15 lg:block" />
      <SparkleField className="hidden lg:block" spots={[{ x: "88%", y: "12%", size: 12, delay: 0.6 }, { x: "94%", y: "52%", size: 9, delay: 2 }]} />
      <div className="relative mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo onDark />
            <p className="mt-5 max-w-xs text-white/80">{UI.footerBrand}</p>
          </div>
          <nav aria-label={UI.footerNavLabel}>
            <h2 className={colHead}>{UI.footerShopTitle}</h2>
            <ul className="mt-3">
              <li><Link to="/shop" className={link}>{UI.footerShopAll}</Link></li>
              {areas.map((a) => (
                <li key={a.id}><Link to={`/shop?cat=${a.id}`} className={link}>{a.title}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={colHead}>{UI.footerCompanyTitle}</h2>
            <ul className="mt-3">
              {company.map((n) => (
                <li key={n.to}><Link to={n.to} className={link}>{n.label}</Link></li>
              ))}
              <li><Link to="/contact" className={link}>Contact</Link></li>
              {customer && <li><Link to="/coa" className={link}>{COA.link}</Link></li>}
              <li><Link to="/privacy" className={link}>{UI.privacyLink}</Link></li>
              {UI.socials.map((s) => <li key={s.label}><a href={s.href} className={link} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
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

        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="text-sm font-semibold text-white">{UI.paymentsTitle}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PAYMENT_METHODS.filter((m) => m.enabled).map((m) => (
              <li key={m.id} className="rounded-full border border-white/40 px-3.5 py-1.5 text-sm text-white">{m.label}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-white/75">{UI.paymentsNote}</p>
        </div>

        <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-sm text-white/75">
          <p className="max-w-3xl">{UI.disclaimer}</p>
          <p>© {__BUILD_YEAR__} {ORG.name}. {UI.rights}{legal ? ` ${legal}` : ""}</p>
        </div>
      </div>
    </footer>
  );
}
