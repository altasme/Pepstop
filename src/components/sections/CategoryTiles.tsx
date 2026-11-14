import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { getChannelsWithMessage } from "../../lib/cta";
import { SectionHeading } from "../ui/SectionHeading";
import { SlotImage } from "../ui/SlotImage";
import { CtaButton } from "../ui/CtaButton";
import { Sparkle } from "../ui/Sparkle";
import { Reveal } from "../ui/Reveal";

/** Goal-led shopping: five collections, then Pep Match, the hand-off to a person. */
export function CategoryTiles() {
  const areas = getFocusAreas();
  const primary = getChannelsWithMessage(HOME.matchMessage)[0];
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading title={HOME.categoriesTitle} />
        <p className="mt-4 max-w-prose text-lg text-ink/80">{HOME.categoriesBody}</p>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
          {areas.map((a) => (
            <li key={a.id}>
              <Reveal>
                <Link to={`/shop?cat=${a.id}`} className="group block">
                  <div className="overflow-hidden rounded-[20px]">
                    <SlotImage slot="focus" src={a.image} alt="" sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw" compact className="transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-3 font-display text-xl font-medium leading-tight text-ink sm:text-2xl">{a.title}</p>
                  <p className="mt-1 text-sm text-mute">{a.tagline}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-raspberry">
                    {HOME.categoryLink}<ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div id="match" className="relative mt-10 scroll-mt-40 md:mt-14 grid gap-8 overflow-hidden rounded-[28px] bg-petal p-6 sm:p-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
                    <div className="relative">
            <Sparkle className="mb-4 h-5 w-5" fill="var(--raspberry)" />
            <h3 className="max-w-[24ch] font-display text-h2 font-medium text-raspberry-deep">{HOME.matchTitle}</h3>
            <div className="mt-4 max-w-prose space-y-3 text-ink/80">{HOME.matchBody.map((p) => <p key={p}>{p}</p>)}</div>
          </div>
          <div className="relative">
            {primary && <CtaButton channel={primary} label={HOME.matchCta} variant="primary" className="w-full" />}
          </div>
        </div>
      </div>
    </section>
  );
}
