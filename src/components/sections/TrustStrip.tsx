import { Headset, PackageCheck, MessageCircleQuestion, ClipboardList } from "lucide-react";
import { HOME, TRUST } from "../../content/site";
import { SectionHeading } from "../ui/SectionHeading";

const icons: Record<string, typeof Headset> = { ask: MessageCircleQuestion, info: ClipboardList, order: PackageCheck, care: Headset };

export function TrustStrip() {
  return (
    <section className="bg-blush">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <SectionHeading eyebrow={HOME.trustEyebrow} title={HOME.trustTitle} />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => {
            const Icon = icons[t.id] ?? Headset;
            return (
              <li key={t.id} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-magenta-deep/5">
                <Icon className="h-7 w-7 text-magenta" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 font-heading text-2xl font-semibold text-magenta-deep">{t.title}</h3>
                <p className="mt-2 text-charcoal">{t.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
