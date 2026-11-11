import { Link } from "react-router-dom";
import { LOGO_ASSET, ORG } from "../../content/site";
import { cloudinaryUrl } from "../../lib/media";

/** Supplied badge plus live wordmark text. The badge alone is too small to read at header size, so the name stays as text. */
export function Logo({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const url = ORG.logo ? cloudinaryUrl(ORG.logo, 320) : null;
  const local = ORG.logo?.startsWith("/");
  return (
    <Link
      to="/"
      aria-label={`${ORG.name}, ${ORG.descriptor}. Home`}
      className="inline-flex items-center gap-3 leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {url && (
        <span className={`shrink-0 rounded-full ${onDark ? "bg-ivory p-0.5" : ""}`}>
          <img
            src={url}
            srcSet={local ? LOGO_ASSET.srcSet : undefined}
            sizes="64px"
            alt=""
            width={LOGO_ASSET.width}
            height={LOGO_ASSET.height}
            className={`block w-auto transition-all ${compact ? "h-11" : "h-14"}`}
          />
        </span>
      )}
      <span className="flex flex-col">
        <span className={`font-heading font-semibold tracking-tight transition-all ${compact ? "text-xl" : "text-2xl sm:text-3xl"} ${onDark ? "text-white" : "text-magenta-deep"}`}>{ORG.name}</span>
        <span className={`mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] sm:text-[0.7rem] ${onDark ? "text-gold" : "text-gold-ink"}`}>{ORG.descriptor}</span>
      </span>
    </Link>
  );
}
