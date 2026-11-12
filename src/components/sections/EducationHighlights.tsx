import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EDUCATION, HOME } from "../../content/site";
import { getPublishedArticles } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { RuleItem } from "../ui/RuleItem";

/** Up to three published articles. Renders nothing when none are published. */
export function EducationHighlights() {
  const articles = getPublishedArticles().slice(0, 3);
  if (articles.length === 0) return null;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={HOME.educationTitle} />
          <Link to="/education" className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline hover:text-raspberry">
            {HOME.educationAll}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {articles.map((a, i) => (
            <RuleItem key={a.slug} delay={i * 120}>
              <h3 className="font-display text-2xl font-medium text-ink">{a.title}</h3>
              <p className="mt-2 text-ink/80">{a.summary}</p>
              <Link to={`/education/${a.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-raspberry underline">{EDUCATION.readMore}</Link>
            </RuleItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
