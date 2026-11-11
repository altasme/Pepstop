import { CONTACT } from "../content/site";

export const phone = {
  display: CONTACT.phoneDisplay,
  e164: CONTACT.phoneE164,
  telHref: `tel:${CONTACT.phoneE164}`,
};
