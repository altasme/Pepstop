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
  logo: "/images/logo-320.webp" as null | string, // ★G2 closed 2026-11-11. Local path or Cloudinary id. null = PH-03 wordmark
  intro: [
    "The Pep Stop is a health, beauty and wellness shop built on a simple idea: you should know what you are buying, and be able to ask someone about it first.",
    "We bring wellness and beauty products together in one place, with the details of each one laid out clearly and a team you can message or call.",
    "We want shopping with us to feel easy, organized and personal.",
  ],
  mission:
    "To make buying health, beauty and wellness products easier, with clear product information and service from a real person.",
  vision:
    "To be the shop people trust for beauty and wellness, because we are clear about what we sell and glad to help.",
  missionStatus: "approved" as "draft" | "approved", // ★C1
};

export const CONTACT = {
  phoneDisplay: "0991 018 9669",
  phoneE164: "+639910189669",
  viber: false, // ★C4
  whatsapp: false, // ★C4
  email: null as null | string, // ★C2
  facebookUrl: null as null | string, // ★C3
  messengerUrl: "https://m.me/61594962883882" as null | string, // ★C3, m.me link (supplied 2026-11-14)
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
  { label: "View Products", to: "/shop" },
  { label: "About Us", to: "/about" },
  { label: "Health & Beauty", to: "/health-beauty" },
  { label: "Wellness Journal", to: "/education" },
  { label: "Contact Us", to: "/contact" },
];

/** Routes where the mobile sticky CTA bar is hidden (§9.8). */
export const STICKY_CTA_HIDDEN_ON = ["/account", "/contact", "/privacy", "/404", "/cart", "/checkout", "/checkout/confirmation", "/checkout/thank-you", "/account/orders"];

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

/** Hero slideshow. Slide 1 is the `hero` and `heroMobile` slots above (so the admin can still replace it); these follow it. Desktop 12:5, phone 6:5. */
export const HERO_SLIDES = [
  { desktop: "/images/hero-2-desktop.webp", mobile: "/images/hero-2-mobile.webp", alt: "Four women leaning together and smiling against a pale lavender backdrop", mobilePosition: "50% 30%" },
  { desktop: "/images/hero-3-desktop.webp", mobile: "/images/hero-3-mobile.webp", alt: "Four women embracing and smiling against a pale lavender backdrop", mobilePosition: "50% 30%" },
  { desktop: "/images/hero-4-desktop.webp", mobile: "/images/hero-4-mobile.webp", alt: "Four women in dark tops hugging and laughing against a pale lavender backdrop", mobilePosition: "50% 30%" },
];
/** Time each hero slide stays up, in milliseconds. */
export const HERO_INTERVAL_MS = 5000;

