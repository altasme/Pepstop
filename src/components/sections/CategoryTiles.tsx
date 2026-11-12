import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CHAT_HELPER, HOME } from "../../content/site";
import { getFocusAreas } from "../../content/getContent";
import { getChannelsWithMessage, hasChatChannel } from "../../lib/cta";
import { SectionHeading } from "../ui/SectionHeading";
import { SlotImage } from "../ui/SlotImage";
import { CtaButton } from "../ui/CtaButton";
import { Sparkle } from "../ui/Sparkle";
import { Reveal } from "../ui/Reveal";
import { SparkleField } from "../ui/SparkleField";

/** Goal-led shopping: five collections, then Pep Match, the hand-off to a person. */
export function CategoryTiles() {
  const areas = getFocusAreas();
  const channels = getChannelsWithMessage(HOME.matchMessage);
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading title={HOME.categoriesTitle} />
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

        <div id="match" className="relative mt-14 scroll-mt-40 grid gap-8 overflow-hidden rounded-[28px] bg-petal p-6 sm:p-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
          <SparkleField className="hidden md:block" spots={[{ x: "52%", y: "16%", size: 14, delay: 0.2 }, { x: "58%", y: "78%", size: 10, delay: 1.6, fill: "#C30239" }, { x: "96%", y: "10%", size: 9, delay: 2.6 }]} />
          <div className="relative">
            <p className="flex items-center gap-2 text-sm font-semibold text-raspberry"><Sparkle className="h-4 w-4" fill="#C30239" />{HOME.matchName}</p>
            <h3 className="mt-3 max-w-[20ch] font-display text-h2 font-medium text-raspberry-deep">{HOME.matchTitle}</h3>
            <p className="mt-4 max-w-prose text-ink/80">{HOME.matchBody}</p>
          </div>
          <div className="relative">
            <p className="mb-3 text-sm text-mute">{hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
            <div className="flex flex-col gap-3">
              {channels.map((c, i) => (
                <CtaButton key={c.kind} channel={c} label={i === 0 && c.kind === "call" ? HOME.matchCta : c.label} variant={i === 0 ? "primary" : "secondary"} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
