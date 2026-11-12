import type { CSSProperties } from "react";
import { Sparkle } from "./Sparkle";

type Spot = { x: string; y: string; size: number; delay: number; fill?: string };

/**
 * A few twinkling sparkles from the logo, placed in otherwise empty space. Decorative.
 * `bloom` makes each one pop in (scale and turn) once, before it settles into its twinkle.
 */
export function SparkleField({ spots, className = "", bloom = false }: { spots: Spot[]; className?: string; bloom?: boolean }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {spots.map((s, i) => (
        <span
          key={i}
          className={`absolute ${bloom ? "bloom" : ""}`}
          style={{ left: s.x, top: s.y, width: s.size, height: s.size, "--b": `${s.delay * 0.5 + 0.9}s` } as CSSProperties}
        >
          <span className="twinkle block h-full w-full" style={{ "--d": `${s.delay + (bloom ? 1.6 : 0)}s` } as CSSProperties}>
            <Sparkle className="h-full w-full" fill={s.fill} />
          </span>
        </span>
      ))}
    </div>
  );
}
