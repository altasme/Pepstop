import { Compass, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { HOME, VALUES } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const icons: Record<string, typeof Compass> = {
  "informed-choices": Compass,
  "honest-information": ShieldCheck,
  "attentive-service": HeartHandshake,
  "responsible-self-care": Leaf,
};

export function Values() {
  return (
    <section className="on-dark bg-magenta-deep text-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading eyebrow={HOME.valuesEyebrow} title={HOME.valuesTitle} onDark />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => {
            const Icon = icons[v.id] ?? Compass;
            return (
              <li key={v.id}>
                <Reveal className="h-full">
                  <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-6">
                    <Icon className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-4 font-heading text-2xl font-semibold">{v.title}</h3>
                    <p className="mt-2 text-white/90">{v.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
