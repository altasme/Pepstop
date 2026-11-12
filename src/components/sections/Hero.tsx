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
 * Full-bleed hero. Desktop: one wide photograph with the subject on the right and a clean light area on the
 * left that carries the headline. Phone: the photograph recomposed (subject centered) above the text, so
 * type never sits on the subject. Claret type needs a light left area: see HANDOVER for the image brief.
 */
export function Hero() {
  const areas = getFocusAreas();
  return (
    <section className="relative overflow-hidden bg-petal">
      {/* Phone: image first, full width */}
      <div className="md:hidden">
        <SlotImage slot="heroMobile" priority square sizes="100vw" />
      </div>
      {/* Desktop: image fills the section */}
      <div className="absolute inset-0 hidden md:block">
        <SlotImage slot="hero" priority fill objectPosition="75% center" sizes="100vw" />
      </div>

      <div className="relative mx-auto flex max-w-page items-center px-4 sm:px-6 md:min-h-[34rem] lg:min-h-[38rem] lg:px-8 xl:min-h-[42rem]">
        <div className="w-full py-10 md:max-w-[34rem] md:py-16 lg:max-w-[38rem]">
          <Sparkle className="mb-5 h-6 w-6" fill="#C30239" />
          <h1 className="font-display text-display font-medium text-claret">{HOME.heroTitle}</h1>
          <p className="mt-6 max-w-[36ch] text-lg text-ink/80 sm:text-xl">{HOME.heroSupport}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
            <CtaButton
              variant="secondary"
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
          </div>
          <Link to="/#match" className="mt-6 inline-flex min-h-11 flex-wrap items-center gap-x-2 text-sm text-ink/80">
            {HOME.heroMatch.lead}
            <span className="inline-flex items-center gap-1 font-semibold text-raspberry underline">{HOME.heroMatch.link}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></span>
          </Link>
          <nav aria-label={HOME.heroCollectionsLabel} className="mt-6 border-t border-gold pt-4 lg:hidden">
            <ul className="grid grid-cols-2 gap-x-4 text-sm text-ink/80 sm:flex sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
              {areas.map((a, i) => (
                <li key={a.id} className="flex items-center gap-3">
                  {i > 0 && <Sparkle className="hidden h-2.5 w-2.5 sm:block" />}
                  <Link to={`/shop?cat=${a.id}`} className="inline-flex min-h-11 items-center hover:text-raspberry hover:underline">{a.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
