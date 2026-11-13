import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";

/** Calm page opener: petal ground, one sparkle, the heading and a lead. No scattered ornament. */
export function PageBanner({ title, body }: { title: string; body?: string }) {
  return (
    <section className="bg-petal">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Sparkle className="mb-5 h-6 w-6" fill="#C30239" />
        <SectionHeading as="h1" title={title} className="max-w-[20ch] text-raspberry-deep" />
        {body && <p className="mt-5 max-w-prose text-lg text-ink/80">{body}</p>}
      </div>
    </section>
  );
}
