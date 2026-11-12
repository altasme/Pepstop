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
    "The Pep Stop is a health, wellness, and beauty-focused business built around the idea that customers deserve clear information, convenient access, and attentive service.",
    "We bring together a selection of wellness-related products and resources in one place, helping customers explore their interests and find the information they need.",
    "Our goal is to create a shopping experience that feels approachable, organized, and personal.",
  ],
  mission:
    "To make exploring health, beauty, and wellness products a more informed and convenient experience through clear product information and attentive customer service.",
  vision:
    "To become a trusted destination for customers seeking a thoughtful approach to beauty, wellness, and product education.",
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
  { label: "Explore Collection", to: "/shop" },
  { label: "About Us", to: "/about" },
  { label: "Health & Beauty", to: "/health-beauty" },
  { label: "Wellness Journal", to: "/education" },
  { label: "Contact Us", to: "/contact" },
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
  announcement: "Discover a more thoughtful approach to wellness. We're here to help.",
  heroTitle: "Your Wellness Journey, Beautifully Considered.",
  heroSupport:
    "Explore a thoughtfully presented selection of health, beauty, and wellness products. Discover product information, review available options, and get the guidance you need to make informed decisions.",
  heroShop: { label: "Explore Our Collection", to: "/shop" },
  heroTalk: "Talk to Our Team",
  heroNote: "Wellness begins with understanding. We're here to make every detail clearer.",
  heroMatch: { lead: "Not sure where to start?", link: "Get matched" },
  heroCollectionsLabel: "Our collections",
  categoriesTitle: "Explore Our Collections",
  categoriesBody:
    "Discover a range of products and wellness-related offerings, organized to make exploring easier. Find what interests you, learn more about each item, and reach out whenever you need additional information.",
  categoryLink: "Explore Collection",
  matchName: "Pep Match",
  matchTitle: "Not sure where to start? Get matched.",
  matchBody: "is our personal touch. Tell us a little about what you are looking for and we will point you to the right collection, then look after availability, delivery, and payment with you directly. One message is all it takes.",
  matchCta: "Get matched",
  matchMessage: "Hi The Pep Stop, I would like help choosing a collection.",
  featuredTitle: "Featured Selections",
  featuredBody:
    "Take a closer look at selected products from The Pep Stop. Browse available options and explore the information provided for each item.",
  featuredAll: "View All Products",
  storyHeading: "More Than a Collection. A More Thoughtful Experience.",
  storyBody: [
    "At The Pep Stop, we believe that choosing wellness products should begin with clear information and thoughtful consideration.",
    "We're building a destination where customers can explore, ask questions, and understand the details behind the products they are interested in.",
    "From product information to customer assistance, we want every interaction to feel straightforward, personal, and well-informed.",
  ],
  storyPillars: [
    { title: "Thoughtful Selection", body: "A carefully organized collection with product details presented clearly." },
    { title: "Clear Information", body: "Straightforward product information, specifications, and available documentation." },
    { title: "Personal Assistance", body: "A real person ready to help with product inquiries and order-related questions." },
  ],
  storyLink: { label: "Get to Know Us", to: "/about" },
  whyTitle: "A Better Way to Explore Wellness",
  whyIntro:
    "Good customer experiences start with good information. We make it easier to explore our collection and get assistance whenever you need it.",
  whyItems: [
    { title: "Information at Your Fingertips", body: "Explore product details, available options, specifications, and supporting documentation in one convenient place." },
    { title: "Assistance When You Need It", body: "Have a question? Reach out to our team for help navigating product information and availability." },
    { title: "Clear and Straightforward", body: "We aim to present product information in a simple, organized, and easy-to-understand format." },
    { title: "Convenient Payment Options", body: "GCash, Maya, and bank transfer options are available. Payment arrangements are confirmed with you during order confirmation." },
  ],
  howTitle: "Simple, Convenient, and Personal",
  howIntro: "From browsing to order confirmation, we keep the process straightforward.",
  howSteps: [
    { title: "Explore", body: "Browse the collection and review the available product information and options." },
    { title: "Submit Your Order", body: "Add your selected items to your cart and provide your contact and delivery details." },
    { title: "Confirm With Our Team", body: "We'll review your submitted order and coordinate availability, delivery arrangements, and payment instructions with you." },
  ],
  howNote:
    "Submitting an order summary does not constitute payment or final order acceptance. Your order is confirmed once The Pep Stop has reviewed and acknowledged it.",
  approachTitle: "How we work",
  educationTitle: "Knowledge Is Part of Wellness",
  educationBody:
    "Being informed is an important part of making thoughtful choices. Explore helpful articles and general educational resources covering beauty, skincare, and wellness.",
  educationAll: "Explore Wellness Resources",
  contactTitle: "Have Questions? We're Here to Help.",
  contactBody:
    "Whether you need help understanding product information, checking availability, or following up on an order, our team is ready to assist.",
  contactPrimary: { label: "Contact The Pep Stop", to: "/contact" },
  contactSecondary: { label: "Browse Products", to: "/shop" },
};

