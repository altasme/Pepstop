/**
 * SINGLE SOURCE OF TRUTH for public copy and config (CLAUDE.md §7).
 * Components never hardcode strings. Open items are tagged with their gate ID (★G1, ★C3 ...).
 * Phase 2A swaps the source behind getContent.ts only; shapes here stay flat and JSON-serializable.
 */

/* ------------------------------------------------------------------ */
/* Organisation                                                        */
/* ------------------------------------------------------------------ */

export const ORG = {
  name: "The Pep Stop",
  descriptor: "Health & Beauty",
  tagline: "Your destination for wellness, beauty, and informed self-care.",
  legalName: null as null | string, // ★G1
  registration: null as null | string, // ★G1
  logo: null as null | string, // ★G2, Cloudinary public id. null = PH-03 wordmark
  intro: [
    "The Pep Stop is a health and beauty brand built on clear information and attentive service. We believe good self-care starts with understanding what you are choosing, and why.",
    "Whether you are building a skincare routine, looking for everyday wellness ideas, or simply have a question, you can reach us directly. Message or call us and tell us what you would like to know.",
  ],
  mission:
    "To help people make informed, confident choices about their health and beauty by sharing clear, honest information and meeting every conversation with care.",
  vision:
    "A community where self-care is approachable, well understood, and guided by honest information.",
  missionStatus: "draft" as "draft" | "approved", // ★C1
};

export const CONTACT = {
  phoneDisplay: "0991 018 9669",
  phoneE164: "+639910189669",
  viber: false, // ★C4
  whatsapp: false, // ★C4
  email: null as null | string, // ★C2
  facebookUrl: null as null | string, // ★C3
  messengerUrl: null as null | string, // ★C3, m.me link
  hours: null as null | string, // ★C6
};

/* ------------------------------------------------------------------ */
/* Conversion system (CLAUDE.md §8). Every CTA resolves from here.     */
/* ------------------------------------------------------------------ */

export const CTA = {
  primary: CONTACT.messengerUrl
    ? { kind: "messenger" as const, href: CONTACT.messengerUrl, label: "Message Us on Messenger", navLabel: "Message Us" }
    : { kind: "phone" as const, href: `tel:${CONTACT.phoneE164}`, label: `Call ${CONTACT.phoneDisplay}`, navLabel: "Call Us" },
  call: { href: `tel:${CONTACT.phoneE164}`, label: "Call Us" },
  sms: { href: `sms:${CONTACT.phoneE164}`, label: "Text Us" },
  viber: CONTACT.viber
    ? { href: `viber://chat?number=${encodeURIComponent(CONTACT.phoneE164)}`, label: "Viber" }
    : null,
  whatsapp: CONTACT.whatsapp
    ? {
        href: `https://wa.me/${CONTACT.phoneE164.replace("+", "")}?text=${encodeURIComponent("Hi The Pep Stop, I have a question.")}`,
        label: "WhatsApp",
      }
    : null,
  email: CONTACT.email ? { href: `mailto:${CONTACT.email}?subject=Inquiry%20from%20website`, label: "Email Us" } : null,
};

/** Phase 2 activation constants (CLAUDE.md §16.1). Only the values in the Phase 1 column are live. */
export const INQUIRY_MODE: "chat" | "form" = "chat"; // 2A: "form"
export const CONTENT_SOURCE: "static" | "store" = "static"; // 2A: "store"
export const CATALOGUE_SOURCE: "none" | "db" = "none"; // 2A: "db"
export const COMMERCE_MODE = "none" as const; // not a Phase 2 switch (§10)

export const CHAT_HELPER = {
  withChat: "Tell us your name and what you would like to know.",
  phoneOnly: "Call or text us. Tell us your name and what you would like to know.",
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Health & Beauty", to: "/health-beauty" },
  { label: "Wellness Education", to: "/education" },
  { label: "Contact", to: "/contact" },
];

/** Routes where the mobile sticky CTA bar is hidden (§9.8). */
export const STICKY_CTA_HIDDEN_ON = ["/contact", "/privacy", "/404"];

