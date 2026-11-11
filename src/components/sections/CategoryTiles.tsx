import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { SlotImage } from "../ui/SlotImage";
import { Reveal } from "../ui/Reveal";

export function CategoryTiles() {
  const areas = getFocusAreas();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading title={HOME.categoriesTitle} />
        <ul className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {areas.map((a) => (
            <li key={a.id}>
              <Reveal>
                <Link to={`/shop?cat=${a.id}`} className="group block">
                  <div className="overflow-hidden">
                    <SlotImage slot="focus" src={a.image} alt="" sizes="(min-width: 768px) 30vw, 90vw" compact className="transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-4 text-xl font-semibold text-ink">
                    {a.title}
                    <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-raspberry">
                      {HOME.categoryLink}<ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
