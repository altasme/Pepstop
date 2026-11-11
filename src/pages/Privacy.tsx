import { CONTACT, LEGAL, ORG, PRIVACY } from "../content/site";
import { Seo } from "../lib/seo";
import { formatDate } from "../lib/format";
import { phone } from "../lib/phone";

function fill(text: string): string {
  const entity = ORG.legalName ?? ORG.name;
  const registrationLine = ORG.registration ? `Registration: ${ORG.registration}.` : PRIVACY.registrationFallback;
  const privacyContact = LEGAL.privacyContact ?? CONTACT.email ?? phone.display;
  const retentionLine = LEGAL.retention ? `We keep messages for ${LEGAL.retention}, then delete them.` : PRIVACY.retentionFallback;
  return text
    .replace("{entity}", entity)
    .replace("{registrationLine}", registrationLine)
    .replace("{privacyContact}", privacyContact)
    .replace("{retentionLine}", retentionLine);
}

export default function Privacy() {
  return (
    <>
      <Seo path="/privacy" />
      {LEGAL.privacyStatus === "draft" && (
        <div role="note" className="bg-rose-ink px-4 py-3 text-center text-sm font-semibold text-white">{PRIVACY.banner}</div>
      )}
      <article className="mx-auto max-w-prose px-4 py-12 sm:px-6 md:py-20">
        <h1 className="font-heading text-h1 font-semibold text-magenta-deep">{PRIVACY.title}</h1>
        <p className="mt-2 text-sm text-charcoal/80">{PRIVACY.updated} {formatDate(LEGAL.updatedAt)}</p>
        <p className="mt-6 text-lg text-charcoal">{PRIVACY.lead}</p>
        {PRIVACY.sections.map((s) => (
          <section key={s.id} className="mt-10">
            <h2 className="font-heading text-h3 font-semibold text-magenta-deep">{s.title}</h2>
            <div className="mt-3 space-y-4 text-charcoal">{s.body.map((p) => <p key={p}>{fill(p)}</p>)}</div>
          </section>
        ))}
      </article>
    </>
  );
}
