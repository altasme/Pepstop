import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";

/** Service reasons set as a two-column list on hairlines: no icons, no cards. */
export function WhyUs() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24 lg:px-8">
        <div>
          <SectionHeading title={HOME.whyTitle} className="max-w-[16ch] text-claret" />
          <p className="mt-5 max-w-[40ch] text-lg text-ink/80">{HOME.whyIntro}</p>
        </div>
        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {HOME.whyItems.map((w) => (
            <li key={w.title} className="border-t border-raspberry/40 pt-5">
              <h3 className="font-display text-2xl font-medium text-ink">{w.title}</h3>
              <p className="mt-2 text-ink/80">{w.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
