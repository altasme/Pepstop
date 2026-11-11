import { SectionHeading } from "../ui/SectionHeading";

export function PageBanner({ title, body }: { title: string; body?: string }) {
  return (
    <section className="border-b border-line bg-petal">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <SectionHeading as="h1" title={title} className="max-w-[18ch]" />
        {body && <p className="mt-5 max-w-prose text-lg text-ink/80">{body}</p>}
      </div>
    </section>
  );
}
