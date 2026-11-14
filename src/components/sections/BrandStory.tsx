import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { SlotImage } from "../ui/SlotImage";
import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";
import { Reveal } from "../ui/Reveal";
import { RuleItem } from "../ui/RuleItem";

/**
 * The business behind the shop, in one section: the story with its image and three pillars, then the four service
 * reasons. (They were two separate bands that said the same thing.) Pillars and reasons are plain hairline lists, not cards.
 */
export function BrandStory() {
  return (
    <section className="bg-petal">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Reveal className="hidden md:block">
            <div className="relative mx-auto w-full max-w-sm md:max-w-none">
              <div aria-hidden="true" className="absolute -bottom-4 -left-4 right-8 top-8 rounded-[28px] bg-rosewater" />
              <SlotImage slot="story" sizes="(min-width: 768px) 34vw, 90vw" className="relative bg-surface" />
            </div>
          </Reveal>
          <div>
            <Sparkle className="mb-4 h-5 w-5" fill="var(--raspberry)" />
            <SectionHeading title={HOME.storyHeading} className="max-w-[22ch] text-claret" />
            <div className="mt-5 max-w-prose space-y-4 text-lg text-ink/80">
              {HOME.storyBody.map((p) => <p key={p}>{p}</p>)}
            </div>
            <ul className="mt-8 divide-y divide-rosewater border-y border-rosewater">
              {HOME.storyPillars.map((p) => (
                <li key={p.title} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <span className="font-semibold text-raspberry-deep">{p.title}</span>
                  <span className="text-ink/80">{p.body}</span>
                </li>
              ))}
            </ul>
            <Link to={HOME.storyLink.to} className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline hover:text-raspberry">
              {HOME.storyLink.label}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-rosewater pt-10 md:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pt-16">
          <div>
            <SectionHeading title={HOME.whyTitle} className="max-w-[16ch] text-claret" />
            <p className="mt-5 max-w-[40ch] text-lg text-ink/80">{HOME.whyIntro}</p>
          </div>
          <ul className="grid content-start gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-8">
            {HOME.whyItems.map((w, i) => (
              <RuleItem key={w.title} delay={i * 120}>
                <h3 className="font-display text-2xl font-medium text-ink">{w.title}</h3>
                <p className="mt-2 text-ink/80">{w.body}</p>
              </RuleItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
