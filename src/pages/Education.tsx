import { useRemote } from "../lib/remote";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EDUCATION } from "../content/site";
import { getPublishedArticles } from "../content/getContent";
import { Seo } from "../lib/seo";
import { PageBanner } from "../components/sections/PageBanner";
import { Card } from "../components/ui/Card";
import { Disclaimer } from "../components/ui/Disclaimer";
import { formatDate } from "../lib/format";
import { Sprig } from "../components/ui/Sprig";
import { Button } from "../components/ui/Button";

export default function Education() {
  useRemote();
  const articles = getPublishedArticles();
  return (
    <>
      <Seo path="/education" />
      <PageBanner title={EDUCATION.bannerTitle} body={EDUCATION.bannerBody} />
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {articles.length === 0 ? (
          <div className="relative mx-auto max-w-prose overflow-hidden rounded-[28px] bg-petal p-10 pb-52 text-center">
            <Sprig className="pointer-events-none absolute -bottom-2 left-1/2 h-48 w-auto -translate-x-1/2 text-raspberry/55" />
            <p className="font-sans text-h3 font-semibold text-ink">{EDUCATION.empty}</p>
            <p className="mt-2 text-ink">{EDUCATION.emptyHint}</p>
            <div className="mt-5"><Button to="/contact" variant="secondary">{EDUCATION.emptyCta}</Button></div>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <Card className="flex h-full flex-col">
                  <p className="text-sm text-ink/80">{EDUCATION.updated} {formatDate(a.updatedAt)}</p>
                  <h2 className="mt-2 font-sans text-h3 font-semibold text-ink">{a.title}</h2>
                  <p className="mt-2 flex-1 text-ink">{a.summary}</p>
                  <Link to={`/education/${a.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-raspberry hover:text-ink">
                    {EDUCATION.readMore}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <Disclaimer className="mt-12" />
      </section>
    </>
  );
}
