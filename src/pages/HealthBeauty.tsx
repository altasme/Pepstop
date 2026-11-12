import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HEALTH_BEAUTY, UI } from "../content/site";
import { getArticlesForFocusArea, getFocusAreas } from "../content/getContent";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { SlotImage } from "../components/ui/SlotImage";
import { Button } from "../components/ui/Button";
import { Disclaimer } from "../components/ui/Disclaimer";
import { Reveal } from "../components/ui/Reveal";
import { Sparkle } from "../components/ui/Sparkle";

/** Five collections, set as a quiet editorial index: numeral, name, plain summary, one action. */
export default function HealthBeauty() {
  const areas = getFocusAreas();
  return (
    <>
      <Seo path="/health-beauty" />
      <PageBanner title={HEALTH_BEAUTY.bannerTitle} body={HEALTH_BEAUTY.bannerBody} />
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <ol>
          {areas.map((a, i) => {
            const related = getArticlesForFocusArea(a.id);
            return (
              <li key={a.id} id={a.id} className="scroll-mt-40 border-b border-line py-10 last:border-0 md:py-14">
                <Reveal>
                  <div className="grid items-start gap-6 md:grid-cols-[4rem_1fr_16rem] md:gap-10 lg:grid-cols-[5rem_1fr_20rem]">
                    <span className="font-display text-5xl font-medium leading-none text-raspberry md:text-6xl">{i + 1}</span>
                    <div>
                      <h2 className="font-display text-h2 font-medium text-raspberry-deep">{a.title}</h2>
                      <p className="mt-1 text-lg text-mute">{a.tagline}</p>
                      <p className="mt-4 max-w-prose text-ink/80">{a.summary}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Button to={`/shop?cat=${a.id}`}>{HEALTH_BEAUTY.shopCollection}</Button>
                        {related.map((r) => (
                          <Link key={r.slug} to={`/education/${r.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline hover:text-raspberry">
                            {r.title}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <SlotImage slot="focus" src={a.image} alt="" sizes="(min-width: 1024px) 20rem, 16rem" compact className="md:block" />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <section className="border-t border-line py-14 text-center md:py-16">
          <Sparkle className="mx-auto mb-4 h-5 w-5" fill="#C30239" />
          <h2 className="font-display text-h2 font-medium text-claret">{HEALTH_BEAUTY.closingTitle}</h2>
          <p className="mx-auto mt-4 max-w-prose text-lg text-ink/80">{HEALTH_BEAUTY.closingBody}</p>
          <div className="mt-6"><Button to="/contact">{HEALTH_BEAUTY.closingCta}</Button></div>
        </section>
        <Disclaimer text={`${HEALTH_BEAUTY.disclaimerLead} ${UI.disclaimer}`} className="pb-14" />
      </div>
      <ContactBlock />
    </>
  );
}