export const IMAGE_SLOTS = {
  hero: {
    id: "hero",
    ph: "PH-01",
    label: "Home hero, desktop (full bleed)",
    width: 2400,
    height: 1000,
    format: "JPG or WebP",
    src: "/images/hero-1-desktop.webp",
    alt: "Four women in black tops with their arms around each other, smiling against a pale lavender backdrop",
    direction: "Subject in the right 40 percent, a clean light area across the left 55 percent for the headline. Soft blush tones, natural light. No clinical imagery.",
  },
  heroMobile: {
    id: "heroMobile",
    ph: "PH-01",
    label: "Home hero, phone crop",
    width: 1200,
    height: 1000,
    format: "JPG or WebP",
    src: "/images/hero-1-mobile.webp",
    alt: "Four women in black tops with their arms around each other, smiling against a pale lavender backdrop",
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
    src: "/images/story.webp",
    alt: "Gift boxes printed with The Pep Stop logo stacked on a table, one open to show pink tissue",
    direction: "A real photograph of the shop, the team, or the packing table, supplied by the client. Real people and a real place; no stock models posing as staff.",
  },
  product: {
    id: "product",
    ph: "PH-09",
    label: "Product image",
    width: 1000,
    height: 1000,
    format: "JPG or WebP",
    src: "/images/product.webp",
    alt: "The Pep Stop gift box in raspberry pink with gold ribbon detail",
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
  announcement: "Questions before you order? Call or text us. We are happy to help.",
  heroTitle: "Feel good about *what you choose.*",
  heroSupport:
    "Discover thoughtfully presented beauty and wellness selections, with clear product details and personal assistance when you need it. Have a question? We're here to help you make an informed choice before you order.",
  heroShop: { label: "Explore The Pep Stop", to: "/shop" },
  heroTalk: "Talk to Our Team",
  heroNote: "Not sure what you need? Ask first. That is what we are here for.",
  heroMatch: { lead: "Not sure where to start?", link: "Get matched" },
  heroSlideshow: "Photo slideshow",
  heroPause: "Pause slideshow",
  heroPlay: "Play slideshow",
  heroGoTo: (n: number, total: number) => `Show photo ${n} of ${total}`,
  heroCollectionsLabel: "Our collections",
  categoriesTitle: "Shop by Collection",
  categoriesBody:
    "Five collections. Pick the one that fits what you need, or message us and we will point you to it.",
  categoryLink: "See the Collection",
  matchName: "Pep Match",
  matchTitle: "Not sure what you're looking for? Let Pep Match guide you.",
  matchBody: [
    "Finding the right collection starts with a conversation. Tell us what you have in mind, and our team will help you explore the available options and guide you through the next steps. We'll assist with availability, delivery, and payment details directly.",
    "Just send us a message. We'll take it from there.",
  ],
  matchCta: "Get matched",
  matchMessage: "Hi The Pep Stop, I would like help choosing a collection.",
  featuredTitle: "Featured Picks",
  featuredBody:
    "A few products we would point you to first. Open one to see the options and details.",
  featuredAll: "See All Products",
  storyHeading: "More clarity. More confidence. A more personal experience.",
  storyBody: [
    "Choosing beauty and wellness products should feel straightforward, not uncertain.",
    "At The Pep Stop, we make it easier to explore your options with product information presented clearly. Browse available selections, review product details, and access supporting documents where available. If you need clarification, our team is here to help before you place an order.",
    "And when you're ready, you won't be left figuring things out on your own. Every order is personally reviewed, with our team coordinating availability, delivery arrangements, and payment instructions directly with you.",
  ],
  storyPillars: [
    { title: "Easy to Explore", body: "Browse thoughtfully organized collections and discover available selections with ease." },
    { title: "Details You Can Review", body: "Find product options, specifications, usage information where applicable, and supporting documents where available." },
    { title: "Personal Assistance", body: "Have a question about a product or order? Talk directly with our team through message or phone." },
  ],
  storyPillarsTitle: "A better way to shop",
  storyLink: { label: "About The Pep Stop", to: "/about" },
  whyTitle: "A more thoughtful way to shop.",
  whyIntro:
    "We believe a good shopping experience starts with clear information and people you can actually talk to. At The Pep Stop, we make it easier to explore your options, get answers, and know what to expect before placing an order.",
  whyItems: [
    { title: "Clear Product Information", body: "Explore product options, specifications, and available supporting documents in one convenient place." },
    { title: "We're Here to Help", body: "Need more information? Reach out to our team for assistance with product details, order inquiries, and availability." },
    { title: "Transparency Comes First", body: "We share the information available to us and are upfront whenever details or supporting documents are unavailable. No unnecessary promises, just clarity." },
    { title: "Convenient Payment Options", body: "Choose from available e-wallet and bank transfer options. Once your order details are confirmed, we'll send the appropriate payment instructions directly." },
  ],
  howTitle: "How ordering works",
  howIntro: "Three steps from browsing to your door.",
  howSteps: [
    { title: "Browse", body: "Pick a collection and check the details and options." },
    { title: "Check Out & Pay", body: "Add items to your cart, enter your delivery details, pay, and upload a screenshot of your payment." },
    { title: "We Ship", body: "Once we have checked your payment, we pack your order and send it to you." },
  ],
  approachTitle: "How we work",
  educationTitle: "Read before you buy",
  educationBody:
    "Short, plain-language articles on beauty, skincare and everyday wellness. General information only.",
  educationAll: "Read the Journal",
  contactTitle: "We're Here to Help",
  contactBody:
    [
    "Have a question or need a little more information? Whether you'd like to learn more about a product, check availability, or get an update on your order, our team is just a message or call away.",
    "Reach out and tell us what you need. Share your name and inquiry, and we'll be happy to assist you.",
  ],
  contactPrimary: { label: "Contact Us", to: "/contact" },
  contactSecondary: { label: "Browse Products", to: "/shop" },
};

/** Business strip on Home and Shop. Statements describe how we work; no delivery times or guarantees are promised. */
export const TRUST = [
  { id: "info", title: "Clear Details", body: "Options, protocols and documents, where we have them." },
  { id: "assist", title: "A Real Person", body: "Questions about a product or an order? Just ask." },
  { id: "order", title: "Simple Ordering", body: "Send your order and we confirm it with you directly." },
  { id: "pay", title: "Pay Your Way", body: "E-wallet or bank transfer. Details sent once we confirm your order." },
];

export type FocusArea = { id: string; title: string; tagline: string; summary: string; order: number; image: string | null };

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: "weight-wellness",
    title: "Weight & Wellness",
    tagline: "Explore wellness-related selections with clarity.",
    summary:
      "Discover a collection of products presented with clear specifications and available supporting information. Take your time exploring each option, and reach out to our team if you have questions before placing an order.",
    order: 1,
    image: "/images/collection-weight-wellness.webp",
  },
  {
    id: "next-generation-wellness",
    title: "Next-Generation Wellness",
    tagline: "Explore emerging areas of wellness and research.",
    summary:
      "Stay curious about new developments and emerging wellness-related products. We make the available product information easier to understand, so you can explore the details, ask questions, and make informed decisions without the hype.",
    order: 2,
    image: "/images/collection-next-generation-wellness.webp",
  },
  {
    id: "skin-beauty",
    title: "Skin & Beauty",
    tagline: "Thoughtful selections for your beauty routine.",
    summary:
      "Explore products for skin and beauty, with information presented to help you understand what each selection offers. Whether you know exactly what you're looking for or need a little guidance, our team is here to help.",
    order: 3,
    image: "/images/collection-skin-beauty.webp",
  },
  {
    id: "vitality-cellular-health",
    title: "Vitality & Cellular Health",
    tagline: "For the curious, the detail-oriented, and the well-informed.",
    summary:
      "Explore products associated with cellular health and wellness. We put available specifications and supporting documentation front and center, so you can review the information, ask questions, and make your own informed decisions.",
    order: 4,
    image: "/images/collection-vitality-cellular-health.webp",
  },
  {
    id: "energy-cellular-wellness",
    title: "Energy & Cellular Wellness",
    tagline: "Discover more about products in this growing field.",
    summary:
      "Explore a selection of products associated with energy and cellular wellness. Every product deserves a closer look, so we present available details clearly and provide personal assistance when you need help understanding your options.",
    order: 5,
    image: "/images/collection-energy-cellular-wellness.webp",
  },
];

