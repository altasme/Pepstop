import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";

/** The sequence carries information, so the steps are numbered. */
export function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={HOME.howTitle} />
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {HOME.howSteps.map((s, i) => (
            <li key={s.title} className="border-t border-ink pt-5">
              <span className="text-sm font-semibold text-raspberry">{i + 1}</span>
              <h3 className="mt-2 text-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[36ch] text-ink/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
