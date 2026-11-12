import type { CSSProperties } from "react";
import { Sparkle } from "./Sparkle";

type Spot = { x: string; y: string; size: number; delay: number; fill?: string };

/** A few twinkling sparkles from the logo, placed in otherwise empty space. Decorative. */
export function SparkleField({ spots, className = "" }: { spots: Spot[]; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {spots.map((s, i) => (
        <span key={i} className="twinkle absolute" style={{ left: s.x, top: s.y, width: s.size, height: s.size, "--d": `${s.delay}s` } as CSSProperties}>
          <Sparkle className="h-full w-full" fill={s.fill} />
        </span>
      ))}
    </div>
  );
}
