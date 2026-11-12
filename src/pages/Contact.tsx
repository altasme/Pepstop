import { useRemote } from "../lib/remote";
import { CHAT_HELPER, CONTACT, CONTACT_PAGE } from "../content/site";
import { getChannels, hasChatChannel } from "../lib/cta";
import { Seo } from "../lib/seo";
import { phone } from "../lib/phone";
import { PageBanner } from "../components/sections/PageBanner";
import { CtaButton } from "../components/ui/CtaButton";
import { InquiryForm } from "../components/sections/InquiryForm";

export default function Contact() {
  useRemote();
  const channels = getChannels();
  return (
    <>
      <Seo path="/contact" />
      <PageBanner title={CONTACT_PAGE.title} body={CONTACT_PAGE.body} />
      <section className="mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <h2 className="font-sans text-h3 font-semibold text-ink">{CONTACT_PAGE.channelsTitle}</h2>
        <p className="mt-2 max-w-prose text-ink">{hasChatChannel() ? CHAT_HELPER.withChat : CHAT_HELPER.phoneOnly}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {channels.map((c, i) => (
            <CtaButton key={c.kind} channel={c} label={c.label} variant={i === 0 ? "primary" : "secondary"} />
          ))}
        </div>
        <dl className="mt-10 grid max-w-prose gap-4 text-ink sm:grid-cols-[auto_1fr] sm:gap-x-8">
          <dt className="font-semibold text-ink">{CONTACT_PAGE.phoneLabel}</dt>
          <dd><a href={phone.telHref} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-raspberry">{phone.display}</a></dd>
          {CONTACT.email && (<><dt className="font-semibold text-ink">{CONTACT_PAGE.emailLabel}</dt><dd><a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-raspberry">{CONTACT.email}</a></dd></>)}
          {CONTACT.facebookUrl && (<><dt className="font-semibold text-ink">{CONTACT_PAGE.facebookLabel}</dt><dd><a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-raspberry">{CONTACT.facebookUrl}</a></dd></>)}
          {CONTACT.hours && (<><dt className="font-semibold text-ink">{CONTACT_PAGE.hoursTitle}</dt><dd>{CONTACT.hours}</dd></>)}
        </dl>
        {/* Phase 2A: INQUIRY_MODE === "form" renders the inquiry form here. Not built in Phase 1. */}
      </section>
      <InquiryForm />
    </>
  );
}
