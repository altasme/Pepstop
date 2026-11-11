import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) initAnalytics();
});
