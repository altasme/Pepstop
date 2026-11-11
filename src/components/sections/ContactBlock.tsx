import { CHAT_HELPER, CONTACT, CONTACT_PAGE, HOME } from "../../content/site";
import { getChannels, hasChatChannel } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SectionHeading } from "../ui/SectionHeading";

/** The one drenched raspberry field on the page: the action a visitor came to take. */
export function ContactBlock() {
  const channels = getChannels();
  return (
    <section className="on-dark bg-raspberry text-white">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <SectionHeading title={HOME.contactTitle} onDark className="max-w-[16ch]" />
        <p className="mt-5 max-w-prose text-lg text-white/90">{HOME.contactBody} {hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "onDark" : "onDarkOutline"} />
          ))}
        </div>
        {CONTACT.hours && <p className="mt-6 text-white/90"><span className="font-semibold">{CONTACT_PAGE.hoursTitle}:</span> {CONTACT.hours}</p>}
      </div>
    </section>
  );
}
