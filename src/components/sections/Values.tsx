import { ABOUT, VALUES } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { RuleItem } from "../ui/RuleItem";

/** Four plain statements on a hairline. No icons, no cards. */
export function Values() {
  return (
    <section className="bg-petal">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={ABOUT.valuesTitle} />
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <RuleItem key={v.id} delay={i * 120}>
              <h3 className="font-display text-2xl font-medium text-raspberry-deep">{v.title}</h3>
              <p className="mt-2 text-ink/80">{v.body}</p>
            </RuleItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
