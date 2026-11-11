import { IMAGE_SLOTS, UI, type ImageSlotKey } from "../../content/site";
import { aspectRatioLabel, orientationLabel } from "../../lib/media";

type Props = {
  slot: ImageSlotKey;
  /** Overrides the slot label, for example a product name. */
  label?: string;
  className?: string;
  /** Hides the art direction line on small tiles. */
  compact?: boolean;
};

/**
 * Registered image placeholder (CLAUDE.md section 2.1). States canvas size, aspect ratio and image type so
 * the correct asset can be supplied. Flat, hairline, unmistakably a placeholder; no image is generated.
 */
export function Placeholder({ slot, label, className = "", compact = false }: Props) {
  const s = IMAGE_SLOTS[slot];
  const ratio = aspectRatioLabel(s.width, s.height);
  const orientation = orientationLabel(s.width, s.height);
  const name = label ?? s.label;
  const aria = `${UI.placeholderTag} ${s.ph}: ${name}. ${s.width} by ${s.height} pixels, aspect ratio ${ratio}, ${s.format}.`;
  return (
    <div
      role="img"
      aria-label={aria}
      style={{ aspectRatio: `${s.width} / ${s.height}` }}
      className={`relative flex w-full flex-col justify-end overflow-hidden rounded-xl bg-petal p-3 text-left sm:p-4 ${className}`}
    >
      <svg aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full text-raspberry/20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-3 top-3 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white sm:left-4 sm:top-4">{compact ? s.ph : `${s.ph} · ${UI.placeholderTag}`}</span>
      <div className="relative rounded-lg bg-white p-2.5 sm:p-3">
        <p className="text-sm font-semibold leading-tight text-ink sm:text-base">{name}</p>
        <dl className="mt-1 text-xs leading-snug text-mute sm:text-sm">
          <div className="flex flex-wrap gap-x-2"><dt className="sr-only">Canvas size</dt><dd className="font-semibold text-ink">{s.width} × {s.height} px</dd><dt className="sr-only">Aspect ratio</dt><dd>{ratio} {orientation}</dd></div>
          <div><dt className="sr-only">Image type</dt><dd>{s.format}</dd></div>
        </dl>
        {!compact && <p className="mt-2 hidden text-xs leading-snug text-mute md:block">{s.direction}</p>}
      </div>
    </div>
  );
}
