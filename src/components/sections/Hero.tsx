import { HOME } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { Button } from "../ui/Button";
import { Sparkle } from "../ui/Sparkle";

/** The one drenched raspberry field: the logo's own colour, with its gold and its sparkle. */
export function Hero() {
  return (
    <section className="on-dark relative overflow-hidden bg-raspberry text-white">
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:pb-24 md:pt-20 lg:px-8">
        <div className="relative">
          <Sparkle className="mb-6 h-7 w-7" />
          <h1 className="font-display text-display font-medium text-white">{HOME.heroTitle}</h1>
          <p className="mt-6 max-w-[34ch] text-lg text-white/90 sm:text-xl">{HOME.heroSupport}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to={HOME.heroShop.to} variant="onDark">{HOME.heroShop.label}</Button>
            <CtaButton
              variant="onDarkOutline"
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="rounded-[28px] p-2 ring-1 ring-gold/80">
            <SlotImage slot="hero" priority sizes="(min-width: 768px) 38vw, 90vw" />
          </div>
          <Sparkle className="absolute -left-4 top-10 hidden h-9 w-9 md:block" />
          <Sparkle className="absolute -right-3 bottom-14 hidden h-5 w-5 md:block" fill="#FFFFFF" />
        </div>
      </div>
    </section>
  );
}
