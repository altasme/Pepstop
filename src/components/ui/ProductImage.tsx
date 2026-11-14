import { useState } from "react";
import { Sparkle } from "./Sparkle";

/**
 * Customer-facing product photo. Always a fixed square frame, so the layout can never collapse.
 * With no photo, or if the file fails to load, it shows a quiet petal tile instead of a broken-image icon.
 */
export function ProductImage({ src, alt, sizes = "50vw", priority = false, className = "", rounded = true }: { src?: string | null; alt: string; sizes?: string; priority?: boolean; className?: string; rounded?: boolean }) {
  const [failed, setFailed] = useState(false);
  const shape = rounded ? "rounded-[20px]" : "";
  if (!src || failed) {
    return (
      <div role="img" aria-label={`${alt}. Photo coming soon.`} className={`grid aspect-square w-full place-items-center bg-petal ${shape} ${className}`}>
        <Sparkle className="h-7 w-7 opacity-60" fill="var(--raspberry)" />
      </div>
    );
  }
  return (
    <img
      src={src}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`aspect-square w-full bg-petal object-cover ${shape} ${className}`}
    />
  );
}
