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
  tagline: "Beauty, wellness, and self-care, beautifully considered.",
  legalName: null as null | string, // ★G1
  registration: null as null | string, // ★G1
  logo: "/images/logo-320.webp" as null | string, // ★G2 closed 2026-11-11. Local path or Cloudinary id. null = PH-03 wordmark
  intro: [
    "The Pep Stop is a health and beauty brand for women who like to know what they are choosing, and why. We believe self-care should feel considered, calm, and a little luxurious.",
    "Whether you are shaping a skincare ritual, exploring wellness, or simply have a question, you are never left to work it out alone. Message or call, and a real person will look after you.",
  ],
  mission:
    "To help women choose beauty and wellness with confidence, through clear, honest information and service that feels personal, calm, and attentive.",
  vision:
    "A world where looking after yourself feels beautiful, informed, and entirely your own.",
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
export const CATALOGUE_SOURCE: "static" | "db" = "static"; // 2A: "db" (products from D1)
/** v1.2: storefront UI is built. "frontend" = cart and checkout screens only, orders leave the browser by chat, no payment collected. "live" needs the Phase 2 backend. */
export const COMMERCE_MODE: "frontend" | "live" = "frontend";

export const CHAT_HELPER = {
  withChat: "Tell us your name and what you would like to know.",
  phoneOnly: "Call or text us. Tell us your name and what you would like to know.",
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Health & Beauty", to: "/health-beauty" },
  { label: "Wellness Education", to: "/education" },
  { label: "Contact", to: "/contact" },
];

/** Routes where the mobile sticky CTA bar is hidden (§9.8). */
export const STICKY_CTA_HIDDEN_ON = ["/contact", "/privacy", "/404", "/cart", "/checkout", "/checkout/confirmation"];

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

/** Supplied logo (★G2). Transparent badge, 1:1. Original kept in design/logo-original.svg. */
export const LOGO_ASSET = {
  srcSet: "/images/logo-160.webp 160w, /images/logo-320.webp 320w, /images/logo-640.webp 640w",
  width: 640,
  height: 640,
};