export const VALUES = [
  { id: "informed-choices", title: "Informed Choices", body: "We believe good decisions start with clear information. That's why we make product details and available documentation accessible, giving you the opportunity to review the facts and make choices with confidence." },
  { id: "transparency", title: "Honesty", body: "Trust begins with transparency. We share what we know, provide information we can stand behind, and avoid making claims or promises that we cannot substantiate." },
  { id: "customer-care", title: "Real Service", body: "Every customer deserves personal attention. Whether you're asking a question, exploring product details, or following up on an order, a real person is here to listen, assist, and make your experience as smooth as possible." },
  { id: "responsible-wellness", title: "Responsible Wellness", body: "Your well-being matters. We encourage informed and responsible choices, and recommend consulting a qualified healthcare professional for questions about your health. The information we provide is for general informational purposes only and is not a substitute for professional medical advice." },
];

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const HEALTH_BEAUTY = {
  bannerEyebrow: "Health & Beauty",
  bannerTitle: "Five Collections, One Place.",
  bannerBody:
    "Health, beauty and wellness, organized into collections so you can find what you need. Read the details at your own pace, and message us if you would like a hand.",
  relatedLabel: "Related reading",
  shopCollection: "See the Collection",
  disclaimerLead: "General information only.",
  closingTitle: "Cannot find what you are after?",
  closingBody:
    "Tell us what you have in mind and we will point you to the right collection or product.",
  closingCta: "Talk to Us",
};

