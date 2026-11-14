import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { getFeaturedProducts } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { ProductCard } from "../ui/ProductCard";
import { Reveal } from "../ui/Reveal";
import { useRemote } from "../../lib/remote";

/** Renders nothing if the store has no products. */
export function FeaturedProducts() {
  useRemote();
  const products = getFeaturedProducts(4);
  if (products.length === 0) return null;
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-page px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionHeading title={HOME.featuredTitle} />
            <p className="mt-4 max-w-prose text-lg text-ink/80">{HOME.featuredBody}</p>
          </div>
          <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline hover:text-raspberry">
            {HOME.featuredAll}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {products.map((p) => (
            <li key={p.id}><Reveal className="h-full"><ProductCard product={p} /></Reveal></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