export const IMAGE_SLOTS = {
  hero: {
    id: "hero",
    ph: "PH-01",
    label: "Home hero, desktop (full bleed)",
    width: 2400,
    height: 1000,
    format: "JPG or WebP",
    src: "/images/hero-desktop.webp",
    alt: "Five women laughing together in soft neutral tops against a light studio wall",
    direction: "Subject in the right 40 percent, a clean light area across the left 55 percent for the headline. Soft blush tones, natural light. No clinical imagery.",
  },
  heroMobile: {
    id: "heroMobile",
    ph: "PH-01",
    label: "Home hero, phone crop",
    width: 1200,
    height: 1000,
    format: "JPG or WebP",
    src: "/images/hero-mobile.webp",
    alt: "Five women laughing together in soft neutral tops against a light studio wall",
    direction: "Same photograph recomposed with the subject centered and 15 percent margin all round.",
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
  story: {
    id: "story",
    ph: "PH-10",
    label: "Brand story image",
    width: 1200,
    height: 1500,
    format: "JPG or WebP",
    src: null,
    alt: "",
    direction: "A real photograph of the shop, the team, or the packing table, supplied by the client. Real people and a real place; no stock models posing as staff.",
  },
  product: {
    id: "product",
    ph: "PH-09",
    label: "Product image",
    width: 1000,
    height: 1000,
    format: "JPG or WebP",
    src: null,
    alt: "",
    direction: "Clean product photo on ivory or blush, supplied by the client. One image per product, plus optional extras.",
  },
  logo: {
    id: "logo",
    ph: "PH-03",
    label: "Logo (header and footer)",
    width: 640,
    height: 640,
    format: "WebP with transparent background (supplied)",
    src: "/images/logo-320.webp",
    alt: "The Pep Stop, Health & Beauty",
    direction: "Supplied by the client (★G2). Closed.",
  },
  favicon: {
    id: "favicon",
    ph: "PH-03",
    label: "Favicon",
    width: 512,
    height: 512,
    format: "PNG",
    src: "/favicon.png",
    alt: "",
    direction: "Derived from the supplied logo (★G2).",
  },
  og: {
    id: "og",
    ph: "PH-03",
    label: "Social share image (Open Graph)",
    width: 1200,
    height: 630,
    format: "PNG or JPG",
    src: "/og/og-default.png",
    alt: "The Pep Stop, Health & Beauty",
    direction: "Supplied logo centered on ivory. Keep key content inside the central 1000 by 500 px.",
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
  announcement: "Order online. A real person looks after every detail.",
  heroTitle: "Self-care, beautifully considered.",
  heroSupport: "Premium beauty and wellness for women, curated with care, and a real person to help you choose.",
  heroShop: { label: "Discover the collections", to: "/shop" },
  heroMatch: { lead: "Not sure where to start?", link: "Get matched" },
  heroCollectionsLabel: "Our collections",
  categoriesTitle: "Find your ritual",
  categoryLink: "Discover",
  matchName: "Pep Match",
  matchTitle: "Not sure where to start? Get matched.",
  matchBody: "is our personal touch. Tell us a little about what you are looking for and we will point you to the right collection, then look after availability, delivery, and payment with you directly. One message is all it takes.",
  matchCta: "Get matched",
  matchMessage: "Hi The Pep Stop, I would like help choosing a collection.",
  featuredTitle: "The edit",
  featuredAll: "Shop everything",
  storyHeading: "Beauty is personal. So is the way we serve you.",
  storyPillars: ["Considered choices", "Honest information", "Personal service"],
  storyLink: { label: "Meet The Pep Stop", to: "/about" },
  whyTitle: "Shopping, the way it should feel",
  whyIntro: "Beautiful things deserve a beautiful experience. Ours is unhurried, personal, and clear, from the first question to the day your order arrives.",
  whyItems: [
    { title: "Ask before you buy", body: "Message or call about anything, and receive a plain, thoughtful answer." },
    { title: "Looked after by a person", body: "Every order is confirmed with you personally, from availability to delivery." },
    { title: "Every detail, laid out", body: "Product pages set out specifications, packaging, and storage, so nothing is left to guess." },
    { title: "Pay the way you prefer", body: "GCash, Maya, bank transfer, or cash on delivery, arranged when your order is confirmed." },
  ],
  howTitle: "Effortless, from start to finish",
  howSteps: [
    { title: "Choose", body: "Fill your cart with what feels right, and tell us where to send it." },
    { title: "Send", body: "Your order summary opens, ready to send by text, call, or message. Nothing is charged on this website." },
    { title: "Confirm", body: "We confirm availability, delivery, and payment with you personally, and take care of the rest." },
  ],
  approachTitle: "How we work",
  educationTitle: "Gentle reading for the curious",
  educationAll: "See all articles",
  contactTitle: "Let us make it personal.",
  contactBody: "Tell us what you are looking for, and a real person will help you find it. Message or call, whichever feels easiest.",
};

/** Business strip on Home and Shop. Statements describe how we work; no delivery times or guarantees are promised. */
export const TRUST = [
  { id: "ask", title: "Ask before you buy", body: "Message or call us about any product. We answer plainly." },
  { id: "info", title: "Clear product information", body: "Variants, packaging, and storage are listed on every product page." },
  { id: "order", title: "Order your way", body: "Check out online, then confirm your order with us by message." },
  { id: "care", title: "Attentive service", body: "Every message and call gets a considered, courteous reply." },
];

export type FocusArea = { id: string; title: string; tagline: string; summary: string; order: number; image: string | null };

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "weight-wellness",
    title: "Weight & Wellness",
    tagline: "Your goals, your pace, no pressure.",
    summary:
      "Every woman's relationship with her body is personal, and so is the way she looks after it. This collection is for the goals you set for yourself, at a pace that feels right. We keep the details clear, we never pressure, and we always suggest speaking with a licensed physician about your own health.",
    order: 1,
    image: null,
  },
  {
    id: "next-generation-wellness",
    title: "Next-Generation Wellness",
    tagline: "The newest ideas in wellness, explained with care.",
    summary:
      "Wellness keeps evolving, and it is natural to be curious. Here, newer ideas are introduced in plain language and without hype, so you can ask informed questions and decide what belongs in your life. A licensed professional is the right person to guide the choices that are personal to you.",
    order: 2,
    image: null,
  },
  {
    id: "skin-beauty",
    title: "Skin & Beauty",
    tagline: "Quiet daily rituals for the skin you live in.",
    summary:
      "Beauty is a daily ritual before it is anything else: a quiet moment that belongs to you. Here you will find skincare and beauty essentials chosen to feel as good as they look, with every detail laid out so a simple routine stays simple.",
    order: 3,
    image: null,
  },
  {
    id: "vitality-cellular-health",
    title: "Vitality & Cellular Health",
    tagline: "For women who take the long view of wellbeing.",
    summary:
      "Looking after yourself is a long-term act of care. This collection is for women who like to understand what they are choosing and why. We lay out every detail, we make no promises about results, and we are always here to answer your questions before you order.",
    order: 4,
    image: null,
  },
  {
    id: "energy-cellular-wellness",
    title: "Energy & Cellular Wellness",
    tagline: "For the days that ask a lot of you.",
    summary:
      "Some seasons of life ask more of you than others. This collection is for the days that need a little extra care, with every detail set out plainly and a real person confirming your order. For any concern about your health, please consult a licensed physician.",
    order: 5,
    image: null,
  },
];

