import { IMAGE_SLOTS, UI, type ImageSlotKey } from "../../content/site";
import { aspectRatioLabel, orientationLabel } from "../../lib/media";
import { ArcMotif } from "./ArcMotif";

type Props = {
  slot: ImageSlotKey;
  /** Overrides the slot label, for example the focus area title. */
  label?: string;
  className?: string;
  /** Hides the art direction line on small tiles. */
  compact?: boolean;
};

/**
 * Registered image placeholder (CLAUDE.md §2.1). States canvas size, aspect ratio and image type so
 * the correct asset can be supplied. Looks like a placeholder on purpose; no image is generated.
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
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-rose-ink/50 bg-gradient-to-br from-blush via-ivory to-blush p-4 text-center ${className}`}
    >
      <ArcMotif className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto w-3/4 max-w-xs opacity-80" />
      <span className="relative mb-2 rounded-full bg-magenta-deep px-2.5 py-0.5 text-xs font-semibold tracking-wide text-white">
        {s.ph} · {UI.placeholderTag}
      </span>
      <span className="relative font-heading text-xl font-semibold leading-tight text-magenta-deep sm:text-2xl">{name}</span>
      <dl className="relative mt-2 space-y-0.5 text-sm text-charcoal">
        <div><dt className="sr-only">Canvas size</dt><dd className="font-semibold">{s.width} × {s.height} px</dd></div>
        <div><dt className="sr-only">Aspect ratio</dt><dd>{ratio} {orientation}</dd></div>
        <div><dt className="sr-only">Image type</dt><dd>{s.format}</dd></div>
      </dl>
      {!compact && <p className="relative mt-3 hidden max-w-xs text-xs leading-snug text-charcoal/80 md:block">{s.direction}</p>}
    </div>
  );
}
