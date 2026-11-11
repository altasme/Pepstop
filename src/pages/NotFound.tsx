import { NOT_FOUND, SEO } from "../content/site";
import { Seo } from "../lib/seo";
import { Button } from "../components/ui/Button";
import { ArcMotif } from "../components/ui/ArcMotif";

export default function NotFound() {
  return (
    <>
      <Seo path="/404" title={SEO.notFoundTitle} description={NOT_FOUND.body} noindex />
      <section className="relative overflow-hidden bg-gradient-to-b from-blush to-ivory">
        <ArcMotif className="pointer-events-none absolute left-1/2 top-6 w-96 -translate-x-1/2 opacity-60" />
        <div className="relative mx-auto max-w-prose px-4 py-24 text-center sm:px-6 md:py-32">
          <h1 className="font-heading text-h1 font-semibold text-magenta-deep">{NOT_FOUND.title}</h1>
          <p className="mt-4 text-lg text-charcoal">{NOT_FOUND.body}</p>
          <div className="mt-8"><Button to="/">{NOT_FOUND.home}</Button></div>
        </div>
      </section>
    </>
  );
}
