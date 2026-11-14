import { NOT_FOUND, SEO } from "../content/site";
import { Seo } from "../lib/seo";
import { Button } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Sprig } from "../components/ui/Sprig";
import { SparkleField } from "../components/ui/SparkleField";

export default function NotFound() {
  return (
    <>
      <Seo path="/404" title={SEO.notFoundTitle} description={NOT_FOUND.body} noindex />
      <section className="relative overflow-hidden bg-petal">
        <Sprig className="pointer-events-none absolute -bottom-4 right-6 hidden h-[110%] w-auto text-raspberry/60 sm:block lg:right-32" />
        <SparkleField spots={[{ x: "70%", y: "20%", size: 14, delay: 0.3 }, { x: "86%", y: "50%", size: 10, delay: 1.5, fill: "var(--raspberry)" }, { x: "62%", y: "76%", size: 10, delay: 2.4 }]} />
        <div className="relative mx-auto max-w-page px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <SectionHeading as="h1" title={NOT_FOUND.title} />
          <p className="mt-5 max-w-prose text-lg text-ink/80">{NOT_FOUND.body}</p>
          <div className="mt-8"><Button to="/">{NOT_FOUND.home}</Button></div>
        </div>
      </section>
    </>
  );
}