export const EDUCATION = {
  bannerEyebrow: "Wellness Journal",
  bannerTitle: "Good to Know.",
  bannerBody:
    "Short, plain-language reads on beauty, skincare and everyday wellness. They help you ask better questions. They do not replace advice from a professional.",
  journalTitle: "The Wellness Journal",
  journalBody: "Plain-language reads on beauty, skincare and wellness.",
  empty: "New articles are on the way.",
  emptyHint:
    "In the meantime, send us any product questions and we will help.",
  emptyCta: "Contact Us",
  readMore: "Read article",
  back: "Wellness Journal",
  updated: "Last updated",
};

export const ABOUT = {
  bannerEyebrow: "About us",
  bannerTitle: "Beauty and wellness, minus the guesswork.",
  bannerBody: "The Pep Stop is a health, beauty and wellness shop that puts clear information and real service first.",
  introTitle: "Our story",
  missionTitle: "Our Mission",
  visionTitle: "Our Vision",
  draftNote: "Draft copy, pending review by The Pep Stop.",
  valuesTitle: "What We Stand For",
  storyImageNote: "Our shop and our people",
  collectionsTitle: "Shop the collections",
  philosophyTitle: "Our Philosophy",
  philosophy: [
    "We believe informed choices start with clear information. That's why we put product details and available documentation first, giving you the opportunity to review the facts and make decisions with confidence.",
    "We're committed to sharing information we can stand behind. When a question involves your health or medical needs, we encourage you to seek guidance from a qualified healthcare professional.",
  ],
  educationTitle: "Why We Share Articles",
  education:
    [
    "Good decisions begin with better understanding. We share easy-to-read articles on beauty, skincare, and general wellness to help make information more accessible and conversations more meaningful.",
    "Whether you're exploring a topic or simply curious to learn more, our goal is to leave you with something useful and a little more knowledge than you had before.",
  ],
  serviceTitle: "How We Look After Our Customers",
  service:
    [
    "A good customer experience should feel personal from start to finish. Whether you're browsing our selections, asking about product specifications, or following up on an order, our team is here to assist.",
    "No complicated process or unanswered messages. Just real people ready to listen, provide the information available, and help you through the next steps. Reach us through message or phone whenever you need us.",
  ],
  closingCta: "See the Collections",
};

export const CONTACT_PAGE = {
  title: "Talk to us.",
  body:
    "Questions about a product, an order or how it all works? Call, text or send a message and we will help you out.",
  hoursTitle: "Hours",
  channelsTitle: "Reach us directly",
  channelsBody: "Pick whichever is easiest for you.",
  phoneLabel: "Call Us",
  emailLabel: "Email Us",
  facebookLabel: "Find Us on Facebook",
  formTitle: "Send us a message",
  formBody: "Leave your details and your question, and our team will reply.",
  formName: "Your Name",
  formPhone: "Mobile Number",
  formEmail: "Email Address (Optional)",
  formSubject: "Subject",
  formMessage: "Your Message",
  formHint: "Please do not include medical history or sensitive health information.",
  formSend: "Send Message",
  formSending: "Sending...",
  formSent: "Thanks, we got your message and will reply soon.",
  formError: "That did not go through. Check your details and try again, or contact us directly.",
};

