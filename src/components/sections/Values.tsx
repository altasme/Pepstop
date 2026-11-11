import { ABOUT, VALUES } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";

/** Four plain statements on a hairline. No icons, no cards. */
export function Values() {
  return (
    <section className="on-dark bg-ink text-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={ABOUT.valuesTitle} onDark />
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <li key={v.id} className="border-t border-white/30 pt-5">
              <h3 className="text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-white/80">{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