/** Business strip on Home and Shop. Statements describe how we work; no delivery times or guarantees are promised. */
export const TRUST = [
  { id: "info", title: "Clear Product Information", body: "Explore available specifications, product options, and supporting documentation." },
  { id: "assist", title: "Personal Assistance", body: "Our team is available to help with general product inquiries and order questions." },
  { id: "order", title: "Straightforward Ordering", body: "Submit your order details and coordinate final confirmation directly with our team." },
  { id: "pay", title: "Convenient Payment Options", body: "GCash, Maya, and bank transfer are available, subject to confirmation." },
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
  { id: "informed-choices", title: "Informed Choices", body: "We believe customers should have access to clear product information and relevant documentation before making decisions." },
  { id: "transparency", title: "Transparency", body: "We aim to present available product details honestly and avoid claims that cannot be supported." },
  { id: "customer-care", title: "Customer Care", body: "We value personal assistance and strive to make every customer interaction helpful and respectful." },
  { id: "responsible-wellness", title: "Responsible Wellness", body: "We encourage thoughtful decisions and recognize the importance of qualified professional guidance when health-related questions arise." },
];

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const HEALTH_BEAUTY = {
  bannerEyebrow: "Health & Beauty",
  bannerTitle: "Discover What Matters to Your Wellness Journey.",
  bannerBody:
    "Explore our curated collections covering different areas of health, beauty, and wellness. Each collection offers an organized way to discover relevant products and access the information available for each one. Take your time, explore the details, and contact our team if you need assistance.",
  relatedLabel: "Related reading",
  shopCollection: "Explore Collection",
  disclaimerLead: "General information only.",
  closingTitle: "Need Help Finding What You're Looking For?",
  closingBody:
    "Our team can help you navigate the collection and locate available product information. Send us a message and we'll be happy to assist.",
  closingCta: "Talk to Our Team",
};

export const EDUCATION = {
  bannerEyebrow: "Wellness Journal",
  bannerTitle: "A Little More Knowledge Goes a Long Way.",
  bannerBody:
    "Explore easy-to-understand educational resources covering beauty, skincare, and general wellness. Our goal is to make useful information easier to explore, helping you ask better questions and make more informed decisions.",
  journalTitle: "The Wellness Journal",
  journalBody: "Thoughtful reads, useful information, and topics worth exploring.",
  empty: "Something Worth Reading Is Coming Soon.",
  emptyHint:
    "We're preparing more educational resources for you. In the meantime, feel free to contact our team with your general product questions.",
  emptyCta: "Contact Us",
  readMore: "Read Article",
  back: "Wellness Journal",
  updated: "Last updated",
};

export const ABOUT = {
  bannerEyebrow: "About us",
  bannerTitle: "Your Destination for Wellness, Beauty, and Informed Self-Care.",
  bannerBody: "A health, wellness, and beauty-focused business built on clear information, convenient access, and attentive service.",
  introTitle: "Our story",
  missionTitle: "Our Mission",
  visionTitle: "Our Vision",
  draftNote: "Draft copy, pending review by The Pep Stop.",
  valuesTitle: "What We Stand For",
  storyImageNote: "Our shop and our people",
  collectionsTitle: "Explore Our Collections",
  philosophyTitle: "Our philosophy",
  philosophy: [
    "Informed choices begin with clear information. We put product details and available documentation first, so the decisions you make are entirely your own.",
    "We aim to present available product details honestly and avoid claims that cannot be supported. If a question is about your health, we encourage you to speak with a qualified healthcare professional.",
  ],
  educationTitle: "Our commitment to customer education",
  education:
    "We share short, general educational resources on beauty, skincare, and wellness, and we are always glad to answer your questions. Our hope is that you leave every conversation a little more informed.",
  serviceTitle: "Our Approach to Customer Service",
  service:
    "Every customer deserves to feel heard and assisted. Whether you're exploring our collection, asking about product specifications, or checking on an order, we're here to help make the process easier.",
  closingCta: "Discover The Pep Stop Collection",
};

