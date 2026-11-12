import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { Button } from "../ui/Button";
import { Sparkle } from "../ui/Sparkle";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Hero. From 1280 px up: one wide photograph fills the section at its own 12:5 ratio (no zoom, no crop), the
 * group on the right and a clean light wall on the left carrying the headline. Below 1280 px: the 6:5 photograph
 * (cropped wider on tablets) sits above the text, so type never meets the subjects. The entrance is staged once
 * from CSS.
 */
export function Hero() {
  const areas = getFocusAreas();
  return (
    <section className="relative overflow-hidden bg-petal xl:aspect-[12/5]">
      {/* Under 1280: image first, full width */}
      <div className="relative aspect-[6/5] sm:aspect-[16/9] md:aspect-[2/1] xl:hidden">
        <SlotImage slot="heroMobile" priority fill objectPosition="50% 36%" sizes="100vw" />
      </div>
      {/* 1280 and up: image fills the section */}
      <div className="absolute inset-0 hidden xl:block">
        <SlotImage slot="hero" priority fill objectPosition="100% 20%" sizes="100vw" />
      </div>

      <div className="relative xl:absolute xl:inset-0">
        <div className="mx-auto flex h-full max-w-page items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full py-10 sm:py-12 xl:max-w-[34rem] xl:py-0">
            <Sparkle className="hero-in mb-5 h-6 w-6" fill="#C30239" />
            <h1 className="hero-in font-display text-display font-medium text-claret" style={d(0.1)}>{HOME.heroTitle}</h1>
            <p className="hero-in mt-5 max-w-[36ch] text-lg text-ink/80 sm:text-xl" style={d(0.35)}>{HOME.heroSupport}</p>
            <div className="hero-in mt-7 flex flex-col gap-3 sm:flex-row" style={d(0.55)}>
              <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
              <CtaButton
                variant="secondary"
                channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
                label={primaryCta.label}
              />
            </div>
            <Link to="/#match" className="hero-in mt-5 inline-flex min-h-11 flex-wrap items-center gap-x-2 text-sm text-ink/80" style={d(0.75)}>
              {HOME.heroMatch.lead}
              <span className="inline-flex items-center gap-1 font-semibold text-raspberry underline">{HOME.heroMatch.link}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></span>
            </Link>
            <nav aria-label={HOME.heroCollectionsLabel} className="hero-in mt-5 border-t border-gold pt-4 lg:hidden" style={d(0.9)}>
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
      </div>
    </section>
  );
}
