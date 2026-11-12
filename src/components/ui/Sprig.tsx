import type { CSSProperties } from "react";
import { useReveal } from "../../lib/useReveal";

/** Leaves along the stem: [x, y, angle, scale]. Right leaves point up-right, left leaves up-left. */
const LEAVES: [number, number, number, number][] = [
  [118, 270, -38, 1.1], [119, 264, 218, 1.05],
  [121, 222, -36, 1.0], [121, 216, 216, 0.98],
  [116, 176, -34, 0.9], [115, 170, 214, 0.9],
  [108, 130, -34, 0.78], [107, 124, 214, 0.78],
  [112, 84, -32, 0.62], [111, 78, 212, 0.62],
  [126, 36, -30, 0.5], [125, 32, 210, 0.5],
];
const LEAF = "M0 0 C 12 -13 38 -13 52 0 C 38 13 12 13 0 0 Z";

/**
 * A line-drawn botanical sprig from the logo's leaf. The stem and leaf outlines draw themselves and the
 * leaves unfurl when it scrolls into view, then it sways slowly. Decorative; colour comes from currentColor.
 */
export function Sprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const [ref, state] = useReveal<SVGSVGElement>("0px 0px -4% 0px");
  return (
    <svg
      ref={ref}
      data-reveal={state}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 320"
      fill="none"
      className={`${className} ${flip ? "-scale-x-100" : ""}`}
    >
      <g className="sway" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw" pathLength="1" d="M120 312 C 117 262 126 214 114 168 C 104 128 110 70 128 8" />
        {LEAVES.map(([x, y, a, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
            <g className="leaf" style={{ "--d": `${0.5 + i * 0.14}s` } as CSSProperties}>
              <path className="draw" pathLength="1" d={LEAF} fill="currentColor" fillOpacity="0.07" />
              <path className="draw" pathLength="1" d="M3 0 L46 0" strokeWidth="0.8" strokeOpacity="0.7" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