export const CONTACT_PAGE = {
  title: "We're Here to Make Things Easier.",
  body:
    "Have a question about our collection, product information, or an existing order? Reach out to The Pep Stop. We're happy to assist and help point you in the right direction.",
  hoursTitle: "Hours",
  channelsTitle: "Connect With Us",
  channelsBody: "Choose the contact method that works best for you.",
  phoneLabel: "Call Us",
  emailLabel: "Email Us",
  facebookLabel: "Find Us on Facebook",
};

export const SHOP = {
  bannerEyebrow: "Shop",
  bannerTitle: "Explore Our Products",
  bannerBody:
    "Browse our available collection and explore the details of each product. Compare listed options, review available specifications, and contact us if you need assistance before proceeding.",
  searchLabel: "Find a Product",
  searchPlaceholder: "Enter a product name...",
  categoryLabel: "Browse by Category",
  allCategories: "View All",
  sortLabel: "Sort Products",
  sorts: { featured: "Featured", name: "Product Name", priceLow: "Price: Lowest to Highest", priceHigh: "Price: Highest to Lowest" },
  results: (n: number) => `${n} ${n === 1 ? "Product" : "Products"} to Explore`,
  empty: "No products matched your search. Try another product name or clear your filters.",
  emptyStore: "Our Collection Is Being Updated.",
  emptyStoreHint: "We're preparing the product listings. Contact our team if you'd like to inquire about currently available offerings.",
  clear: "Reset Search",
  sampleBadge: "Sample",
  viewProduct: "View Product Details",
  sampleNote: "Sample slot. Product details, price, and photo to be supplied by The Pep Stop.",
  from: "From",
  addToCart: "Add to Cart",
  added: "Added to Your Cart.",
  viewCart: "Review Cart",
  chooseOption: "Select an Available Option",
  quantity: "Quantity",
  availability: { available: "Available", ask: "Inquire for Availability", unavailable: "Currently Unavailable" },
  askAbout: "Ask About This Product",
  priceOnRequest: "Contact Us for Pricing",
  productIntro:
    "Explore the available product information below, including listed options, specifications, packaging details, and supporting documents.",
  inquiryTitle: "Have a Question About This Product?",
  inquiryBody: "Need clarification about the listed information or availability? Contact our team before proceeding.",
  detailsTitle: "Product Overview",
  specsTitle: "Specifications",
  optionsTitle: "Available Options",
  packagingTitle: "Packaging Information",
  storageTitle: "Storage Information",
  documentsTitle: "Supporting Documents",
  coaTitle: "Certificate of Analysis",
  regLabel: "Reg. No.",
  notProvided: "Information to be provided by The Pep Stop.",
  back: "All Products",
  breadcrumbHome: "Home",
  assurance: [
    "Personal assistance from our team",
    "Delivery and payment confirmed with you",
    "Questions answered before you proceed",
  ],
  payWith: "Payment options",
  relatedTitle: "You May Also Explore",
  productDisclaimer:
    "Product information is provided for general informational purposes and should not be interpreted as medical advice, diagnosis, or treatment guidance. Product availability and permitted use depend on the applicable product classification and regulatory requirements. Consult a qualified healthcare professional for personal health concerns.",
};

export const CART = {
  title: "Your Shopping Cart",
  empty: "Your Cart Is Waiting.",
  emptyHint: "You haven't added any products yet. Explore our collection and review the available options.",
  continue: "Continue Exploring",
  checkout: "Continue to Checkout",
  remove: "Remove Item",
  subtotal: "Subtotal",
  shipping: "Delivery Fee",
  shippingTbc: "To be confirmed",
  priceTbc: "Contact Us for Pricing",
  total: "Estimated Total",
  item: "Product",
  price: "Price",
  qty: "Quantity",
  lineTotal: "Total",
  openCart: (n: number) => `Cart, ${n} ${n === 1 ? "item" : "items"}`,
  note: "Delivery charges and arrangements will be confirmed by The Pep Stop. Your displayed total is an estimate until product availability and delivery arrangements have been confirmed.",
  decrease: "Decrease quantity",
  increase: "Increase quantity",
};

/** Cash on delivery stays off until The Pep Stop confirms it is actually supported. */
export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", enabled: true },
  { id: "maya", label: "Maya", enabled: true },
  { id: "bank", label: "Bank Transfer", enabled: true },
  { id: "cod", label: "Cash on Delivery", enabled: false },
];