export const VALUES = [
  {
    id: "informed-choices",
    title: "Informed Choices",
    body: "Clear, general information, so every choice is yours and made with confidence.",
  },
  {
    id: "honest-information",
    title: "Honest Information",
    body: "We say what we know, we say when we do not, and we never overpromise.",
  },
  {
    id: "attentive-service",
    title: "Attentive Service",
    body: "Every message and call receives a considered, courteous reply.",
  },
  {
    id: "responsible-self-care",
    title: "Responsible Self-Care",
    body: "Small, steady habits, and the advice of licensed professionals when you need it.",
  },
];

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const HEALTH_BEAUTY = {
  bannerEyebrow: "Health & Beauty",
  bannerTitle: "Five collections, each one considered.",
  bannerBody: "Every collection is explained in warm, plain language, with each product detail laid out for you.",
  relatedLabel: "Related reading",
  shopCollection: "Shop this collection",
  disclaimerLead: "General information only.",
};

export const EDUCATION = {
  bannerEyebrow: "Wellness Education",
  bannerTitle: "Wellness Education",
  bannerBody: "Calm, plain-language reading on beauty, skincare, and everyday wellness, for whenever you have a quiet moment.",
  empty: "Articles are coming soon.",
  emptyHint: "In the meantime, you are welcome to message or call us with your questions.",
  readMore: "Read article",
  back: "All articles",
  updated: "Last updated",
};

export const ABOUT = {
  bannerEyebrow: "About us",
  bannerTitle: "Beauty, with a personal touch.",
  bannerBody: "A health and beauty brand for women who value clear information, calm service, and the pleasure of being looked after.",
  introTitle: "Our story",
  missionTitle: "Our mission",
  visionTitle: "Our vision",
  draftNote: "Draft copy, pending review by The Pep Stop.",
  valuesTitle: "What we stand for",
  storyImageNote: "Our shop and our people",
  collectionsTitle: "Explore our collections",
  philosophyTitle: "Our philosophy",
  philosophy: [
    "Self-care is at its most beautiful when it is understood. We put clear, general information first, so the choices you make are entirely your own, and made with confidence.",
    "We keep our language warm and our claims modest. If we do not know something, we will tell you, and if a question is about your health, we will gently encourage you to speak with a licensed physician.",
  ],
  educationTitle: "Our commitment to customer education",
  education:
    "We write short, general articles on beauty and everyday wellness, and we are always glad to answer your questions by message or phone. Our hope is that you leave every conversation feeling a little more informed, and a little more at ease.",
  serviceTitle: "How we serve you",
  service:
    "You deal with people, not a queue. Reach us by message or phone, tell us your name and what you would like to know, and we will reply with care, warmth, and never any pressure.",
};