/* ------------------------------------------------------------------ */
/* Image slots. No images are generated or bundled. Each slot renders  */
/* a placeholder stating canvas size, aspect ratio and file type until */
/* a licensed asset is uploaded to Cloudinary and its public id is set */
/* in `src` (or in FocusArea.image).                                   */
/* ------------------------------------------------------------------ */

export type ImageSlot = {
  id: string;
  ph: string; // Placeholder Registry ID (CLAUDE.md §2.1)
  label: string;
  width: number;
  height: number;
  format: string;
  src: string | null; // Cloudinary public id
  alt: string;
  direction: string;
};

export const IMAGE_SLOTS = {
  hero: {
    id: "hero",
    ph: "PH-01",
    label: "Home hero image",
    width: 1200,
    height: 1500,
    format: "JPG or WebP",
    src: null,
    alt: "A calm morning skincare ritual",
    direction: "Licensed skincare texture or calm morning routine. Warm light, ivory and blush tones. No clinical imagery.",
  },
  focus: {
    id: "focus",
    ph: "PH-02",
    label: "Focus area image",
    width: 1200,
    height: 900,
    format: "JPG or WebP",
    src: null,
    alt: "",
    direction: "Licensed lifestyle image: skincare ritual, morning routine, or active lifestyle. Adults 30 to 60, mixed gender.",
  },
  logo: {
    id: "logo",
    ph: "PH-03",
    label: "Logo (header and footer)",
    width: 960,
    height: 240,
    format: "SVG preferred, or PNG with transparent background",
    src: null,
    alt: "The Pep Stop",
    direction: "Supplied by the client (★G2).",
  },
  favicon: {
    id: "favicon",
    ph: "PH-03",
    label: "Favicon",
    width: 512,
    height: 512,
    format: "PNG",
    src: null,
    alt: "",
    direction: "Square mark derived from the supplied logo (★G2).",
  },
  og: {
    id: "og",
    ph: "PH-03",
    label: "Social share image (Open Graph)",
    width: 1200,
    height: 630,
    format: "PNG or JPG",
    src: null,
    alt: "The Pep Stop, Health & Beauty",
    direction: "Logo on ivory or blush. Keep key content inside the central 1000 by 500 px.",
  },
} satisfies Record<string, ImageSlot>;

export type ImageSlotKey = keyof typeof IMAGE_SLOTS;

export const MEDIA = {
  cloudName: null as null | string, // Cloudinary cloud name, set when assets are uploaded
};

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export const HOME = {
  heroTitle: "Your destination for wellness, beauty, and informed self-care.",
  heroSupport: "The Pep Stop is a health and beauty brand built on clear information and attentive service.",
  heroSecondary: { label: "Explore Health & Beauty", to: "/health-beauty" },
  introEyebrow: "Welcome",
  introTitle: "Care that starts with clear information.",
  focusEyebrow: "What we focus on",
  focusTitle: "Three areas, one approach.",
  focusLink: "Learn more",
  educationEyebrow: "Wellness Education",
  educationTitle: "Learn at your own pace.",
  educationAll: "See all articles",
  valuesEyebrow: "How we work",
  valuesTitle: "What we stand for.",
  contactTitle: "Have a question? Reach us directly.",
  contactBody: "We reply to every message and pick up every call we can.",
};

export type FocusArea = { id: string; title: string; summary: string; order: number; image: string | null };

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "beauty-skincare",
    title: "Beauty & Skincare",
    summary:
      "Everyday skincare habits, ingredient basics, and how to read a product label. A simple routine is easier to keep than a complicated one, and we explain the basics in plain language.",
    order: 1,
    image: null,
  },
  {
    id: "health-wellness",
    title: "Health & Wellness",
    summary:
      "Simple habits around sleep, hydration, and movement may help you feel more like yourself. We share general ideas, not medical advice, and encourage you to speak with a licensed physician about your own health.",
    order: 2,
    image: null,
  },
  {
    id: "emerging-wellness-innovations",
    title: "Emerging Wellness Innovations",
    summary:
      "Interest in new wellness ideas is growing. We explain what they are in general terms, so you can ask informed questions and talk with a licensed professional about what suits you.",
    order: 3,
    image: null,
  },
];