export const CHECKOUT = {
  title: "Complete Your Order Details",
  bannerBody:
    "Provide your contact and delivery information so our team can review your order and coordinate the next steps with you.",
  contactTitle: "Your Contact Details",
  addressTitle: "Where Should We Send Your Order?",
  paymentTitle: "Preferred Payment Method",
  paymentNote:
    "Choose your preferred payment method. Our team will provide the applicable payment instructions after reviewing and confirming your order.",
  notesTitle: "Additional Notes (Optional)",
  summaryTitle: "Order summary",
  place: "Submit Order Details",
  submitNote:
    "No payment is collected through this form. Submitting your details does not guarantee product availability or constitute final order acceptance. Our team will contact you to confirm the next steps.",
  consent:
    "I agree that The Pep Stop may use the information I provide to review and coordinate my order, in accordance with its Privacy Policy.",
  privacyLinkLabel: "Privacy Policy",
  emptyTitle: "Nothing to check out yet.",
  fields: {
    fullName: "Full Name",
    mobile: "Mobile Number",
    mobileHint: "Please provide an active mobile number so we can contact you regarding your order.",
    email: "Email Address (Optional)",
    street: "House Number and Street",
    barangay: "Barangay",
    city: "City or Municipality",
    province: "Province",
    postal: "Postal Code",
    notes: "Additional Notes (Optional)",
    notesPlaceholder: "Add any delivery-related instructions or questions for our team.",
    notesHint: "Please do not include medical history or sensitive health information.",
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
  title: "Thank You for Your Order Inquiry!",
  lead:
    "Your order summary has been prepared. Please send it to The Pep Stop so our team can review your selected items and coordinate availability, delivery, and payment arrangements.",
  stubNote:
    "Your order is not yet confirmed. Please send the summary to our team using your preferred contact channel. We'll review the details and get back to you with the next steps.",
  reference: "Order Reference",
  sendTitle: "One More Step to Complete Your Request",
  copy: "Copy Order Summary",
  copied: "Order summary copied successfully.",
  sendMessenger: "Send via Messenger",
  sendWhatsapp: "Send via WhatsApp",
  sendSms: "Send via SMS",
  deliverTo: "Delivery Information",
  payWith: "Preferred Payment Method",
  contactLabel: "Customer Information",
  none: "No Recent Order Found.",
  noneHint: "We couldn't find an order summary in this browser. You can return to the shop and start again.",
  messageIntro: "Hi The Pep Stop, I would like to place this order.",
};

export const NOT_FOUND = {
  title: "We Couldn't Find That Page",
  body: "The page may have moved or the link may be incorrect. Let's help you find your way back.",
  home: "Return to Homepage",
};

/* ------------------------------------------------------------------ */
/* Shared UI strings                                                   */
/* ------------------------------------------------------------------ */

export const UI = {
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuTitle: "Explore The Pep Stop",
  primaryNavLabel: "Primary",
  footerNavLabel: "Footer",
  mobileNavLabel: "Mobile",
  footerContactTitle: "Get in Touch",
  footerExploreTitle: "Explore",
  privacyLink: "Privacy Policy",
  footerShopTitle: "Explore",
  footerShopAll: "All Products",
  footerCompanyTitle: "About The Pep Stop",
  footerBrand: "The Pep Stop is your destination for wellness, beauty, and informed self-care. Explore our collection, discover helpful information, and connect with our team whenever you need assistance.",
  rights: "All rights reserved.",
  loading: "Preparing your selection...",
  error: "Something went wrong. Please try again.",
  footerHelpTitle: "Help",
  paymentsTitle: "Available Payment Methods",
  paymentsNote: "Payment arrangements are coordinated directly with our team after order review and confirmation.",
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
      description: "Explore a thoughtfully presented selection of health, beauty, and wellness products from The Pep Stop. Discover product information and get the guidance you need.",
    },
    "/about": {
      title: "About Us | The Pep Stop",
      description: "About The Pep Stop: a health, wellness, and beauty business built on clear information, convenient access, and attentive service.",
    },
    "/health-beauty": {
      title: "Beauty & Wellness | The Pep Stop",
      description: "Explore curated collections covering different areas of health, beauty, and wellness, organized so each product and its information is easy to find.",
    },
    "/education": {
      title: "Wellness Education | The Pep Stop",
      description: "Easy-to-understand educational resources covering beauty, skincare, and general wellness from The Pep Stop.",
    },
    "/contact": {
      title: "Contact | The Pep Stop",
      description: "Have a question about the collection, product information, or an order? Reach out to The Pep Stop.",
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
