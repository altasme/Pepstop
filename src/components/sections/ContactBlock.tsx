import { CHAT_HELPER, CONTACT, CONTACT_PAGE, HOME } from "../../content/site";
import { getChannels, hasChatChannel } from "../../lib/cta";
import { CtaButton } from "../ui/CtaButton";
import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";
import { SparkleField } from "../ui/SparkleField";
import { Sprig } from "../ui/Sprig";

export function ContactBlock() {
  const channels = getChannels();
  return (
    <section className="relative overflow-hidden bg-petal">
      <Sprig className="pointer-events-none absolute -bottom-6 right-4 hidden h-[118%] w-auto text-raspberry/60 sm:block lg:right-28" />
      <SparkleField
        className="hidden sm:block"
        spots={[
          { x: "72%", y: "16%", size: 16, delay: 0.3 },
          { x: "92%", y: "62%", size: 12, delay: 1.5, fill: "#C30239" },
        ]}
      />
      <div className="relative mx-auto max-w-page px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        <Sparkle className="mb-5 h-6 w-6" fill="#C30239" />
        <SectionHeading title={HOME.contactTitle} className="max-w-[22ch] text-raspberry-deep" />
        <p className="mt-5 max-w-prose text-lg text-ink/80">{HOME.contactBody} {hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "primary" : "secondary"} />
          ))}
        </div>
        {CONTACT.hours && <p className="mt-6 text-ink/80"><span className="font-semibold">{CONTACT_PAGE.hoursTitle}:</span> {CONTACT.hours}</p>}
      </div>
    </section>
  );
}
