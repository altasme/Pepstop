import { HOME } from "../../content/site";
import { primaryCta } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SlotImage } from "../ui/SlotImage";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-page items-end gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:gap-14 md:pb-20 md:pt-16 lg:px-8">
        <div>
          <h1 className="text-display font-semibold text-ink">{HOME.heroTitle}</h1>
          <p className="mt-6 max-w-[34ch] text-lg text-ink/80 sm:text-xl">{HOME.heroSupport}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to={HOME.heroShop.to}>{HOME.heroShop.label}</Button>
            <CtaButton
              variant="secondary"
              channel={{ kind: primaryCta.kind, href: primaryCta.href, icon: primaryCta.kind === "messenger" ? "messenger" : "phone", external: primaryCta.kind === "messenger" }}
              label={primaryCta.label}
            />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md md:max-w-none">
          <SlotImage slot="hero" priority sizes="(min-width: 768px) 38vw, 90vw" />
        </div>
      </div>
    </section>
  );
}
