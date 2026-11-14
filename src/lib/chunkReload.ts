/**
 * A tab that was open before a deploy still points at the old, content-hashed page files, which no longer exist.
 * When one of them fails to load, the route error page (or the preload error handler) reloads once at the address the visitor asked for, so the tab picks up the new files. A second failure within
 * ten seconds is a real problem and is shown instead of looping.
 */
const KEY = "pepstop:chunk-reload";

export function reloadOnce(url?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < 10000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false;
  }
  if (url && url !== window.location.href) window.location.assign(url);
  else window.location.reload();
  return true;
}

export const isChunkError = (e: unknown) =>
  e instanceof Error && /dynamically imported module|Importing a module script failed|error loading dynamically imported/i.test(e.message);

let pending: string | null = null;
/** Remembers the last link the visitor followed, so a reload after a failed page load lands where they were going. */
export function trackNavigation() {
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    pending = a && a.origin === window.location.origin && a.target !== "_blank" ? a.href : null;
  }, true);
}
export const pendingUrl = () => pending ?? undefined;
