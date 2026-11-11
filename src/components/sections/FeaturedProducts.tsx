import { HOME } from "../../content/site";
import { getFeaturedProducts } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { ProductCard } from "../ui/ProductCard";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

/** Renders nothing if the store has no products. */
export function FeaturedProducts() {
  const products = getFeaturedProducts(3);
  if (products.length === 0) return null;
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading eyebrow={HOME.featuredEyebrow} title={HOME.featuredTitle} />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}><Reveal className="h-full"><ProductCard product={p} /></Reveal></li>
          ))}
        </ul>
        <div className="mt-8"><Button to="/shop" variant="secondary">{HOME.featuredAll}</Button></div>
      </div>
    </section>
  );
}
