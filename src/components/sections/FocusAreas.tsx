import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { SlotImage } from "../ui/SlotImage";
import { Reveal } from "../ui/Reveal";

export function FocusAreas() {
  const areas = getFocusAreas();
  return (
    <section className="bg-blush">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading eyebrow={HOME.focusEyebrow} title={HOME.focusTitle} />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {areas.map((a) => (
            <li key={a.id}>
              <Reveal className="h-full">
                <Link to={`/health-beauty#${a.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-magenta-deep/5 transition-transform duration-200 hover:-translate-y-1">
                  <SlotImage slot="focus" src={a.image} label={a.title} alt="" sizes="(min-width: 768px) 30vw, 90vw" compact />
                  <div className="flex flex-1 flex-col p-3 pt-5">
                    <h3 className="font-heading text-h3 font-semibold text-magenta-deep">{a.title}</h3>
                    <p className="mt-2 flex-1 text-charcoal">{a.summary}</p>
                    <span className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-magenta group-hover:text-magenta-deep">
                      {HOME.focusLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
