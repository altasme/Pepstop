import { Link } from "react-router-dom";
import { LOGO_ASSET, ORG } from "../../content/site";
import { cloudinaryUrl } from "../../lib/media";

/** Supplied badge plus live wordmark. The lettering inside the badge is unreadable at header size, so the name stays as text. */
export function Logo({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const url = ORG.logo ? cloudinaryUrl(ORG.logo, 320) : null;
  const local = ORG.logo?.startsWith("/");
  return (
    <Link
      to="/"
      aria-label={`${ORG.name}, ${ORG.descriptor}. Home`}
      className="inline-flex items-center gap-3 leading-none"
    >
      {url && (
        <span className={`shrink-0 rounded-full ${onDark ? "bg-white p-0.5" : ""}`}>
          <img
            src={url}
            srcSet={local ? LOGO_ASSET.srcSet : undefined}
            sizes="64px"
            alt=""
            width={LOGO_ASSET.width}
            height={LOGO_ASSET.height}
            className={`block w-auto transition-all duration-200 ease-out ${compact ? "h-10" : "h-12"}`}
          />
        </span>
      )}
      <span className="flex flex-col gap-1.5">
        <span className={`font-display text-xl font-semibold leading-none tracking-[0.01em] sm:text-2xl ${onDark ? "text-white" : "text-raspberry-deep"}`}>{ORG.name}</span>
        <span className={`text-xs font-medium leading-none tracking-[0.04em] ${onDark ? "text-white/75" : "text-mute"}`}>{ORG.descriptor}</span>
      </span>
    </Link>
  );
}
