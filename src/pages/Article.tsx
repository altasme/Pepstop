import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EDUCATION, SEO, UI } from "../content/site";
import { getArticle } from "../content/getContent";
import { Seo } from "../lib/seo";
import { trackArticleView } from "../lib/analytics";
import { formatDate } from "../lib/format";
import { Disclaimer } from "../components/ui/Disclaimer";
import { ContactBlock } from "../components/sections/ContactBlock";
import NotFound from "./NotFound";

export default function Article() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) trackArticleView(article.slug);
  }, [article]);

  if (!article) return <NotFound />;

  const blocks = article.body.split(/\n\n+/);
  return (
    <>
      <Seo
        path={`/education/${article.slug}`}
        title={`${article.title}${SEO.titleSuffix}`}
        description={article.summary}
        type="article"
        noindex={!article.published}
      />
      <article className="mx-auto max-w-prose px-4 py-12 sm:px-6 md:py-20">
        <Link to="/education" className="inline-flex min-h-11 items-center gap-2 font-semibold text-magenta hover:text-magenta-deep">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />{EDUCATION.back}
        </Link>
        {!article.published && <p className="mt-4 inline-block rounded-full bg-rose-ink px-3 py-1 text-xs font-semibold text-white">{UI.draftBadge}</p>}
        <h1 className="mt-4 font-heading text-h1 font-semibold text-magenta-deep">{article.title}</h1>
        <p className="mt-4 text-lg text-charcoal">{article.summary}</p>
        <p className="mt-3 text-sm text-charcoal/80">{EDUCATION.updated} {formatDate(article.updatedAt)}</p>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-charcoal">
          {blocks.map((b) =>
            b.startsWith("## ") ? (
              <h2 key={b} className="pt-4 font-heading text-h3 font-semibold text-magenta-deep">{b.slice(3)}</h2>
            ) : (
              <p key={b}>{b}</p>
            ),
          )}
        </div>
        <Disclaimer text={UI.articleDisclaimer} className="mt-10 border-t border-magenta-deep/10 pt-6" />
      </article>
      <ContactBlock />
    </>
  );
}