export const SHOP = {
  bannerEyebrow: "Shop",
  bannerTitle: "Our Products",
  bannerBody:
    "Browse by collection, compare options and read the details of each product. Message us if you would like help before you order.",
  searchLabel: "Search products",
  searchPlaceholder: "Search by product name",
  categoryLabel: "Collection",
  allCategories: "All",
  sortLabel: "Sort by",
  sorts: { featured: "Featured", name: "Product Name", priceLow: "Price: Lowest to Highest", priceHigh: "Price: Highest to Lowest" },
  results: (n: number) => `${n} ${n === 1 ? "product" : "products"}`,
  empty: "Nothing matched that search. Try a different name or clear the filters.",
  emptyStore: "New products are on the way.",
  emptyStoreHint: "Message us if you would like to know what is available right now.",
  clear: "Clear search",
  sampleBadge: "Sample",
  viewProduct: "View details",
  sampleNote: "Sample slot. Product details, price, and photo to be supplied by The Pep Stop.",
  from: "From",
  addToCart: "Add to Cart",
  added: "Added to your cart.",
  viewCart: "View cart",
  chooseOption: "Choose an option",
  quantity: "Quantity",
  availability: { available: "Available", ask: "Ask us about availability", unavailable: "Unavailable right now" },
  askAbout: "Ask About This Product",
  priceOnRequest: "Ask us for the price",
  productIntro:
    "Options, protocol, packaging and documents are listed below.",
  inquiryTitle: "Questions about this product?",
  inquiryBody: "Ask us before you order. We will help with the details and availability.",
  detailsTitle: "Overview",
  protocolTitle: "Protocol",
  optionsTitle: "Options",
  packagingTitle: "Packaging",
  storageTitle: "Storage",
  documentsTitle: "Documents",
  coaTitle: "Certificate of Analysis",
  compositionTitle: "Contents",
  notesTitle: "Notes",
  coaOpen: "Open document",
  batchLabel: "Batch or lot",
  regLabel: "Reg. No.",
  notProvided: "Details to follow.",
  back: "All Products",
  breadcrumbHome: "Home",
  assurance: [
    "A real person to help you",
    "We confirm delivery and payment with you",
    "Ask before you order",
  ],
  payWith: "Pay with",
  relatedTitle: "You may also like",
};

export const MY_ORDERS = {
  nav: "My Orders",
  title: "My Orders",
  lead: "Every order you have placed, with its status and history.",
  empty: "You have not placed an order yet.",
  emptyCta: "Browse products",
  loadError: "We could not load your orders. Please try again.",
  retry: "Try again",
  orderLabel: "Order",
  placed: "Placed",
  items: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
  view: "View details",
  back: "All orders",
  itemsTitle: "Items",
  deliveryTitle: "Delivery",
  paymentTitle: "Payment",
  historyTitle: "Order history",
  subtotal: "Subtotal",
  delivery: "Delivery",
  deliveryTbc: "Confirmed by The Pep Stop",
  total: "Total",
  notFound: "We could not find that order.",
  payNow: "Upload proof of payment",
  help: "Questions about an order? Message us and quote the order number.",
  /** Customer wording for each order status. */
  status: {
    new_order: "Order received",
    under_review: "Being reviewed",
    awaiting_payment: "Waiting for payment",
    payment_submitted: "Payment received, being checked",
    payment_verified: "Payment confirmed",
    processing: "Preparing your order",
    ready_for_dispatch: "Ready to ship",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
    payment_rejected: "Payment could not be confirmed",
  } as Record<string, string>,
  awaitingProof: "Waiting for your proof of payment",
  cod: "Pay in cash on delivery",
};

export const CART = {
  title: "Your Cart",
  empty: "Your cart is empty.",
  emptyHint: "Browse the collections and add what you like.",
  continue: "Keep Browsing",
  checkout: "Checkout",
  remove: "Remove",
  subtotal: "Subtotal",
  shipping: "Delivery",
  shippingTbc: "We will confirm",
  shippingChoose: "Chosen at checkout",
  priceTbc: "Ask us for the price",
  total: "Estimated Total",
  item: "Product",
  price: "Price",
  qty: "Quantity",
  lineTotal: "Total",
  openCart: (n: number) => `Cart, ${n} ${n === 1 ? "item" : "items"}`,
  decrease: "Decrease quantity",
  increase: "Increase quantity",
};

/**
 * Starting list for the prerendered pages. The administrator manages the real list (Payments and delivery in the admin);
 * the site replaces this with it as soon as the page loads.
 */
