import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";
import { initAnalytics } from "./lib/analytics";
import { pendingUrl, reloadOnce, trackNavigation } from "./lib/chunkReload";
import "./index.css";

export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) {
    initAnalytics();
    trackNavigation();
    // Vite fires this when a hashed file from an older deploy is gone.
    window.addEventListener("vite:preloadError", (e) => { if (reloadOnce(pendingUrl())) e.preventDefault(); });
  }
});