export const VALUES = [
  {
    id: "informed-choices",
    title: "Informed Choices",
    body: "We share clear, general information so you can decide with confidence.",
  },
  {
    id: "honest-information",
    title: "Honest Information",
    body: "We say what we know, and we say when we do not.",
  },
  {
    id: "attentive-service",
    title: "Attentive Service",
    body: "Every message and call gets a considered, courteous reply.",
  },
  {
    id: "responsible-self-care",
    title: "Responsible Self-Care",
    body: "Small, steady habits, and advice from licensed professionals when you need it.",
  },
];

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const HEALTH_BEAUTY = {
  bannerEyebrow: "Health & Beauty",
  bannerTitle: "Beauty and wellness, approached with care.",
  bannerBody: "Three areas of focus, each explained in general terms and in plain language.",
  relatedLabel: "Related reading",
  disclaimerLead: "General information only.",
};

export const EDUCATION = {
  bannerEyebrow: "Wellness Education",
  bannerTitle: "Wellness Education",
  bannerBody: "Plain-language reading on beauty, skincare, and everyday wellness.",
  empty: "Articles are coming soon.",
  emptyHint: "In the meantime, you are welcome to message or call us with your questions.",
  readMore: "Read article",
  back: "All articles",
  updated: "Last updated",
};

export const ABOUT = {
  bannerEyebrow: "About us",
  bannerTitle: "About The Pep Stop",
  bannerBody: "A health and beauty brand built on clear information and attentive service.",
  introTitle: "Who we are",
  missionTitle: "Our mission",
  visionTitle: "Our vision",
  draftNote: "Draft copy, pending review by The Pep Stop.",
  philosophyTitle: "Our philosophy",
  philosophy: [
    "Self-care works best when it is understood. We put clear, general information first, so the choices you make are your own and made with confidence.",
    "We keep our language plain and our claims modest. If we do not know something, we will tell you, and if a question is about your health, we will encourage you to speak with a licensed physician.",
  ],
  educationTitle: "Our commitment to customer education",
  education:
    "We publish short, general articles on beauty and everyday wellness, and we are always glad to answer questions by message or phone. Our aim is that you leave every conversation knowing a little more than when you started.",
  serviceTitle: "How we serve you",
  service:
    "You deal with people, not a queue. Reach us by message or phone, tell us your name and what you would like to know, and we will reply with care and without pressure.",
};

export const CONTACT_PAGE = {
  title: "Get in touch.",
  body: "The quickest way to reach us is by message or phone. There is no form to fill in.",
  hoursTitle: "Hours",
  channelsTitle: "Ways to reach us",
  phoneLabel: "Phone",
  emailLabel: "Email",
  facebookLabel: "Facebook",
};

export const NOT_FOUND = {
  title: "We could not find that page.",
  body: "The page may have moved, or the link may be mistyped.",
  home: "Back to home",
};

/* ------------------------------------------------------------------ */
/* Shared UI strings                                                   */
/* ------------------------------------------------------------------ */

export const UI = {
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuTitle: "Menu",
  primaryNavLabel: "Primary",
  footerNavLabel: "Footer",
  mobileNavLabel: "Mobile",
  footerContactTitle: "Contact",
  footerExploreTitle: "Explore",
  privacyLink: "Privacy Policy",
  disclaimer:
    "Content on this website is general information. It is not medical advice. For health concerns, consult a licensed physician.",
  articleDisclaimer:
    "This article is general information. It is not medical advice. For health concerns, consult a licensed physician.",
  placeholderTag: "Image placeholder",
  draftBadge: "Draft",
};

/* ------------------------------------------------------------------ */
/* Legal and analytics                                                 */
/* ------------------------------------------------------------------ */

