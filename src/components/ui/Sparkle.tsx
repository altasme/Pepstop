/** Four-point sparkle drawn from the logo's own stars. Decorative only. */
export function Sparkle({ className = "", fill = "#ECB86C" }: { className?: string; fill?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className={className}>
      <path d="M12 0c.7 6.2 5.8 11.3 12 12-6.2.7-11.3 5.8-12 12-.7-6.2-5.8-11.3-12-12C6.2 11.3 11.3 6.2 12 0Z" fill={fill} />
    </svg>
  );
}
