/**
 * Route table (CLAUDE.md §4). Phase 2 routes are reserved and intentionally absent:
 * /catalog, /catalog/:productSlug, /catalog/coa, /admin, /admin/*, /api/*.
 */
import type { RouteRecord } from "vite-react-ssg";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import HealthBeauty from "./pages/HealthBeauty";
import Education from "./pages/Education";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { getPublishedArticles } from "./content/getContent";

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    entry: "src/Layout.tsx",
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "health-beauty", Component: HealthBeauty },
      { path: "education", Component: Education },
      {
        path: "education/:slug",
        Component: Article,
        getStaticPaths: () => getPublishedArticles().map((a) => `education/${a.slug}`),
      },
      { path: "contact", Component: Contact },
      { path: "privacy", Component: Privacy },
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
