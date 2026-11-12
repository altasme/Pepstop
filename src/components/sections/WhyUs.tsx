import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { RuleItem } from "../ui/RuleItem";
import { Sprig } from "../ui/Sprig";
import { SparkleField } from "../ui/SparkleField";

/** Service reasons set as a two-column list on drawn hairlines: no icons, no cards. */
export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24 lg:px-8">
        <div className="relative">
          <SectionHeading title={HOME.whyTitle} className="max-w-[16ch] text-claret" />
          <p className="mt-5 max-w-[40ch] text-lg text-ink/80">{HOME.whyIntro}</p>
          <div aria-hidden="true" className="relative mt-8 hidden h-56 md:block">
            <Sprig className="absolute bottom-0 left-2 h-full w-auto text-raspberry/55" />
            <SparkleField spots={[{ x: "30%", y: "8%", size: 12, delay: 0.5 }, { x: "52%", y: "46%", size: 9, delay: 1.8, fill: "#C30239" }]} />
          </div>
        </div>
        <ul className="grid content-start gap-x-8 gap-y-8 sm:grid-cols-2">
          {HOME.whyItems.map((w, i) => (
            <RuleItem key={w.title} delay={i * 120}>
              <h3 className="font-display text-2xl font-medium text-ink">{w.title}</h3>
              <p className="mt-2 text-ink/80">{w.body}</p>
            </RuleItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
