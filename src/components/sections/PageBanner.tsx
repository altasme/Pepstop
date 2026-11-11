import { ArcMotif } from "../ui/ArcMotif";
import { SectionHeading } from "../ui/SectionHeading";

export function PageBanner({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush to-ivory">
      <ArcMotif className="pointer-events-none absolute -right-10 bottom-0 w-80 opacity-60" />
      <div className="relative mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} />
        {body && <p className="mt-5 max-w-prose text-lg text-charcoal">{body}</p>}
      </div>
    </section>
  );
}
