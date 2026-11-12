import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { UI } from "./content/site";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartProvider } from "./lib/cart";
import { StickyCtaBar } from "./components/layout/StickyCtaBar";
import { startRemote, useRemote } from "./lib/remote";

export default function Layout() {
  useRemote(); // re-render the shell when the catalog or website text arrives
  useEffect(() => { startRemote(); }, []);
  return (
    <CartProvider>
      <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {UI.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <StickyCtaBar />
      <ScrollRestoration />
    </CartProvider>
  );
}
