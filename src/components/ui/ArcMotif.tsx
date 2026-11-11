/** Thin gold arc. Decorative only. */
export function ArcMotif({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 100" className={className} fill="none">
      <path d="M8 96 A92 92 0 0 1 192 96" stroke={dark ? "#C9A45C" : "#C9A45C"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 96 A68 68 0 0 1 168 96" stroke={dark ? "#C9A45C" : "#C9A45C"} strokeWidth="1" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
