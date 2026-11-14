import { useRemote } from "../lib/remote";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ABOUT, ORG } from "../content/site";
import { getFocusAreas } from "../content/getContent";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { Values } from "../components/sections/Values";
import { SectionHeading } from "../components/ui/SectionHeading";
import { SlotImage } from "../components/ui/SlotImage";
import { RuleItem } from "../components/ui/RuleItem";
import { Sprig } from "../components/ui/Sprig";
import { SparkleField } from "../components/ui/SparkleField";

export default function About() {
  useRemote();
  const showMissionVision = ORG.mission && ORG.vision; // PH-08: hidden if drafts are rejected
  const areas = getFocusAreas();
  const how = [
    { title: ABOUT.philosophyTitle, body: ABOUT.philosophy },
    { title: ABOUT.educationTitle, body: ABOUT.education },
    { title: ABOUT.serviceTitle, body: ABOUT.service },
  ];
  return (
    <>
      <Seo path="/about" />
      <PageBanner title={ABOUT.bannerTitle} body={ABOUT.bannerBody} />

      <section className="mx-auto grid max-w-page items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20 lg:px-8">
        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div aria-hidden="true" className="absolute -bottom-4 -left-4 right-8 top-8 rounded-[28px] bg-rosewater" />
          <SlotImage slot="story" sizes="(min-width: 768px) 34vw, 90vw" className="relative" />
        </div>
        <div>
          <SectionHeading title={ABOUT.introTitle} className="text-claret" />
          <div className="mt-5 max-w-prose space-y-4 text-lg text-ink/80">{ORG.intro.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
      </section>

      {showMissionVision && (
        <section className="relative overflow-hidden bg-petal">
          <SparkleField className="hidden md:block" spots={[{ x: "47%", y: "14%", size: 14, delay: 0.3 }]} />
          <div className="relative mx-auto grid max-w-page gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-24 lg:px-8">
            <div>
              <h2 className="font-display text-h2 font-medium text-claret">{ABOUT.missionTitle}</h2>
              <p className="mt-4 max-w-[34ch] text-xl leading-relaxed text-ink/80">{ORG.mission}</p>
            </div>
            <div>
              <h2 className="font-display text-h2 font-medium text-claret">{ABOUT.visionTitle}</h2>
              <p className="mt-4 max-w-[34ch] text-xl leading-relaxed text-ink/80">{ORG.vision}</p>
            </div>
            {ORG.missionStatus === "draft" && <p className="text-sm text-mute md:col-span-2">{ABOUT.draftNote}</p>}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {how.map((h, i) => (
            <RuleItem key={h.title} delay={i * 140}>
              <h2 className="font-display text-2xl font-medium text-ink">{h.title}</h2>
              <div className="mt-3 space-y-4 text-ink/80">{h.body.map((p) => <p key={p}>{p}</p>)}</div>
            </RuleItem>
          ))}
        </ul>
      </section>

      <Values />

      <section className="bg-surface">
        <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <SectionHeading title={ABOUT.collectionsTitle} className="text-claret" />
          <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <RuleItem key={a.id} delay={i * 80} className="!pt-0">
                <Link to={`/shop?cat=${a.id}`} className="group flex min-h-14 items-center justify-between gap-4 py-4 font-display text-xl font-medium text-ink hover:text-raspberry">
                  {a.title}<ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </RuleItem>
            ))}
            <li aria-hidden="true" className="relative hidden h-24 sm:block">
              <Sprig className="absolute bottom-0 right-6 h-36 w-auto text-raspberry/55" />
            </li>
          </ul>
          <div className="mt-8"><Button to="/shop">{ABOUT.closingCta}</Button></div>
        </div>
      </section>

      <ContactBlock />
    </>
  );
}
