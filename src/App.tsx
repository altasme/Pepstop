/**
 * Route table (CLAUDE.md §4, v1.2 adds the storefront). Still reserved and absent:
 * /catalog/coa, /admin, /admin/*, /api/*. Products are served at /shop (v1.2 supersedes the unlisted /catalog).
 */
import type { RouteRecord } from "vite-react-ssg";
import Layout from "./Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { requireCustomer } from "./components/ui/RequireCustomer";
import RouteError from "./pages/RouteError";

/**
 * Code splitting: every page except Home loads on demand, so a visitor downloads only what they open.
 * Private pages (login required) are wrapped so visitors without an approved account are sent to /account.
 */
const page = (load: () => Promise<{ default: React.ComponentType }>) => ({ lazy: async () => ({ Component: (await load()).default }) });
const privatePage = (load: () => Promise<{ default: React.ComponentType }>) => ({ lazy: async () => ({ Component: requireCustomer((await load()).default) }) });

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: RouteError,
    entry: "src/Layout.tsx",
    children: [
      { index: true, Component: Home },
      { path: "about", ...page(() => import("./pages/About")) },
      { path: "health-beauty", ...page(() => import("./pages/HealthBeauty")) },
      { path: "education", ...page(() => import("./pages/Education")) },
      {
        path: "education/:slug",
        ...page(() => import("./pages/Article")),
        getStaticPaths: () => ["education/_"], // shell; the Worker serves it for any article slug
      },
      { path: "shop", ...privatePage(() => import("./pages/Shop")) },
      { path: "account", ...page(() => import("./pages/Account")) },
      { path: "shop/:slug", ...privatePage(() => import("./pages/Product")), getStaticPaths: () => ["shop/_"] }, // shell; products come from the database
      { path: "coa", ...privatePage(() => import("./pages/Coa")) },
      { path: "cart", ...privatePage(() => import("./pages/Cart")) },
      { path: "checkout", ...privatePage(() => import("./pages/Checkout")) },
      { path: "checkout/confirmation", ...page(() => import("./pages/OrderConfirmation")) },
      { path: "checkout/thank-you", ...page(() => import("./pages/ThankYou")) },
      { path: "contact", ...page(() => import("./pages/Contact")) },
      { path: "privacy", ...page(() => import("./pages/Privacy")) },
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