export const PAYMENT_METHODS: { id: string; label: string; enabled: boolean }[] = [
  { id: "gcash", label: "GCash", enabled: true },
  { id: "bpi", label: "BPI", enabled: true },
];

export const CHECKOUT = {
  title: "Your Details",
  bannerBody:
    "Tell us how to reach you and where to deliver. We will review your order and confirm the next steps with you.",
  contactTitle: "Contact",
  addressTitle: "Delivery address",
  requiredNote: "Fields marked * are required.",
  summaryJump: (n: number, total: string) => `Order summary: ${n} ${n === 1 ? "item" : "items"}, ${total}`,
  deliveryTitle: "Delivery",
  deliveryNote: "Pick the area that matches your address. We confirm the final delivery arrangements with you.",
  deliveryFree: "Free",
  deliveryFreeAbove: (min: string) => `Free delivery on orders of ${min} or more.`,
  deliveryChoose: "Choose a delivery option.",
  paymentTitle: "How would you like to pay?",
  paymentNote:
    "Pick the one you prefer. We will send the payment instructions once we have reviewed and confirmed your order.",
  notesTitle: "Notes (optional)",
  summaryTitle: "Order summary",
  place: "Place Order",
  submitNote:
    "You will not be charged here. If you pay online, you will see how to pay after you place your order, then upload a screenshot of your payment. With cash on delivery you pay when your order arrives. Your order is confirmed once we have checked it.",
  consent:
    "I agree that The Pep Stop may use the information I provide to process my order, as described in its Privacy Policy.",
  privacyLinkLabel: "Privacy Policy",
  emptyTitle: "Nothing to check out yet.",
  fields: {
    fullName: "Full Name",
    mobile: "Mobile Number",
    mobileHint: "Use a mobile number we can reach you on about your order.",
    accountHint: "From your account. We will use this number for your order.",
    email: "Email Address (Optional)",
    street: "House Number and Street",
    barangay: "Barangay",
    city: "City or Municipality",
    province: "Province",
    postal: "Postal Code",
    notes: "Additional Notes (Optional)",
    notesPlaceholder: "Delivery instructions or questions for our team.",
    notesHint: "Please do not include medical history or sensitive health information.",
  },
  errors: {
    required: "This field is required.",
    mobile: "Enter a valid Philippine mobile number, for example 0991 018 9669.",
    email: "Enter a valid email address.",
    postal: "Enter a 4 digit postal code.",
    payment: "Choose a payment method.",
    delivery: "Choose a delivery option.",
    consent: "Please tick the box to continue.",
    summary: "Please fix the highlighted fields.",
    server: "We could not send your order. Check your connection and try again, or contact us directly.",
    rate: "You have sent a few orders in a short time. Please wait a bit, or contact us directly.",
  },
};

export const CONFIRMATION = {
  title: "One more step: pay and upload your proof.",
  lead:
    "Your order is saved. Pay using the details below, then upload a screenshot of your payment. Your order goes to our team as soon as it is uploaded.",
  stubNote:
    "Questions about your order? Contact us and quote your order reference.",
  reference: "Order Reference",
  sendTitle: "Need help?",
  copy: "Copy Order Summary",
  copied: "Copied.",
  sendMessenger: "Send via Messenger",
  sendWhatsapp: "Send via WhatsApp",
  sendSms: "Send via SMS",
  deliverTo: "Delivery Information",
  payWith: "Preferred Payment Method",
  contactLabel: "Customer Information",
  none: "No recent order found.",
  noneHint: "There is no order summary in this browser. You can go back to the shop and start again.",
  messageIntro: "Hi The Pep Stop, I would like to place this order.",
  payHow: "How to pay",
  payScan: "Scan to pay",
  payAccountName: "Account name",
  payAccountNumber: "Account number",
  payTotal: "Amount to pay",
  awaitingTitle: "You have an order waiting for payment.",
  awaitingLink: "Pay and upload proof",
  deliveryLabel: "Delivery",
  payTitle: "Upload your proof of payment",
  payBody: "Upload a screenshot of your payment. You need to do this for your order to reach our team. We check every payment by hand, and your order is confirmed once we have.",
  payProof: "Screenshot of your payment (image, up to 5 MB)",
  paySubmit: "Upload proof of payment",
  paySent: "Thank you. We received your proof of payment. Our team will check it and confirm your order.",
  payError: "That did not go through. Check the details and try again, or message us instead.",
  payNeed: "Please choose a screenshot to upload.",
};

