import { getFocusAreas } from "../../content/getContent";
import { Sparkle } from "../ui/Sparkle";

/** A slow band of the five collection names. Decorative (the same links live in the header and footer). */
export function Marquee() {
  const areas = getFocusAreas();
  return (
    <section aria-hidden="true" className="on-dark overflow-hidden bg-claret py-5 text-white">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((set) => (
          <ul key={set} className={`flex shrink-0 items-center ${set === 1 ? "marquee-dup" : ""}`}>
            {areas.map((a) => (
              <li key={a.id} className="flex items-center whitespace-nowrap font-display text-2xl font-medium md:text-3xl">
                <span className="px-8">{a.title}</span>
                <Sparkle className="h-4 w-4 shrink-0" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
