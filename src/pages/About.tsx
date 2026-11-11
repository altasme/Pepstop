import { ABOUT, ORG } from "../content/site";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { ContactBlock } from "../components/sections/ContactBlock";
import { Values } from "../components/sections/Values";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Card } from "../components/ui/Card";

export default function About() {
  const showMissionVision = ORG.mission && ORG.vision; // PH-08: hidden if drafts are rejected
  return (
    <>
      <Seo path="/about" />
      <PageBanner title={ABOUT.bannerTitle} body={ABOUT.bannerBody} />
      <section className="mx-auto grid max-w-page gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
        <SectionHeading title={ABOUT.introTitle} />
        <div className="space-y-5 text-lg text-ink">{ORG.intro.map((p) => <p key={p}>{p}</p>)}</div>
      </section>
      {showMissionVision && (
        <section className="bg-petal">
          <div className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <h2 className="font-sans text-h3 font-semibold text-ink">{ABOUT.missionTitle}</h2>
                <p className="mt-3 text-ink">{ORG.mission}</p>
              </Card>
              <Card>
                <h2 className="font-sans text-h3 font-semibold text-ink">{ABOUT.visionTitle}</h2>
                <p className="mt-3 text-ink">{ORG.vision}</p>
              </Card>
            </div>
            {ORG.missionStatus === "draft" && <p className="mt-4 text-sm text-ink/80">{ABOUT.draftNote}</p>}
          </div>
        </section>
      )}
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h2 className="font-sans text-h3 font-semibold text-ink">{ABOUT.philosophyTitle}</h2>
            <div className="mt-3 space-y-4 text-ink">{ABOUT.philosophy.map((p) => <p key={p}>{p}</p>)}</div>
          </div>
          <div>
            <h2 className="font-sans text-h3 font-semibold text-ink">{ABOUT.educationTitle}</h2>
            <p className="mt-3 text-ink">{ABOUT.education}</p>
          </div>
          <div>
            <h2 className="font-sans text-h3 font-semibold text-ink">{ABOUT.serviceTitle}</h2>
            <p className="mt-3 text-ink">{ABOUT.service}</p>
          </div>
        </div>
      </section>
      <Values />
      <ContactBlock />
    </>
  );
}