export const THANKS = {
  title: "Thank you for your order!",
  lead: "We have your proof of payment. Our team will check it and confirm your order.",
  leadCod: "Your order is placed. You pay in cash when it arrives. Our team will confirm your order and delivery details.",
  orderLabel: "Your order number",
  stepTitle: "One last thing",
  step: "Take a screenshot of this page and send it to The Pep Stop on Messenger. It helps us find your order quickly.",
  messenger: "Send it on Messenger",
  copy: "Copy order number",
  copied: "Copied",
  shop: "Back to Products",
  noOrder: "Your order has been received.",
};

export const ACCOUNT = {
  title: "Log in to view products",
  intro: "Products and prices are for registered customers. Log in, or create an account and message us so we can approve it.",
  explain: "Want to ask something first?",
  explainLink: "Talk to us",
  loginTab: "Login",
  registerTab: "Create an Account",
  phone: "Phone Number",
  phoneHint: "Your Philippine mobile number, for example 0917 123 4567.",
  password: "Password",
  fullName: "Full Name",
  createPassword: "Create Password",
  confirmPassword: "Confirm Password",
  show: "Show",
  hide: "Hide",
  loginButton: "Log In",
  registerButton: "Create Account",
  working: "Please wait...",
  privacyLead: "Privacy notice: we use your name and mobile number to review your account request and to contact you about your orders. Your password is stored in a form we cannot read. See our",
  privacyLink: "Privacy Policy",
  consent: "I understand how my information will be used.",
  doneTitle: "Your account is created.",
  contactLead: "Tell us you have signed up:",
  contactMessenger: "Message us on Messenger",
  contactWhatsapp: "Message us on WhatsApp",
  contactPhone: "Call us",
  backToLogin: "Back to Login",
  pendingTitle: "Your account is awaiting approval",
  pendingBody: "Message or call us to say you have signed up, and we will review your account. You can log in as soon as it is approved.",
  rejectedTitle: "Your registration was not approved",
  rejectedBody: "We could not approve this account. Contact us if you have questions.",
  suspendedTitle: "Your access has been suspended",
  suspendedBody: "Catalog access is switched off for this account right now. Please contact us.",
  reasonLabel: "Note from The Pep Stop",
  errors: {
    invalid_credentials: "That phone number or password is not correct.",
    locked: "Too many incorrect attempts. Please wait 15 minutes and try again.",
    too_many_attempts: "Too many attempts. Please wait a few minutes and try again.",
    too_many_requests: "Too many attempts. Please wait a few minutes and try again.",
    phone_in_use: "An account with that phone number already exists. Try logging in instead.",
    invalid_phone: "Enter a valid Philippine mobile number, for example 0917 123 4567.",
    name_required: "Please enter your full name.",
    password_mismatch: "The two passwords do not match.",
    weak_password: "Use at least 8 characters, with letters and numbers.",
    consent_required: "Please confirm that you understand how your information will be used.",
    generic: "Something went wrong. Please check your details and try again.",
  } as Record<string, string>,
  logout: "Log Out",
  login: "Log In",
  checking: "Checking your account...",
  accountLink: "Account",
};

export const COA = {
  title: "Certificates of Analysis",
  body: "Search by product name or batch or lot number, then open a document to view or download the PDF.",
  searchLabel: "Search by product or batch number",
  searchPlaceholder: "Product name or batch number",
  results: (n: number) => `${n} ${n === 1 ? "document" : "documents"}`,
  empty: "No published documents match your search.",
  emptyAll: "No certificates have been published yet.",
  product: "Product",
  batch: "Batch or lot",
  open: "Open PDF",
  link: "Certificates of Analysis",
};

