import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { Button } from "../ui/Button";
import { Sparkle } from "../ui/Sparkle";

/**
 * Soft petal field, deep claret type, one raspberry action. The image sits on a layered rosewater plate
 * inside a fine gold hairline; a small card hands the undecided visitor to a person.
 */
export function Hero() {
  const areas = getFocusAreas();
  return (
    <section className="relative overflow-hidden bg-petal">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:pb-20 md:pt-14 lg:px-8">
        <div>
          <Sparkle className="mb-6 h-6 w-6" fill="#C30239" />
          <h1 className="font-display text-display font-medium text-claret">{HOME.heroTitle}</h1>
          <p className="mt-6 max-w-[36ch] text-lg text-ink/80 sm:text-xl">{HOME.heroSupport}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
            <CtaButton
              variant="secondary"
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
          </div>
          <nav aria-label={HOME.heroCollectionsLabel} className="mt-10 border-t border-gold pt-4 lg:hidden">
            <ul className="grid grid-cols-2 gap-x-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1 text-sm text-ink/80">
              {areas.map((a, i) => (
                <li key={a.id} className="flex items-center gap-3">
                  {i > 0 && <Sparkle className="hidden h-2.5 w-2.5 sm:block" />}
                  <Link to={`/shop?cat=${a.id}`} className="inline-flex min-h-11 items-center hover:text-raspberry hover:underline">{a.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-10 md:ml-auto md:mr-6 md:max-w-[26rem] md:pb-4">
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 top-6 left-8 rounded-[32px] bg-rosewater md:-bottom-6 md:-right-6 md:left-10 md:top-8" />
          <div className="relative rounded-[32px] p-2 ring-1 ring-gold">
            <SlotImage slot="hero" priority sizes="(min-width: 768px) 38vw, 90vw" className="bg-white" />
          </div>
          <Sparkle className="absolute -left-3 top-12 hidden h-8 w-8 md:block" />
          <Link
            to="/#match"
            className="absolute -bottom-2 left-4 flex items-center gap-3 rounded-full bg-white py-2.5 pl-5 pr-4 shadow-lift transition-transform duration-200 ease-out hover:-translate-y-0.5 md:-left-8 md:-bottom-5"
          >
            <span className="text-sm text-ink/80">{HOME.heroMatch.lead}</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-raspberry">{HOME.heroMatch.link}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
