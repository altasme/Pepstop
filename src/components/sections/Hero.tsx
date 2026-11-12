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
import { SparkleField } from "../ui/SparkleField";
import { Parallax } from "../ui/Parallax";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Full-bleed hero. Desktop: one wide photograph with the subject on the right and a clean light area on the
 * left that carries the headline. Phone: the photograph recomposed (subject centered) above the text, so
 * type never sits on the subject. The entrance is staged once from CSS; the photograph drifts slowly on scroll.
 */
export function Hero() {
  const areas = getFocusAreas();
  return (
    <section className="relative overflow-hidden bg-petal">
      {/* Phone and tablet: image first, full width */}
      <div className="lg:hidden">
        <SlotImage slot="heroMobile" priority square sizes="100vw" />
      </div>
      {/* Desktop (1024 and up): image fills the section and drifts */}
      <div className="absolute inset-0 hidden overflow-hidden lg:block">
        <Parallax>
          <SlotImage slot="hero" priority fill objectPosition="75% 6%" sizes="100vw" />
        </Parallax>
      </div>

      <div className="relative mx-auto flex max-w-page items-center px-4 sm:px-6 lg:min-h-[38rem] lg:px-8 xl:min-h-[42rem]">
        <SparkleField
          className="hidden lg:block"
          spots={[
            { x: "46%", y: "18%", size: 14, delay: 0.4, fill: "#C30239" },
            { x: "52%", y: "62%", size: 10, delay: 1.6 },
            { x: "40%", y: "80%", size: 12, delay: 2.4, fill: "#C30239" },
          ]}
        />
        <div className="w-full py-10 sm:py-12 lg:max-w-[38rem] lg:py-16">
          <Sparkle className="hero-in mb-5 h-6 w-6" fill="#C30239" />
          <h1 className="hero-in font-display text-display font-medium text-claret" style={d(0.1)}>{HOME.heroTitle}</h1>
          <p className="hero-in mt-6 max-w-[36ch] text-lg text-ink/80 sm:text-xl" style={d(0.35)}>{HOME.heroSupport}</p>
          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={d(0.55)}>
            <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
            <CtaButton
              variant="secondary"
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
          </div>
          <Link to="/#match" className="hero-in mt-6 inline-flex min-h-11 flex-wrap items-center gap-x-2 text-sm text-ink/80" style={d(0.75)}>
            {HOME.heroMatch.lead}
            <span className="inline-flex items-center gap-1 font-semibold text-raspberry underline">{HOME.heroMatch.link}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></span>
          </Link>
          <nav aria-label={HOME.heroCollectionsLabel} className="hero-in mt-6 border-t border-gold pt-4 lg:hidden" style={d(0.9)}>
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