export const LEGAL = {
  privacyStatus: "draft" as "draft" | "approved", // ★C7
  privacyContact: null as null | string, // ★C7, falls back to phone
  retention: null as null | string, // ★C7, e.g. "12 months"
  updatedAt: "2026-11-11",
};

export const PRIVACY = {
  title: "Privacy Policy",
  banner: "Draft, pending approval by The Pep Stop",
  lead: "This policy explains what personal information The Pep Stop handles when you use this website or contact us, and what your rights are under the Data Privacy Act of 2012 (RA 10173).",
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: [
        "This website is operated by {entity}. {registrationLine}",
        "For privacy questions, contact us at {privacyContact}.",
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      body: [
        "This website does not have a sign-up or contact form and does not set advertising cookies.",
        "If you message or call us, we receive what you choose to send, such as your name, your phone number or messaging profile, and the content of your message.",
        "We use Cloudflare Web Analytics, which is cookieless. It records aggregate page views and clicks on our contact buttons. It does not identify you personally.",
      ],
    },
    {
      id: "why",
      title: "Why we use it",
      body: [
        "We use what you send us to reply to your question and to give you the service you asked for. We use aggregate analytics to understand which pages are useful and to improve the site.",
      ],
    },
    {
      id: "access",
      title: "Who can access it",
      body: [
        "Your messages are visible to The Pep Stop staff who answer them, and to the messaging or phone provider you use to contact us. We do not sell your personal information.",
      ],
    },
    {
      id: "keep",
      title: "How long we keep it",
      body: ["{retentionLine}"],
    },
    {
      id: "rights",
      title: "Your rights",
      body: [
        "Under the Data Privacy Act of 2012 you have the right to be informed, to access your personal information, to object to its processing, to correct it, to request its erasure or blocking, to data portability, to claim damages where applicable, and to file a complaint with the National Privacy Commission.",
        "To exercise any of these rights, contact us using the details above.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: ["We may update this policy from time to time. The date of the latest update appears at the top of this page."],
    },
  ],
  retentionFallback: "We keep messages only as long as needed to answer you and to keep a reasonable record of our service. A fixed retention period will be stated here once confirmed.",
  registrationFallback: "Business registration details will be added here once confirmed.",
  updated: "Last updated",
};

export const ANALYTICS = {
  cfBeaconToken: null as null | string, // ★C8, Cloudflare Web Analytics token
  metaPixelId: null as null | string, // ★C8, public routes only, disclosed on Privacy
};

/* ------------------------------------------------------------------ */
/* SEO (CLAUDE.md §13)                                                 */
/* ------------------------------------------------------------------ */

export const SEO = {
  siteUrl: "https://thepepstop.altasme.com",
  routes: {
    "/": {
      title: "The Pep Stop | Health & Beauty",
      description: "The Pep Stop is a health and beauty brand built on clear information and attentive service. Message or call us with your questions.",
    },
    "/about": {
      title: "About Us | The Pep Stop",
      description: "Learn about The Pep Stop, our mission, and our approach to clear information and attentive service in health and beauty.",
    },
    "/health-beauty": {
      title: "Beauty & Wellness | The Pep Stop",
      description: "Beauty and skincare, health and wellness, and emerging wellness ideas, explained in general terms and plain language.",
    },
    "/education": {
      title: "Wellness Education | The Pep Stop",
      description: "Plain-language reading on beauty, skincare, and everyday wellness from The Pep Stop.",
    },
    "/contact": {
      title: "Contact | The Pep Stop",
      description: "Reach The Pep Stop by message or phone. Tell us your name and what you would like to know.",
    },
    "/privacy": {
      title: "Privacy Policy | The Pep Stop",
      description: "How The Pep Stop handles personal information under the Data Privacy Act of 2012.",
    },
  } as Record<string, { title: string; description: string }>,
  titleSuffix: " | The Pep Stop",
  notFoundTitle: "Page not found | The Pep Stop",
  locale: "en_PH",
};
