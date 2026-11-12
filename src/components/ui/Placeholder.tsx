import { IMAGE_SLOTS, UI, type ImageSlotKey } from "../../content/site";
import { aspectRatioLabel, orientationLabel } from "../../lib/media";

type Props = {
  slot: ImageSlotKey;
  /** Overrides the slot label, for example a category name. */
  label?: string;
  className?: string;
  /** Small tile: one caption line, no art direction. */
  compact?: boolean;
  /** Extra text on the badge, for example "Sample". */
  badge?: string;
  /** Tiny tile (cart, summary): cross only, no text. */
  thumb?: boolean;
  /** Fill the parent (full-bleed hero): no aspect ratio, square corners, caption bottom right. */
  fill?: boolean;
  square?: boolean;
};

/**
 * Registered image placeholder (CLAUDE.md section 2.1). States canvas size, aspect ratio and image type so
 * the correct asset can be supplied. Flat, hairline, unmistakably a placeholder; no image is generated.
 */
export function Placeholder({ slot, label, className = "", compact = false, badge, thumb = false, fill = false, square = false }: Props) {
  const s = IMAGE_SLOTS[slot];
  const ratio = aspectRatioLabel(s.width, s.height);
  const orientation = orientationLabel(s.width, s.height);
  const name = label ?? s.label;
  const aria = `${UI.placeholderTag} ${s.ph}: ${name}. ${s.width} by ${s.height} pixels, aspect ratio ${ratio}, ${s.format}.`;
  if (thumb) {
    return (
      <div role="img" aria-label={aria} style={{ aspectRatio: `${s.width} / ${s.height}` }} className={`relative w-full overflow-hidden rounded-xl bg-petal ${className}`}>
        <svg aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full text-raspberry/20" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    );
  }
  const tag = [s.ph, compact ? null : UI.placeholderTag, badge].filter(Boolean).join(" · ");
  return (
    <div
      role="img"
      aria-label={aria}
      style={fill ? undefined : { aspectRatio: `${s.width} / ${s.height}` }}
      className={`relative flex w-full flex-col justify-between overflow-hidden ${fill || square ? "rounded-none" : "rounded-[20px]"} ${fill ? "h-full items-end text-right" : "text-left"} ${className.includes("bg-white") ? "" : "bg-petal"} p-3 sm:p-4 ${className}`}
    >
      <svg aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full text-raspberry/20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={`relative w-fit whitespace-nowrap rounded-full bg-raspberry px-2.5 py-1 text-xs font-semibold text-white`}>{tag}</span>
      <div className="relative min-w-0">
        <p className={`inline pr-2 ${className.includes("bg-white") ? "bg-white" : "bg-petal"} text-sm font-semibold leading-tight text-ink sm:text-base`}>{name}</p>
        <p className="mt-1 break-words text-xs leading-snug text-mute sm:text-sm">
          <span className="font-semibold text-ink">{s.width} × {s.height} px</span> · {ratio} {compact ? "" : orientation + " · "}{s.format}
        </p>
        {!compact && <p className="mt-2 hidden max-w-[40ch] text-xs leading-snug text-mute md:block">{s.direction}</p>}
      </div>
    </div>
  );
}
