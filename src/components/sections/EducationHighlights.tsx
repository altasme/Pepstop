import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EDUCATION, HOME } from "../../content/site";
import { getPublishedArticles } from "../../content/getContent";
import { SectionHeading } from "../ui/SectionHeading";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

/** Up to three published articles. Renders nothing when none are published. */
export function EducationHighlights() {
  const articles = getPublishedArticles().slice(0, 3);
  if (articles.length === 0) return null;
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading eyebrow={HOME.educationEyebrow} title={HOME.educationTitle} />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Reveal className="h-full">
                <Card className="flex h-full flex-col">
                  <h3 className="font-heading text-h3 font-semibold text-magenta-deep">{a.title}</h3>
                  <p className="mt-2 flex-1 text-charcoal">{a.summary}</p>
                  <Link to={`/education/${a.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-magenta hover:text-magenta-deep">
                    {EDUCATION.readMore}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Button to="/education" variant="secondary">{HOME.educationAll}</Button></div>
      </div>
    </section>
  );
}
