/** Thin gold arc. Decorative only. */
export function ArcMotif({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 100" className={className} fill="none">
      <path d="M8 96 A92 92 0 0 1 192 96" stroke="#ECB86C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 96 A68 68 0 0 1 168 96" stroke="#ECB86C" strokeWidth="1" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
