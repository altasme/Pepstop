import { NOT_FOUND, SEO } from "../content/site";
import { Seo } from "../lib/seo";
import { Button } from "../components/ui/Button";
import { SectionHeading } from "../components/ui/SectionHeading";

export default function NotFound() {
  return (
    <>
      <Seo path="/404" title={SEO.notFoundTitle} description={NOT_FOUND.body} noindex />
      <section className="bg-petal">
        <div className="mx-auto max-w-page px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <SectionHeading as="h1" title={NOT_FOUND.title} />
          <p className="mt-5 max-w-prose text-lg text-ink/80">{NOT_FOUND.body}</p>
          <div className="mt-8"><Button to="/">{NOT_FOUND.home}</Button></div>
        </div>
      </section>
    </>
  );
}
