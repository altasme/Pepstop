import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { RuleItem } from "../ui/RuleItem";

/** The sequence carries information, so the steps are numbered; the rule draws from step to step. */
export function HowItWorks() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={HOME.howTitle} />
        <p className="mt-4 max-w-prose text-lg text-ink/80">{HOME.howIntro}</p>
        <ol className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-10">
          {HOME.howSteps.map((s, i) => (
            <RuleItem key={s.title} delay={i * 220}>
              <div className="flex gap-4 md:block">
                <span className="font-display text-4xl font-medium leading-none text-raspberry md:text-5xl">{i + 1}</span>
                <div>
                  <h3 className="text-h3 font-semibold text-ink md:mt-3">{s.title}</h3>
                  <p className="mt-1.5 max-w-[36ch] text-ink/80 md:mt-2">{s.body}</p>
                </div>
              </div>
            </RuleItem>
          ))}
        </ol>
      </div>
    </section>
  );
}
