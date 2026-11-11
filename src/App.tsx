/**
 * Route table (CLAUDE.md §4, v1.2 adds the storefront). Still reserved and absent:
 * /catalog/coa, /admin, /admin/*, /api/*. Products are served at /shop (v1.2 supersedes the unlisted /catalog).
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
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import { getProducts, getPublishedArticles } from "./content/getContent";

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
      { path: "shop", Component: Shop },
      { path: "shop/:slug", Component: Product, getStaticPaths: () => getProducts().map((p) => `shop/${p.slug}`) },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "checkout/confirmation", Component: OrderConfirmation },
      { path: "contact", Component: Contact },
      { path: "privacy", Component: Privacy },
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
