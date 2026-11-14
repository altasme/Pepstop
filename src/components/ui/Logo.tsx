import { Link } from "react-router-dom";
import { LOGO_ASSET, ORG } from "../../content/site";
import { cloudinaryUrl } from "../../lib/media";

/** Supplied badge plus live wordmark. The lettering inside the badge is unreadable at header size, so the name stays as text. */
export function Logo({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  // Badge sizes: 56 then 80 px at full size, 44 then 60 px once the header has scrolled. The lettering inside the badge needs about 70 px to be readable.
  const url = ORG.logo ? cloudinaryUrl(ORG.logo, 320) : null;
  const local = ORG.logo?.startsWith("/");
  return (
    <Link
      to="/"
      aria-label={`${ORG.name}, ${ORG.descriptor}. Home`}
      className="inline-flex items-center gap-3 leading-none sm:gap-4"
    >
      {url && (
        <span className={`shrink-0 rounded-full ${onDark ? "bg-surface p-0.5" : ""}`}>
          <img
            src={url}
            srcSet={local ? LOGO_ASSET.srcSet : undefined}
            sizes="80px"
            alt=""
            width={LOGO_ASSET.width}
            height={LOGO_ASSET.height}
            className={`block w-auto transition-all duration-200 ease-out ${compact ? "h-11 sm:h-[3.75rem]" : "h-14 sm:h-20"}`}
          />
        </span>
      )}
      <span className="flex flex-col whitespace-nowrap">
        <span className={`font-display font-semibold leading-[1.05] tracking-[0.005em] ${compact ? "text-xl sm:text-2xl" : "text-xl sm:text-[1.75rem]"} ${onDark ? "text-white" : "text-raspberry-deep"}`}>{ORG.name}</span>
        <span className={`mt-1 text-sm font-medium leading-none tracking-[0.02em] sm:mt-1.5 ${onDark ? "text-white/75" : "text-mute"}`}>{ORG.descriptor}</span>
      </span>
    </Link>
  );
}