export const NOT_FOUND = {
  title: "We could not find that page.",
  body: "It may have moved, or the link may be wrong. Let us get you back on track.",
  home: "Back to Home",
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
  footerShopTitle: "Explore",
  footerShopAll: "All Products",
  footerCompanyTitle: "The Pep Stop",
  footerBrand: "The Pep Stop brings beauty and wellness selections together with clear product information and personal assistance. Explore at your own pace, ask questions, and let our team guide you through the ordering process.",
  rights: "All rights reserved.",
  socials: [] as { label: string; href: string }[],
  loading: "Loading...",
  error: "Something went wrong. Please try again.",
  footerHelpTitle: "Help",
  paymentsTitle: "Payment methods",
  paymentsNote: "We send payment instructions once we have confirmed your order.",
  collectionsBarLabel: "Collections",
  disclaimer:
    "Information on this website is provided for general informational purposes only and is not a substitute for professional medical advice. Product details and permitted uses should be reviewed in accordance with applicable requirements. For personal health concerns, consult a qualified healthcare professional.",
  articleDisclaimer:
    "Information on this website is provided for general informational purposes only and is not a substitute for professional medical advice. For personal health concerns, consult a qualified healthcare professional.",
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
        "This website does not set advertising cookies. We use one sign-in cookie, only after you log in to your customer account, to keep you signed in.",
        "To view our private product catalog you create an account with your full name, mobile number, and a password. We keep your password only in a scrambled form that we cannot read. We use your name and mobile number to decide whether to approve your account and to contact you about your orders. We have not verified that the mobile number belongs to you.",
        "When you place an order, we save your order, the delivery address and notes you type, your chosen payment method, and any payment reference or payment screenshot you choose to send. Your cart is kept in your own browser until you submit it.",
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
        "Your messages, account details, and orders are visible to The Pep Stop staff who handle them, and to the messaging or phone provider you use to contact us. Our website is hosted on Cloudflare. We do not sell your personal information.",
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
  registrationFallback: "",
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
      description: "Health, beauty and wellness products from The Pep Stop, with the details laid out for each one and a real person to help you order.",
    },
    "/about": {
      title: "About Us | The Pep Stop",
      description: "The Pep Stop is a health, beauty and wellness shop that puts clear product information and real service first.",
    },
    "/health-beauty": {
      title: "Beauty & Wellness | The Pep Stop",
      description: "Five health, beauty and wellness collections from The Pep Stop, organized so the product you want is easy to find.",
    },
    "/education": {
      title: "Wellness Education | The Pep Stop",
      description: "Short, plain-language articles on beauty, skincare and everyday wellness from The Pep Stop.",
    },
    "/contact": {
      title: "Contact | The Pep Stop",
      description: "Questions about a product or an order? Call, text or message The Pep Stop.",
    },
    "/shop": {
      title: "Shop | The Pep Stop",
      description: "Beauty and wellness products from The Pep Stop. Ask us anything, and a real person confirms your order.",
    },
    "/cart": { title: "Your Cart | The Pep Stop", description: "Review the items in your cart." },
    "/checkout": { title: "Checkout | The Pep Stop", description: "Enter your delivery details to place your order." },
    "/account/orders": { title: "My Orders | The Pep Stop", description: "Your orders and their status." },
    "/checkout/thank-you": { title: "Thank You | The Pep Stop", description: "Your order has been received." },
    "/checkout/confirmation": { title: "Order Summary | The Pep Stop", description: "Send your order summary to The Pep Stop." },
    "/account": { title: "View Products | The Pep Stop", description: "Log in or create an account to see products and prices." },
    "/coa": { title: "Certificates of Analysis | The Pep Stop", description: "Search published certificates of analysis by product name or batch number." },
    "/privacy": {
      title: "Privacy Policy | The Pep Stop",
      description: "How The Pep Stop handles personal information under the Data Privacy Act of 2012.",
    },
  } as Record<string, { title: string; description: string }>,
  titleSuffix: " | The Pep Stop",
  notFoundTitle: "Page not found | The Pep Stop",
  locale: "en_PH",
};
