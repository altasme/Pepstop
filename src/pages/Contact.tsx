import { CHAT_HELPER, CONTACT, CONTACT_PAGE } from "../content/site";
import { getChannels, hasChatChannel } from "../lib/cta";
import { Seo } from "../lib/seo";
import { phone } from "../lib/phone";
import { PageBanner } from "../components/sections/PageBanner";
import { CtaButton } from "../components/ui/CtaButton";

export default function Contact() {
  const channels = getChannels();
  return (
    <>
      <Seo path="/contact" />
      <PageBanner title={CONTACT_PAGE.title} body={CONTACT_PAGE.body} />
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <h2 className="font-heading text-h3 font-semibold text-magenta-deep">{CONTACT_PAGE.channelsTitle}</h2>
        <p className="mt-2 max-w-prose text-charcoal">{hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "primary" : "secondary"} />
          ))}
        </div>
        <dl className="mt-10 grid max-w-prose gap-4 text-charcoal sm:grid-cols-[auto_1fr] sm:gap-x-8">
          <dt className="font-semibold text-magenta-deep">{CONTACT_PAGE.phoneLabel}</dt>
          <dd><a href={phone.telHref} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-magenta">{phone.display}</a></dd>
          {CONTACT.email && (<><dt className="font-semibold text-magenta-deep">{CONTACT_PAGE.emailLabel}</dt><dd><a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-magenta">{CONTACT.email}</a></dd></>)}
          {CONTACT.facebookUrl && (<><dt className="font-semibold text-magenta-deep">{CONTACT_PAGE.facebookLabel}</dt><dd><a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-magenta">{CONTACT.facebookUrl}</a></dd></>)}
          {CONTACT.hours && (<><dt className="font-semibold text-magenta-deep">{CONTACT_PAGE.hoursTitle}</dt><dd>{CONTACT.hours}</dd></>)}
        </dl>
        {/* Phase 2A: INQUIRY_MODE === "form" renders the inquiry form here. Not built in Phase 1. */}
      </section>
    </>
  );
}
