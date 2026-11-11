import { Link } from "react-router-dom";
import { HEALTH_BEAUTY, UI } from "../content/site";
import { getArticlesForFocusArea, getFocusAreas } from "../content/getContent";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { SlotImage } from "../components/ui/SlotImage";
import { Disclaimer } from "../components/ui/Disclaimer";
import { Reveal } from "../components/ui/Reveal";

export default function HealthBeauty() {
  const areas = getFocusAreas();
  return (
    <>
      <Seo path="/health-beauty" />
      <PageBanner eyebrow={HEALTH_BEAUTY.bannerEyebrow} title={HEALTH_BEAUTY.bannerTitle} body={HEALTH_BEAUTY.bannerBody} />
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        {areas.map((a, i) => {
          const related = getArticlesForFocusArea(a.id);
          return (
            <section key={a.id} id={a.id} className="scroll-mt-28 border-b border-magenta-deep/10 py-14 last:border-0 md:py-20">
              <Reveal>
                <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <SlotImage slot="focus" src={a.image} label={a.title} alt="" sizes="(min-width: 768px) 45vw, 90vw" />
                  <div>
                    <h2 className="font-heading text-h2 font-semibold text-magenta-deep">{a.title}</h2>
                    <p className="mt-4 text-lg text-charcoal">{a.summary}</p>
                    {related.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-ink">{HEALTH_BEAUTY.relatedLabel}</h3>
                        <ul className="mt-2">
                          {related.map((r) => (
                            <li key={r.slug}><Link to={`/education/${r.slug}`} className="inline-flex min-h-11 items-center font-semibold text-magenta underline underline-offset-4 hover:text-magenta-deep">{r.title}</Link></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </section>
          );
        })}
        <Disclaimer text={`${HEALTH_BEAUTY.disclaimerLead} ${UI.disclaimer}`} className="pb-14" />
      </div>
      <ContactBlock />
    </>
  );
}
