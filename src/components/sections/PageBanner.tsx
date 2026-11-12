import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";
import { SparkleField } from "../ui/SparkleField";
import { Sprig } from "../ui/Sprig";

export function PageBanner({ title, body }: { title: string; body?: string }) {
  return (
    <section className="relative overflow-hidden bg-petal">
      <Sprig className="pointer-events-none absolute -bottom-4 right-6 hidden h-[115%] w-auto text-raspberry/60 sm:block lg:right-24" />
      <SparkleField
        className="hidden sm:block"
        spots={[
          { x: "72%", y: "22%", size: 14, delay: 0.2 },
          { x: "86%", y: "58%", size: 10, delay: 1.4, fill: "#C30239" },
          { x: "64%", y: "74%", size: 9, delay: 2.2 },
        ]}
      />
      <div className="relative mx-auto max-w-page px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Sparkle className="mb-5 h-6 w-6" fill="#C30239" />
        <SectionHeading as="h1" title={title} className="max-w-[18ch] text-raspberry-deep" />
        {body && <p className="mt-5 max-w-prose text-lg text-ink/80">{body}</p>}
      </div>
    </section>
  );
}
