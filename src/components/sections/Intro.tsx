import { HOME, ORG } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";

export function Intro() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-page gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <SectionHeading eyebrow={HOME.introEyebrow} title={HOME.introTitle} />
        <div className="space-y-5 text-lg text-charcoal">
          {ORG.intro.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
