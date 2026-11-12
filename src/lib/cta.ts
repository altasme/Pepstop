/** Resolves every CTA from the CTA constant. A channel whose value is null is hidden; never invent a link. */
import { CONTACT, CTA } from "../content/site";
import type { CtaKind } from "./analytics";

export type Channel = {
  kind: CtaKind;
  href: string;
  label: string;
  icon: "messenger" | "phone" | "sms" | "viber" | "whatsapp" | "email";
  external: boolean;
};

export const primaryCta = CTA.primary;

/** Channels in display order, with hidden ones removed. */
export function getChannels(): Channel[] {
  const list: (Channel | null)[] = [
    CONTACT.messengerUrl
      ? { kind: "messenger", href: CTA.primary.href, label: CTA.primary.label, icon: "messenger", external: true }
      : null,
    { kind: "call", href: CTA.call.href, label: CTA.call.label, icon: "phone", external: false },
    { kind: "sms", href: CTA.sms.href, label: CTA.sms.label, icon: "sms", external: false },
    CTA.viber ? { kind: "viber", href: CTA.viber.href, label: CTA.viber.label, icon: "viber", external: false } : null,
    CTA.whatsapp ? { kind: "whatsapp", href: CTA.whatsapp.href, label: CTA.whatsapp.label, icon: "whatsapp", external: true } : null,
    CTA.email ? { kind: "email", href: CTA.email.href, label: CTA.email.label, icon: "email", external: false } : null,
  ];
  return list.filter((c): c is Channel => c !== null);
}

export const hasChatChannel = () => getChannels().some((c) => ["messenger", "viber", "whatsapp"].includes(c.kind));

/** Channels with a prefilled message where the app supports it (SMS body, WhatsApp text). Others open blank. */
export function getChannelsWithMessage(text: string): Channel[] {
  return getChannels().map((c) => {
    if (c.kind === "sms") return { ...c, href: `${CTA.sms.href}?&body=${encodeURIComponent(text)}` };
    if (c.kind === "whatsapp" && CTA.whatsapp) return { ...c, href: `${CTA.whatsapp.href.split("?")[0]}?text=${encodeURIComponent(text)}` };
    return c;
  });
}