export const CONTACT_PAGE = {
  title: "We would love to hear from you.",
  body: "The quickest way to reach us is by message or phone. There is no form to fill in, just a real person on the other end.",
  hoursTitle: "Hours",
  channelsTitle: "Ways to reach us",
  phoneLabel: "Phone",
  emailLabel: "Email",
  facebookLabel: "Facebook",
};

export const SHOP = {
  bannerEyebrow: "Shop",
  bannerTitle: "Shop the collections",
  bannerBody: "Premium beauty and wellness, set out clearly. Take your time, ask us anything, and a real person confirms your order.",
  searchLabel: "Search products",
  searchPlaceholder: "Search by name",
  categoryLabel: "Category",
  allCategories: "All",
  sortLabel: "Sort by",
  sorts: { featured: "Featured", name: "Name", priceLow: "Price, low to high", priceHigh: "Price, high to low" },
  results: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
  empty: "No products match your search.",
  emptyStore: "Products are coming soon.",
  emptyStoreHint: "Message or call us to ask what is available.",
  clear: "Clear filters",
  sampleBadge: "Sample",
  viewProduct: "View product",
  sampleNote: "Sample slot. Product details, price, and photo to be supplied by The Pep Stop.",
  from: "From",
  addToCart: "Add to cart",
  added: "Added to cart",
  viewCart: "View cart",
  chooseOption: "Choose an option",
  quantity: "Quantity",
  availability: { available: "Available", ask: "Ask for availability", unavailable: "Unavailable" },
  askAbout: "Ask about this product",
  priceOnRequest: "Ask for price",
  detailsTitle: "Details",
  specsTitle: "Specifications",
  packagingTitle: "Packaging",
  storageTitle: "Storage",
  regLabel: "Reg. No.",
  notProvided: "To be provided by The Pep Stop.",
  back: "All products",
  breadcrumbHome: "Home",
  assurance: [
    "Looked after by a real person",
    "Delivery and payment arranged with you",
    "Questions answered before you buy",
  ],
  payWith: "Payment options",
  relatedTitle: "More to discover",
  productDisclaimer: "Product information is provided by The Pep Stop. It is general information and not medical advice. For health concerns, consult a licensed physician.",
};

export const CART = {
  title: "Your cart",
  empty: "Your cart is waiting.",
  emptyHint: "Browse the collections and add what feels right.",
  continue: "Continue shopping",
  checkout: "Proceed to checkout",
  remove: "Remove",
  subtotal: "Subtotal",
  shipping: "Shipping",
  shippingTbc: "Confirmed with your order",
  priceTbc: "Confirmed when we reply",
  total: "Estimated total",
  item: "Item",
  price: "Price",
  qty: "Qty",
  lineTotal: "Total",
  openCart: (n: number) => `Cart, ${n} ${n === 1 ? "item" : "items"}`,
  note: "Shipping and final availability are confirmed by The Pep Stop after you send your order.",
  decrease: "Decrease quantity",
  increase: "Increase quantity",
};

export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", enabled: true },
  { id: "maya", label: "Maya", enabled: true },
  { id: "bank", label: "Bank transfer", enabled: true },
  { id: "cod", label: "Cash on delivery", enabled: true },
];

