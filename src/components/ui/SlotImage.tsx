import { IMAGE_SLOTS, type ImageSlotKey } from "../../content/site";
import { cloudinarySrcSet, cloudinaryUrl } from "../../lib/media";
import { Placeholder } from "./Placeholder";

type Props = {
  slot: ImageSlotKey;
  /** Cloudinary public id. Falls back to the slot default, then to the placeholder. */
  src?: string | null;
  alt?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  compact?: boolean;
};

/** Renders the licensed asset when its Cloudinary id is set, otherwise the registered placeholder. */
export function SlotImage({ slot, src, alt, label, sizes = "100vw", priority = false, className = "", compact }: Props) {
  const s = IMAGE_SLOTS[slot];
  const id = src ?? s.src;
  const url = id ? cloudinaryUrl(id, s.width) : null;
  if (!id || !url) return <Placeholder slot={slot} label={label} className={className} compact={compact} />;
  return (
    <img
      src={url}
      srcSet={cloudinarySrcSet(id, s.width) ?? undefined}
      sizes={sizes}
      width={s.width}
      height={s.height}
      alt={alt ?? s.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`h-auto w-full rounded-xl object-cover ${className}`}
      style={{ aspectRatio: `${s.width} / ${s.height}` }}
    />
  );
}
