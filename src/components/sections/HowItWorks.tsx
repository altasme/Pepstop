import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { RuleItem } from "../ui/RuleItem";
import { Sparkle } from "../ui/Sparkle";

/** The sequence carries information, so the steps are numbered; the rule draws from step to step. */
export function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={HOME.howTitle} />
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {HOME.howSteps.map((s, i) => (
            <RuleItem key={s.title} delay={i * 220}>
              <span className="flex items-center gap-3">
                <span className="font-display text-5xl font-medium leading-none text-raspberry">{i + 1}</span>
                {i < HOME.howSteps.length - 1 && <Sparkle className="twinkle hidden h-3 w-3 md:block" />}
              </span>
              <h3 className="mt-3 text-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[36ch] text-ink/80">{s.body}</p>
            </RuleItem>
          ))}
        </ol>
      </div>
    </section>
  );
}
