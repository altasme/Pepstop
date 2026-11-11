import { HOME } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { ArcMotif } from "../ui/ArcMotif";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush via-ivory to-ivory">
      <ArcMotif className="pointer-events-none absolute -left-16 top-4 w-96 opacity-50" />
      <div className="relative mx-auto grid max-w-page items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:gap-16 lg:px-8">
        <div>
          <h1 className="font-heading text-display font-semibold text-magenta-deep">{HOME.heroTitle}</h1>
          <p className="mt-5 max-w-prose text-lg text-charcoal">{HOME.heroSupport}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
            <Button to={HOME.heroSecondary.to} variant="secondary">{HOME.heroSecondary.label}</Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <SlotImage slot="hero" priority sizes="(min-width: 768px) 45vw, 90vw" />
        </div>
      </div>
    </section>
  );
}
