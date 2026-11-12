import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HOME } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";

export function Curated() {
  return (
    <section className="relative bg-petal">
      <div className="mx-auto grid max-w-page gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-24 lg:px-8">
        <div>
          <Sparkle className="mb-5 h-6 w-6" fill="#C30239" />
          <SectionHeading title={HOME.curatedTitle} className="max-w-[14ch] text-raspberry-deep" />
        </div>
        <div className="self-end">
          <p className="max-w-prose text-lg text-ink/80">{HOME.curatedBody}</p>
          <Link to={HOME.curatedLink.to} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline hover:text-raspberry">
            {HOME.curatedLink.label}<ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
