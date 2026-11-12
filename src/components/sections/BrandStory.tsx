import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME, ORG } from "../../content/site";
import { SlotImage } from "../ui/SlotImage";
import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";
import { Reveal } from "../ui/Reveal";
import { SparkleField } from "../ui/SparkleField";
import { Sprig } from "../ui/Sprig";

/** The business, not just the stock: who is behind the shop, what it believes, and a way into the full story. */
export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-petal">
      <Sprig className="pointer-events-none absolute -right-4 bottom-0 hidden h-[60%] w-auto text-raspberry/40 lg:block" />
      <SparkleField className="hidden md:block" spots={[{ x: "36%", y: "12%", size: 14, delay: 0.4 }, { x: "92%", y: "20%", size: 10, delay: 1.9, fill: "#C30239" }]} />
      <div className="relative mx-auto grid max-w-page items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-24 lg:px-8">
        <Reveal>
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 right-8 top-8 rounded-[28px] bg-rosewater" />
            <SlotImage slot="story" sizes="(min-width: 768px) 34vw, 90vw" className="relative bg-white" />
          </div>
        </Reveal>
        <div>
          <Sparkle className="mb-4 h-5 w-5" fill="#C30239" />
          <SectionHeading title={HOME.storyHeading} className="max-w-[22ch] text-claret" />
          <div className="mt-5 max-w-prose space-y-4 text-lg text-ink/80">
            {ORG.intro.map((p) => <p key={p}>{p}</p>)}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {HOME.storyPillars.map((p) => (
              <li key={p} className="rounded-full border border-raspberry/40 bg-white px-4 py-1.5 text-sm font-medium text-raspberry-deep">{p}</li>
            ))}
          </ul>
          <Link to={HOME.storyLink.to} className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline hover:text-raspberry">
            {HOME.storyLink.label}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