export const CHECKOUT = {
  title: "Checkout",
  bannerBody: "Tell us where to send your order and how you would like to pay. Nothing is charged on this website.",
  contactTitle: "Your details",
  addressTitle: "Delivery address",
  paymentTitle: "Payment method",
  paymentNote: "No payment is collected here. Payment instructions are sent by The Pep Stop when your order is confirmed.",
  notesTitle: "Order notes",
  summaryTitle: "Order summary",
  place: "Place order",
  consent: "I agree that The Pep Stop may use these details to process my order, as described in the Privacy Policy.",
  privacyLinkLabel: "Privacy Policy",
  emptyTitle: "Nothing to check out yet.",
  fields: {
    fullName: "Full name",
    mobile: "Mobile number",
    mobileHint: "For example 0991 018 9669",
    email: "Email (optional)",
    street: "House number and street",
    barangay: "Barangay",
    city: "City or municipality",
    province: "Province",
    postal: "Postal code",
    notes: "Notes for The Pep Stop (optional)",
    notesHint: "Please do not include medical history.",
  },
  errors: {
    required: "This field is required.",
    mobile: "Enter a valid Philippine mobile number, for example 0991 018 9669.",
    email: "Enter a valid email address.",
    postal: "Enter a 4 digit postal code.",
    payment: "Choose a payment method.",
    consent: "Please confirm to continue.",
    summary: "Please fix the highlighted fields.",
  },
};

export const CONFIRMATION = {
  title: "Your order summary is ready.",
  lead: "One last step: send this summary to The Pep Stop, and we will confirm availability, delivery, and payment with you personally.",
  stubNote: "This website does not transmit orders by itself yet. Your order is complete only once you send it to us.",
  reference: "Order reference",
  sendTitle: "Send your order",
  copy: "Copy order summary",
  copied: "Copied",
  deliverTo: "Deliver to",
  payWith: "Payment method",
  contactLabel: "Contact",
  none: "We could not find an order in this browser.",
  noneHint: "Orders are kept only in the browser that placed them. You can start again from the shop.",
  messageIntro: "Hi The Pep Stop, I would like to place this order.",
};

export const NOT_FOUND = {
  title: "That page has slipped away.",
  body: "It may have moved, or the link may be mistyped. Let us take you somewhere lovely instead.",
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
  footerShopTitle: "Shop",
  footerShopAll: "All products",
  footerCompanyTitle: "The Pep Stop",
  footerHelpTitle: "Help",
  paymentsTitle: "Payment options",
  paymentsNote: "Arranged with you when your order is confirmed.",
  collectionsBarLabel: "Collections",
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
        "This website does not set advertising cookies. When you shop, your cart is kept in your own browser. When you check out, the details you type (name, mobile number, address, notes, and payment method choice) stay in your browser until you choose to send your order to us by message or phone.",
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
      description: "Premium beauty and wellness for women, curated by The Pep Stop. Discover five considered collections and let a real person help you choose.",
    },
    "/about": {
      title: "About Us | The Pep Stop",
      description: "The story behind The Pep Stop: a health and beauty brand for women who value clear information, calm service, and being looked after.",
    },
    "/health-beauty": {
      title: "Beauty & Wellness | The Pep Stop",
      description: "Five considered collections, from weight and wellness to skin and beauty, explained in warm, plain language.",
    },
    "/education": {
      title: "Wellness Education | The Pep Stop",
      description: "Calm, plain-language reading on beauty, skincare, and everyday wellness from The Pep Stop.",
    },
    "/contact": {
      title: "Contact | The Pep Stop",
      description: "Reach The Pep Stop by message or phone. A real person will help you find what you are looking for.",
    },
    "/shop": {
      title: "Shop | The Pep Stop",
      description: "Shop premium beauty and wellness from The Pep Stop. Take your time, ask us anything, and a real person confirms your order.",
    },
    "/cart": { title: "Your Cart | The Pep Stop", description: "Review the items in your cart." },
    "/checkout": { title: "Checkout | The Pep Stop", description: "Enter your delivery details to place your order." },
    "/checkout/confirmation": { title: "Order Summary | The Pep Stop", description: "Send your order summary to The Pep Stop." },
    "/privacy": {
      title: "Privacy Policy | The Pep Stop",
      description: "How The Pep Stop handles personal information under the Data Privacy Act of 2012.",
    },
  } as Record<string, { title: string; description: string }>,
  titleSuffix: " | The Pep Stop",
  notFoundTitle: "Page not found | The Pep Stop",
  locale: "en_PH",
};
