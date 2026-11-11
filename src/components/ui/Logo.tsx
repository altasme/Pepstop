import { Link } from "react-router-dom";
import { IMAGE_SLOTS, ORG } from "../../content/site";
import { cloudinaryUrl } from "../../lib/media";

/** Supplied logo when ★G2 closes, otherwise the PH-03 wordmark. */
export function Logo({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const url = ORG.logo ? cloudinaryUrl(ORG.logo, IMAGE_SLOTS.logo.width) : null;
  return (
    <Link to="/" aria-label={`${ORG.name}, ${ORG.descriptor}. Home`} className="inline-flex flex-col leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
      {url ? (
        <img src={url} alt="" width={IMAGE_SLOTS.logo.width} height={IMAGE_SLOTS.logo.height} className={compact ? "h-9 w-auto" : "h-11 w-auto"} />
      ) : (
        <>
          <span className={`font-heading font-semibold tracking-tight transition-all ${compact ? "text-2xl" : "text-3xl"} ${onDark ? "text-white" : "text-magenta-deep"}`}>{ORG.name}</span>
          <span className={`mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${onDark ? "text-gold" : "text-gold-ink"}`}>{ORG.descriptor}</span>
        </>
      )}
    </Link>
  );
}
