import { useLocation } from "react-router-dom";
import { Mail, MessageCircle, MessageSquare, Phone, Smartphone } from "lucide-react";
import type { Channel } from "../../lib/cta";
import { trackCta } from "../../lib/analytics";
import { Button } from "./Button";

const icons = {
  messenger: MessageCircle,
  phone: Phone,
  sms: MessageSquare,
  viber: Smartphone,
  whatsapp: MessageCircle,
  email: Mail,
};

type Props = {
  channel: Pick<Channel, "kind" | "href" | "icon"> & { external?: boolean };
  label: string;
  variant?: "primary" | "secondary" | "onDark" | "onDarkOutline";
  className?: string;
};

/** A CTA link that fires the matching analytics event. Always rendered from a resolved channel. */
export function CtaButton({ channel, label, variant = "primary", className }: Props) {
  const { pathname } = useLocation();
  const Icon = icons[channel.icon];
  return (
    <Button
      href={channel.href}
      external={channel.external}
      variant={variant}
      className={className}
      onClick={() => trackCta(channel.kind, pathname)}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {label}
    </Button>
  );
}
