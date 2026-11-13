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
import CoaDirectory from "./pages/Coa";
import Account from "./pages/Account";
import { requireCustomer } from "./components/ui/RequireCustomer";

// Private pages: visitors without an approved account are sent to /account.
const PrivateShop = requireCustomer(Shop);
const PrivateProduct = requireCustomer(Product);
const PrivateCart = requireCustomer(Cart);
const PrivateCheckout = requireCustomer(Checkout);
const PrivateCoa = requireCustomer(CoaDirectory);
import NotFound from "./pages/NotFound";

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
        getStaticPaths: () => ["education/_"], // shell; the Worker serves it for any article slug
      },
      { path: "shop", Component: PrivateShop },
      { path: "account", Component: Account },
      { path: "shop/:slug", Component: PrivateProduct, getStaticPaths: () => ["shop/_"] }, // shell; products come from the database
      { path: "coa", Component: PrivateCoa },
      { path: "cart", Component: PrivateCart },
      { path: "checkout", Component: PrivateCheckout },
      { path: "checkout/confirmation", Component: OrderConfirmation },
      { path: "contact", Component: Contact },
      { path: "privacy", Component: Privacy },
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
