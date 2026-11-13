import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EDUCATION, SEO, UI } from "../content/site";
import { getArticle } from "../content/getContent";
import { Seo } from "../lib/seo";
import { useRemote } from "../lib/remote";
import { trackArticleView } from "../lib/analytics";
import { formatDate } from "../lib/format";
import { Disclaimer } from "../components/ui/Disclaimer";
import NotFound from "./NotFound";

export default function Article() {
  const { slug = "" } = useParams();
  const remote = useRemote();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) trackArticleView(article.slug);
  }, [article]);

  if (remote.status === "loading") return <section aria-busy="true" className="mx-auto max-w-page px-4 py-24 text-center text-mute">{UI.loading}</section>;
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
        <Link to="/education" className="inline-flex min-h-11 items-center gap-2 font-semibold text-raspberry hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />{EDUCATION.back}
        </Link>
        {!article.published && <p className="mt-4 inline-block rounded-full bg-raspberry px-3 py-1 text-xs font-semibold text-white">{UI.draftBadge}</p>}
        <h1 className="mt-4 font-sans text-h1 font-semibold text-ink">{article.title}</h1>
        <p className="mt-4 text-lg text-ink">{article.summary}</p>
        <p className="mt-3 text-sm text-ink/80">{EDUCATION.updated} {formatDate(article.updatedAt)}</p>
        {article.html ? (
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink [&_a]:text-raspberry [&_a]:underline [&_h2]:pt-4 [&_h2]:font-semibold [&_h3]:pt-3 [&_h3]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_p]:mt-3 [&_ul]:list-disc" dangerouslySetInnerHTML={{ __html: article.html }} />
        ) : (
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink">
          {blocks.map((b) =>
            b.startsWith("## ") ? (
              <h2 key={b} className="pt-4 font-sans text-h3 font-semibold text-ink">{b.slice(3)}</h2>
            ) : (
              <p key={b}>{b}</p>
            ),
          )}
        </div>
        )}
        <Disclaimer text={UI.articleDisclaimer} className="mt-10 border-t border-ink/10 pt-6" />
      </article>
    </>
  );
}
