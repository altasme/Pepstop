import { CHAT_HELPER, CONTACT, CONTACT_PAGE, HOME } from "../../content/site";
import { getChannels, hasChatChannel } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SectionHeading } from "../ui/SectionHeading";
import { ArcMotif } from "../ui/ArcMotif";

export function ContactBlock() {
  const channels = getChannels();
  return (
    <section className="relative overflow-hidden bg-blush">
      <ArcMotif className="pointer-events-none absolute -bottom-2 left-1/2 w-[28rem] -translate-x-1/2 opacity-60" />
      <div className="relative mx-auto max-w-page px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={HOME.contactTitle} align="center" />
        <p className="mx-auto mt-4 max-w-prose text-lg text-charcoal">{HOME.contactBody}</p>
        <p className="mx-auto mt-2 max-w-prose text-charcoal">{hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "primary" : "secondary"} />
          ))}
        </div>
        {CONTACT.hours && <p className="mt-6 text-charcoal"><span className="font-semibold">{CONTACT_PAGE.hoursTitle}:</span> {CONTACT.hours}</p>}
      </div>
    </section>
  );
}
