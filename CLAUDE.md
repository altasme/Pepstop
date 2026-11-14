# CLAUDE.md: The Pep Stop (Health & Beauty Website + Client-Managed Unlisted Catalog)

> Build spec. **Single source of instruction for this build.** When this file and any other document conflict (including the ALTAVENTURES "Website Development Build Specification" it replaces), **this file wins**: note the conflict in `HANDOVER.md` §9, proceed.
> **Client:** The Pep Stop · **Builder:** Altaventures Business Development Services
> **One line:** A premium health and beauty brand site (Phase 1) plus a client-managed, unlisted product catalog with documentation and COA directory (Phase 2, PRO).
> **Scope: Phase 1 only.** Static, prerendered, no backend, chat and phone conversion. Phase 2A (admin + catalog + inquiry form) and Phase 2B (COA directory) are reserved in §16. Do not build Phase 2 now.
> **Content ownership:** Altaventures builds the platform. All product listings, descriptions, documents, COAs, and their regulatory status are entered and owned by The Pep Stop (§12, Appendix B.1).

**v1.35 · 2026-11-14**: Hero photograph quality. The three desktop hero files are now the supplied files byte for byte (they had been re-encoded at lower quality, which softened faces by about 10 percent on a sharpness measure), and the phone crops are cut at native size from the originals with no upscaling and a higher quality setting. The softness that remains is in the supplied photographs themselves (smooth, waxy skin and low native resolution for a 12:5 banner). Where earlier entries differ, this entry wins.
**v1.34 · 2026-11-14**: Hero transition refined ("more elegant, and make that 5s"). Each slide now stays up 5 seconds (`HERO_INTERVAL_MS` 5000). The change is a slow 1.8 second fade on a soft ease while the incoming photograph settles from a 4.5 percent zoom over 6.5 seconds, and the outgoing one drifts back out as it leaves, so the two overlap in continuous motion instead of a flat dissolve. It uses opacity and transform only and is switched off under reduced motion. Where earlier entries differ, this entry wins.
**v1.33 · 2026-11-14**: Hero slideshow ("add this to the hero, autoplay every 4 seconds"). The client supplied four wide hero photographs; the pink skincare portrait was dropped by direction, so three slides remain: the original five-women photograph, four women on a pale wall, and five women on a warm peach wall (`public/images/hero-{1,2,3}-{desktop,mobile}.webp`; the desktop files ship as supplied at 12:5 and the phone files are 6:5 crops cut on the group). The slides crossfade over one second and advance every 4 seconds (`HERO_INTERVAL_MS`). Pause and play button plus one dot per slide (44px targets) sit over the photograph, because moving content needs a stop control; a manual pick restarts the 4 second timer, the timer skips while the tab is hidden, and autoplay is off for visitors who ask for reduced motion. All slides are in the prerendered page (first one high priority), so the first paint is unchanged; slide 1 still honours the admin's hero image setting. The headline, sparkles and pointer depth are unchanged. Origin and licence of the new photographs are for the client to confirm (§6, §12.6). Where earlier entries differ, this entry wins.
**v1.32 · 2026-11-14**: Admin panel interface redesign ("a better, more modern and professional UI for the admin"). Operate mode: calm, light and precise, with the brand held in the details. Sidebar: narrower, stroke icons (one weight) on every item, active item as a tinted pill with a gold icon, gold count badges, a "View website" link, and a user block with avatar initial and a log out icon button; on phones it becomes a compact top bar with a Menu button. Headings switch from the display serif to the sans (the serif stays for the wordmark and the sign-in headline) in ink rather than claret, so colour is reserved for actions, the active item and status. Cards 14px radius with a neutral hairline; buttons and fields 10px radius and 40px high on pointer devices (44px on touch); tables with a quiet header, subtle row hover and dot-style status badges; focus rings and field borders keep AA contrast. Dashboard lists (latest orders, registrations, activity) are two-line rows with the figure and date at the right. Fixed along the way: a broken row-hover rule in tables, and on phones the header no longer stretches to fill the screen. Where earlier entries differ, this entry wins.
**v1.31 · 2026-11-14**: Brand refinement and token architecture ("better, more premium, more expertly coded branding colors and fonts"). By direction this supersedes the colour values in v1.3, v1.5, v1.6 and the type notes in §3 and §6. One token file, `src/styles/tokens.css`, now holds every colour (as RGB channels), font, radius, shadow and easing for both the public site and the admin; Tailwind and `admin.css` read it, so the two cannot drift and no component carries a hex value. Palette (still taken from the logo): warm ivory page ground with white reserved for cards, inputs and tables; a deeper lacquer rouge for action (#B2123F, was #C30239); oxblood dark ground (#4E0E1F); dusty blush panels; antique gold for hairlines and sparkles; all text pairs re-measured at AA or better (white on rouge 6.9, ink on ground 17.2, edge on surface 4.6). Fonts: Bodoni Moda and Hanken Grotesk as variable fonts, latin subset, two files (about 81 KB) in place of six; the display face's optical-size axis is pinned at 14 because on auto it draws a poster hairline that is fragile on phones; lining and tabular figures where numbers align; no global tabular figures in running text. Theme colour of the site and admin updated. Details in DESIGN.md. Where earlier entries differ, this entry wins.
**v1.30 · 2026-11-14**: Thank you page and Messenger link ("after placing order there should be a thank you page ... screenshot and send it to the Pep Stop: m.me/61594962883882"). The Messenger link is supplied (★C3 partly closed: Facebook Page URL still open), so `CONTACT.messengerUrl` is `https://m.me/61594962883882`; by the §8 rules this turns Messenger on as the primary contact button across the site (header "Message Us", hero, Contact, footer), and the admin registration-contact setting is filled with the same link where it was empty (migration 0006). New private page `/checkout/thank-you` (noindex, no sticky bar): large order number, copy button, the instruction to take a screenshot of the page and send it to The Pep Stop on Messenger, a Messenger button and a link back to Products. Flow: Place Order, pay with the QR, upload the payment screenshot, then the thank you page (the order reaches the admin at the upload, v1.28). Also fixed: the order page left an unread 401 response open, so automated page-load checks never saw the page go idle. Where earlier entries differ, this entry wins.
**v1.29 · 2026-11-14**: Two customer-facing notices removed by explicit direction: the certificate of analysis note ("a supplier document, not proof of product approval, safety, effectiveness, or authorization for sale", on product pages and the Certificates page) and the product information disclaimer ("general informational purposes ... diagnosis, or treatment guidance ... consult a qualified healthcare professional", at the foot of product pages). The site-wide footer notice (general information, not a substitute for professional medical advice) and the Privacy and article text are unchanged. The audit exemption for the phrase "diagnosis, or treatment guidance" is now unused. Where earlier entries differ, this entry wins.
**v1.28 · 2026-11-14**: Order and payment flow ("Place order"; proof of payment required; orders show in the admin only once paid or proof uploaded). Checkout button reads Place Order. After placing, the customer sees how to pay and must upload a screenshot of the payment (image, up to 5 MB); the payment reference number field is gone and the Worker refuses a payment record without a file. An order reaches the administrator only when it has a payment record (proof uploaded) or is already paid: the admin order list, order detail, customer profile order list, dashboard and the Orders badge and new-order notice all exclude orders still waiting for proof, and the badge now counts orders waiting for review (the separate payments count stays 0 so one order does not notify twice). A customer who leaves before uploading is not lost: `GET /api/customer/orders/awaiting-payment` returns their latest unpaid order, the confirmation page loads it, and the Products page shows "You have an order waiting for payment". Orders created before this change that have no payment record are hidden from the admin. Admin: the Certificate of Analysis disclaimer note was removed from the COA Library page (the customer-facing COA note is unchanged). Where earlier entries differ, this entry wins.
**v1.27 · 2026-11-14**: Payment methods and delivery fees managed in the admin ("here are the actual payment methods; set this up in the admin panel; add delivery fees"). The client supplied two InstaPay QR codes, so the real methods are GCash and BPI; Maya, Bank Transfer and the cash on delivery setting are removed. New admin page Payments and delivery (System group): add, edit, turn on or off, reorder and delete payment methods (name, type, account name and number, customer instructions, optional QR image), and delivery options (name, fee in pesos, note, on or off, order) plus an optional "free delivery on orders of" amount. New tables `payment_methods` and `delivery_options` (migration 0005; GCash and BPI seeded, QR images uploaded to the private bucket). Delivery options ship empty because the fees are the client's to set; until they add some, the delivery fee is confirmed per order as before. Checkout now shows a Delivery step when options exist (required, fee added to the total, free above the set amount, all computed again by the Worker) and offers only the enabled payment methods. After ordering, the customer sees the chosen method with the amount to pay, the QR code, account details and instructions. QR codes and account details are served only to approved customers (private files); public pages show only method names, read from `GET /api/public/payments`. Orders store the delivery option and fee; the admin order screens show the method name and delivery. The old settings (standard delivery fee, payment instructions, cash on delivery switch) were removed from Settings. Where earlier entries differ, this entry wins.
**v1.26 · 2026-11-14**: Admin product form simplified ("just save and publish; we do not care what they sell"). By explicit direction this removes the regulatory review gate introduced in v1.21: no Pending Review, Verified or Not Cleared choice, no publish block, no filter or column for it. A product publishes when the owner presses Publish, and customers see every published product. The `regulatory_status` column stays in the database for old data and is written as verified; responsibility for what is listed stays with the client under Appendix B.1. Price display is now one choice per product, shown as two radio options: "Show the price to customers" or "Ask customers to inquire for the price instead" (they were two independent switches that could contradict each other). Also: the admin dashboard loads in one batched database call, and the admin's hashed scripts and fonts are cached. Where earlier entries differ, this entry wins.
**v1.25 · 2026-11-13**: Sitewide copy rewrite ("more commercial sounding, natural, and convincing, not AI generated"). By explicit direction this supersedes the v1.18 rule of keeping the client's document wording. Voice: short, concrete sentences in plain Philippine English that say what the customer gets (details on every product page, a real person to ask, orders confirmed by hand, GCash, Maya or bank transfer) instead of abstractions. Removed the stock phrases (thoughtful, journey, curated, discover, explore, straightforward, "a destination", "we're here to help"), the page eyebrows stay off. New hero headline "Beauty and wellness, with someone to help you choose."; the private catalog is explained as "Products and prices are for registered customers" rather than "shared with approved customers only"; the sign-up confirmation message was shortened (migration 0004, applied only where the setting still holds the original default). Launch integrity is unchanged: no health claims, outcomes, proof, counts or delivery promises; the licensed physician notes and legal disclaimers keep their meaning. Page titles keep the §13 text. Where earlier entries differ, this entry wins.
**v1.24 · 2026-11-13**: Public site finishing pass for hand-over ("fix the menu in the mobile view; commercially ready, polished, finished"). Mobile menu fixed: the full-screen menu was trapped inside the blurred header (a fixed element inside a backdrop-filter ancestor is sized to that ancestor), so it opened 72px tall; it now renders in a portal on the page body and fills the screen at 320, 390 and 768 px. Header navigation and menu button now switch at 1280 px (xl), because the full row overflowed at 1024 px, worst when signed in. Breadcrumb tap target widened. Contact is two columns (channels and details beside the message form). The About page no longer shows a draft note (`missionStatus` approved, the client's own copy). Duplicate disclaimer removed from Health & Beauty (the footer carries it); product intro line shows only when the product has details; checkout consent no longer repeats "Privacy Policy"; Privacy page uses the brand headings and drops the registration placeholder sentence (the draft banner stays until the client approves the policy). Where earlier entries differ, this entry wins.
**v1.23 · 2026-11-13**: Impeccable critique and polish pass across the public site and the admin ("notification counter for new orders and account approvals"; "fully user friendly and organized"; "remove AI slop"; "look expensive"). Method: an isolated design review and an isolated detector and browser measurement run, synthesized; scores before were public 26/40 and admin 25/40. Admin: grouped menu (Work, Catalog, Website, System) with count badges on Orders (new, not yet reviewed), Customers (waiting for approval) and Inquiries, a live browser-tab title total, a toast when something new arrives while the tab is open (polled every 30 seconds and on focus, new `GET /api/admin/counts`); an attention-first dashboard replacing the stat-tile grid; one overflow menu per table row; a single combined order status; a two-column product form with a sticky publishing rail; sign-out moved to the sidebar footer; a documented dense type scale (nothing under 14px except 13px badges), 44px touch targets, no card shadows, one radius set, no gradient edges, no label above the sign-in headline. Public: product photos now sit in a fixed frame with a quiet fallback (no broken-image icons, no developer placeholders for customers); Home reduced from nine bands to six by merging the two story and reasons sections, turning the pillar cards into a list, giving Pep Match one button and keeping a single closing contact band (other pages no longer repeat it); header is a single row; ornament rationed (banners lose the sprig and scattered sparkles; hero uses three sparkles); the product page hides empty accordions and shows one assurance line; checkout marks required fields, asks for a numeric postal keyboard and links to the summary on phones; the account page is titled "Log in to view products" and says why the catalog is private; whole pesos drop empty decimals. By client direction the client's own headings and sentences were kept; only structure changed. Detector: 0 findings after the pass (29 before). Where earlier entries differ, this entry wins.
**v1.22 · 2026-11-13**: Admin panel fully branded ("make the admin panel fully branded"). The admin now uses the public site's system: claret sidebar with the logo badge and Bodoni wordmark, raspberry actions, petal and gold accents, Bodoni Moda headings and Hanken Grotesk body (both bundled with the admin app, no external requests), a branded sign-in, password-change and reset layout, branded favicon and theme colour, and a collapsing mobile menu. This replaces the navy accents suggested in the admin specification (v1.20). Behaviour is unchanged. Operations: the two Worker secrets were set on the dedicated Cloudflare account and the administrator account was provisioned and its temporary password changed by the client. Where earlier entries differ, this entry wins.
**v1.21 · 2026-11-13**: Private customer catalog ("Website Admin Panel and Private Customer Catalog, updated scope"). This supersedes the v1.2 public storefront and the v1.20 public COA directory. The public website shows brand pages only; the primary catalog call to action is "View Products", which sends visitors to `/account` (Login and Create an Account). Registration takes full name, mobile number (unique, normalized) and password, always starts as Pending, and shows the administrator-configured confirmation message with contact options (Messenger, WhatsApp, phone; any left empty is hidden). Only an administrator can approve, reject, suspend or restore, each confirmed and recorded in a status history and the activity log with the administrator and time. Access is enforced by the Worker on every request, re-reading the account status each time: products, categories, product images (`/files/catalog/*`), certificates of analysis (`/files/coa/*`), cart and orders all refuse visitors and pending, rejected and suspended accounts, including sessions opened before a suspension. Products now carry a regulatory review status (Pending Review, Verified for Intended Sale, Not Cleared) and four publication statuses (Draft, Published, Unpublished, Archived); the server refuses to publish anything not Verified and unpublishes a product the moment it leaves Verified. Orders are tied to the customer account (name and phone come from the account); variants gain SKU and enable or disable. New settings: registration message, contact links, payment instructions, whether a rejection note is shown. Private pages are always noindex and absent from the sitemap. Phone OTP is not built: it needs an SMS provider and was marked as a dependency to confirm. Where earlier entries differ, this entry wins.
**v1.20 · 2026-11-12**: Admin panel and backend built, by explicit client direction ("Admin Panel Development Build Specification v1.0"). This supersedes §0 items 1 to 4, §1, §4 (reserved routes), §10, §16 and the Phase 1 only rule: the repo now has a Worker (`worker/`, Cloudflare Workers with D1 `pepstop_db` and R2 `pepstop-files`, no Pages Functions), versioned migrations (`migrations/`), and a separate admin app (`admin/`, served at `/admin`, client-only, excluded from the public bundle). Delivered: username and password login with a forced change of the temporary password, HttpOnly Secure SameSite=Strict session cookies, idle and absolute expiry, login rate limiting and lockout, activity log; dashboard from live records; products with variants, images, pricing, availability and draft, publish, archive; categories (the five client categories are kept, replacing the spec's four "Research" names); COA library with batch or lot, PDF validation by magic bytes, preview and download, and a public COA search at `/coa` that never labels a document verified; product information sections with a review gate on guidelines; orders saved by the server with price snapshots, status history, payment reference and proof (private), and manual verify or reject; customer inquiries from a new Contact form; website content with draft, preview, publish and unpublish plus Wellness Journal articles; a global search visibility setting (default hidden: noindex headers, sitemap withheld). The public site reads the catalog, categories, articles and website text from the API after hydration and falls back to the built-in sample slots when nothing is published. Decisions and deviations are in HANDOVER section 9. `COMMERCE_MODE` is now database orders with manual payment; no payment is collected on the site. Where earlier entries differ, this entry wins.
**v1.19 · 2026-11-12**: Client imagery supplied and wired: five collection images (4:3, 1448 by 1086) in `public/images/collection-{id}.webp`, the brand story image (PH-10, 1122 by 1402) as `story.webp`, and one product image (1254 by 1254) as the default product slot `product.webp`, so every sample product shows it until real product photos are supplied. Collection images are decorative (empty alt); story and product images carry descriptive alt text. Origin and licence of all supplied photographs, and whether any are AI-generated, remain for the client to confirm (§6, §12.6). Where earlier entries differ, this entry wins.
**v1.18 · 2026-11-12**: Client copy refresh ("E-Commerce Website Copy Refresh"). The client's own document replaces the surrounding site copy: announcement, hero ("Your Wellness Journey, Beautifully Considered."), collections, featured selections, brand story with three pillar cards, why, how it works (with the note that submitting is not payment or final acceptance), education, contact, About, Health & Beauty, Wellness Journal, Shop, Product, Cart, Checkout, Confirmation, 404, footer, nav labels (Explore Collection, About Us, Wellness Journal, Contact Us) and SEO descriptions. By client direction this supersedes the v1.16 copy and the fixed intro, mission and vision drafts; category names and assignments are unchanged. Decisions: (1) Cash on delivery is hidden everywhere (the client says to show it only once confirmed; flip `enabled` in `PAYMENT_METHODS`). (2) The client product disclaimer contains the phrase "diagnosis, or treatment guidance"; it is a disclaimer, not a claim, so `scripts/audit.mjs` exempts that exact phrase only. (3) The eyebrow labels in the document (About The Pep Stop, Learn With The Pep Stop and similar) are not rendered, keeping the v1.5 rule against kickers above headings. (4) Product pages gain Available Options, Supporting Documents and Certificate of Analysis rows that show "Information to be provided by The Pep Stop." until the client supplies data. (5) Confirmation send buttons read Send via Messenger, WhatsApp or SMS and still appear only for confirmed channels. Where earlier entries differ, this entry wins.
**v1.17 · 2026-11-12**: Hero choreography ("more and better animation in the homepage hero"). Staged from CSS so it plays before hydration: the photograph settles in (fade and a 1.08 to 1 scale over 1.8 s); the headline rises word by word, each word out of its own mask, then the lead, the two actions and the Get matched link follow; six logo sparkles bloom (scale and turn with a small overshoot) into the empty wall space above the group and beside the text, then twinkle; the photograph drifts very slowly (scale 1 to 1.02, 32 s, from the bottom right so the group stays clear of the headline); on desktop with a fine pointer the photograph and sparkle layers shift a few pixels in opposite directions with the pointer (depth). Pointer depth needs a 1280 px wide window, a fine pointer and no reduced-motion preference. The headline stays one readable sentence for assistive technology. All hero motion stops under `prefers-reduced-motion` (final state shown). JS stays well inside the 120 KB budget. Where earlier entries differ, this entry wins.
**v1.16 · 2026-11-12**: Copy rewrite ("emotion, beauty, women's health, premium, sophistication, chic"). Voice is now warm, composed and intimate, addressed to women, in Philippine English, with no hype words. By client direction this supersedes the fixed hero H1 and supporting line in §9.2 and the About, Contact and section headings: hero H1 "Self-care, beautifully considered."; tagline "Beauty, wellness, and self-care, beautifully considered."; section titles Find your ritual, The edit, Behind the shop (Beauty is personal. So is the way we serve you.), Shopping the way it should feel, Effortless from start to finish, Let us make it personal; About "Beauty, with a personal touch."; each of the five collections has an emotional tagline and a rewritten summary. Launch integrity (§12) is unchanged and was checked after the rewrite: no health claims, outcome promises, testimonials, counts or guarantees; collection copy speaks to how a woman wants to feel and how she is served, never to what a product does; health-adjacent collections keep the licensed-physician note; banned-vocabulary and dash audits pass. Page titles (browser tab and search) keep the §13 text. Where earlier entries differ, this entry wins.
**v1.15 · 2026-11-12**: New hero set supplied: a 12:5 desktop image (1944 by 809) and a 6:5 phone image (1374 by 1145), five women laughing together on a light studio wall; both ship as supplied, wired in `public/images/hero-desktop.webp` and `hero-mobile.webp`. Layout changed to suit the wide group: the text-over-photograph layout now starts at 1280 px with the section at the photograph's own 12:5 ratio (nothing zoomed or cropped, headline clear of the group at 1280, 1440 and 1920); below 1280 px the 6:5 photograph sits above the text, cropped to 16:9 on large phones and 2:1 on tablets. The scroll drift on the hero photograph was removed because it zoomed the group into the headline. Display type is now clamp 2.5rem to 3.5rem. Origin and licence of the photographs remain for the client to confirm (§6, §12.6). Where earlier entries differ, this entry wins.
**v1.14 · 2026-11-12**: Purpose-made 6:5 phone and tablet hero supplied (1374 by 1145). Its composition keeps the subject on the right with a wide empty left, which wastes the frame in the stacked layout, so the shipped `hero-mobile.webp` is a tighter 6:5 crop of that same file (1080 by 900, subject larger and nearer the centre). The untouched supplied file is kept at `design/hero-mobile-source.webp` (not deployed). A truly centred recomposition at 1800 by 1500 remains the preferred final asset. Where earlier entries differ, this entry wins.
**v1.13 · 2026-11-12**: Real hero photograph supplied and wired (`public/images/hero-desktop.webp`, 1942 by 809, 12:5). A 6:5 phone and tablet crop (`hero-mobile.webp`, 971 by 809) was cut from the same photograph so the stacked layout shows the finished look until a purpose-made phone file is supplied. The overlay layout (text on the photograph) now starts at 1024 px; below that, phones and tablets use the stacked layout so text never meets the subject. Header navigation no longer wraps at 1024 px. Crop is anchored near the top (object position 75 percent 6 percent) and parallax scales from the top so the head keeps its headroom. The photograph's origin and licence are for the client to confirm (§6, §12.6). Where earlier entries differ, this entry wins.
**v1.12 · 2026-11-12**: Motion and vector pass ("animations and elements that raise perceived value; empty spaces get brand vector animation"). One coherent system, all CSS and SVG with no animation library (JS stays about 103 KB gzipped, under the 120 KB budget): (1) staged hero entrance from CSS; (2) slow drift on the full-bleed hero photograph (desktop only); (3) a collections ticker band in Bodoni below the hero; (4) headings rise out of a mask on scroll; (5) list hairlines draw across on scroll; (6) the logo's four-point sparkle twinkles in empty space; (7) an authored botanical sprig (line art from the logo's leaf) draws itself, unfurls its leaves, then sways, placed in the empty areas of page banners, Contact, Why shop with us, Behind the shop, About collections, empty states, 404 and the footer; (8) a sheen sweep on primary buttons and a View product chip on product cards. Everything is decorative (`aria-hidden`), content is visible without JavaScript, and every effect is switched off under `prefers-reduced-motion`. Easing is one exponential ease-out. Where earlier entries differ, this entry wins.
**v1.11 · 2026-11-12**: Full-bleed hero. The home hero is now one wide photograph that fills the section (desktop slot PH-01, 2400 by 1000, 12:5) with the subject in the right 40 percent and a clean light area across the left 55 percent for the claret headline. Phones get a separate recomposed crop above the text (slot PH-01, 1200 by 1000, 6:5, subject centered) so type never sits on the subject. No scrim or overlay is used, so the photograph's left area must be light enough for claret #5A0118 text (see HANDOVER image brief). Any AI-assisted editing of client photography is the client's decision and is subject to §12.6.
**v1.10 · 2026-11-12**: Hybrid storefront and brand showcase ("a professional e-commerce site that sells products and also showcases the business itself"). Home now runs: hero, five collections with Pep Match, the range, Behind the shop (brand story with its own image slot PH-10 1200 by 1500, the approved intro copy, three principle chips, link to About), Why shop with The Pep Stop (four service reasons), How ordering works, contact. About is rebuilt as a brand page: story with image, mission and vision as editorial statements, how we serve, values, and links into the five collections. No facts were invented: no founding year, founder, team, counts, press or awards; every line reuses approved draft copy or describes how the checkout already works. "Pay your way" lists the payment methods the checkout offers and is for the client to confirm. Also fixed: client navigation no longer fetches the build-hash loader manifest (no route has a loader), so an open tab after a redeploy cannot crash with a JSON error. Where earlier entries differ, this entry wins.
**v1.9 · 2026-11-12**: Hero redesign ("the colour is eye straining; make it feminine, expensive, premium"). The saturated full-raspberry hero is replaced by a soft petal field (#FFEEF2) with claret #5A0118 Bodoni headline, one raspberry action, a rosewater #F8CDD9 plate behind the image with a fine gold hairline frame and the logo sparkle, a "Not sure where to start? Get matched" card linking to Pep Match, and (below lg only) a quiet collections row. The announcement bar is claret, not raspberry. Display type scale is now clamp 2.5rem to 4.25rem so the whole hero fits above the fold at 1440 by 900. Raspberry is now action colour only; no saturated field remains on the page. Where earlier entries differ, this entry wins.
**v1.8 · 2026-11-12**: Professional storefront pass ("make it look and feel like a professional health and beauty brand"). Added: collections bar under the desktop header, breadcrumbs and reassurance lines on product pages, a full footer (Shop collections, company links, contact, payment options row), numbered checkout steps, thumbnails in checkout and cart, a calmer Health & Beauty page (numbered collection index with a Shop this collection action). Fixed: form and stepper borders now use token `edge` #8F7A86 (3.97:1 on white, 3.54:1 on petal) because hairline `line` was 1.3:1; cart and order totals no longer wrap; thumbnail placeholders carry no text. Where earlier entries differ, this entry wins.
**v1.7 · 2026-11-12**: Catalogue categories set by the client: Weight & Wellness, Next-Generation Wellness, Skin & Beauty, Vitality & Cellular Health, Energy & Cellular Wellness (they replace the earlier three focus areas everywhere: Home, Shop filters, Health & Beauty page, sample products). Copy sharpened for conversion without inventing proof or claims: the invented sales device is Pep Match, a goal-led chooser plus a one-message hand-off to a person (SMS or WhatsApp prefilled), which is navigation and service only. Category and collection copy stays general: no outcome promises, no claims about weight, cells or energy, no testimonials, counts or guarantees (§12 stands). The category names themselves are client-supplied labels; any product copy under them is client content (Appendix B.1).
**v1.6 · 2026-11-12**: Per client direction ("more premium, feminine, in line with the branding"), the v1.5 system is warmed toward the logo. Headings: Bodoni Moda 500 and 600 (self-hosted latin), body and UI stay Hanken Grotesk. The home hero is a drenched raspberry field with a gold hairline frame; the logo's four-point sparkle is the one brand motif (authored SVG, decorative); footer and mobile menu are claret #5A0118; panels are petal #FFEEF2; ink is plum #2B1220; imagery and cards use 20px radii. Contrast: ink on white 17.35, mute #6F5B66 on white 6.24, raspberry on white 6.20, white on raspberry 6.20, white on claret 14.46, gold on claret 8.01 (gold on raspberry 3.44, graphics only). Where §6 or v1.5 differ, this entry wins.
**v1.5 · 2026-11-11**: Visual redesign per client direction ("remove AI slop, premium, sophisticated, chic hybrid store"). Direction: the category standard played straight with Glossier and Rare Beauty as the craft bar. Fonts: Hanken Grotesk 400 to 700 (self-hosted latin subset) replaces Cormorant Garamond and DM Sans (v1.6 adds Bodoni Moda for headings). Ground is white with petal #FDEFF2 panels and ink #1A1217; raspberry #C30239 is the action colour; gold #ECB86C survives only as a focus ring on dark. Tokens renamed (ink, raspberry, raspberry-deep, petal, mute, line, gold). Removed: ivory and blush gradients, gold arc motif, eyebrow labels, icon cards, serif display. Contrast re-measured: ink on white 18.38, mute on white 6.54, raspberry on white 6.20, white on raspberry 6.20, gold on ink 10.18. Where §6 differs, this entry wins.
**v1.4 · 2026-11-11**: Hosting is Cloudflare Workers with static assets (`wrangler.jsonc`, `npm run deploy`), not Cloudflare Pages. Static output, no Worker script and no bindings. Wherever §1, §3, §14 or the handover template say Cloudflare Pages, read Workers static assets. The preview noindex rule now targets `*.workers.dev` in `public/_headers`.
**v1.3 · 2026-11-11**: Logo received (★G2 closed). Palette re-measured from the logo: magenta #C30239, magenta-deep #7A0220, rose #F0829F, rose-ink #B3103F, gold #ECB86C, gold-ink #7A5712 (ivory, blush, charcoal unchanged). All text pairs in §6 pass WCAG AA; rose and gold remain decoration only on light backgrounds. Where the §6 hex values differ from this entry, this entry wins.
**v1.2 · 2026-11-11**: Per client direction, the site is now a storefront as well as a brand site. Public `/shop`, `/shop/:slug`, `/cart`, `/checkout`, `/checkout/confirmation` are built front end only (`COMMERCE_MODE = "frontend"`: no payment collected, no backend, orders leave the browser by chat). The shop is linked in public navigation and the sitemap, superseding the unlisted `/catalog` rule for products. Products ship as labeled sample slots with no claims; the client supplies real data. Admin, database, COA directory and payment processing remain Phase 2. Where this entry conflicts with §0, §1, §4, §10 or §16, this entry wins.
**v1.1 · 2026-11-11**: Per Chief Alta: registration enforcement removed. Catalog is a client-managed CMS; regulatory compliance of listed content is the client's responsibility, recorded in the service agreement. Registration fields kept as optional display fields. Catalog ships empty; Altaventures does not author product, dosing, or protocol content. Appendix D (regulatory findings) removed.
**v1 · 2026-11-11**: Initial locked spec, converted from the ALTAVENTURES build specification. _(Bump + changelog line on every revision.)_

---

## 0. Prime directives

1. **Build Phase 1 only.** Static, prerendered, no Pages Functions, no database, no auth, no file uploads, no `/admin`, no `/catalog` route in the Phase 1 bundle (§1, §16).
2. **The public site and the catalog stay separate.** No catalog link in public navigation, sitemap, or public pages (client requirement).
3. **Altaventures builds the platform; the client owns the content.** The catalog ships empty. The build assistant never writes product descriptions, product claims, dosing, protocols, or usage guides, and never seeds product records (§17).
4. **No checkout or payment collection.** `COMMERCE_MODE = "none"`. Inquiry only, as in the source spec. Commerce would be a new spec (§10).
5. **Never hardcode content in components.** All public copy and config lives in `src/content/site.ts`.
6. **Launch integrity applies to copy Altaventures writes (§12).** No fabricated reviews, results, credentials, or health claims in public-site copy. Unresolved items render as registered placeholders, hide, or are omitted.
7. **`HANDOVER.md` is mandatory (§18 + Appendix A).**
8. **No em dashes or en dashes** anywhere in copy, code comments, or documentation produced for this build. Ranges are written "3 to 7".

**Priority order:** 1 brand trust, 2 conversion clarity (chat and phone), 3 mobile experience, 4 Phase 2 readiness, 5 visual polish. Launch integrity (§12) sits above all five.

---

## 1. Scope: in-bounds now vs deferred

| | **Phase 1: BUILD NOW (STARTER)** | **Phase 2A (PRO): DO NOT BUILD** | **Phase 2B (PRO): DO NOT BUILD** |
|---|---|---|---|
| Nature | Static prerendered brand site | Admin panel, unlisted catalog, product documentation, inquiry form | COA upload and searchable directory |
| Conversion | Messenger, phone, Viber/WhatsApp (if confirmed), mailto | Adds on-site inquiry form | Unchanged |
| Catalog content | None | Entered by client through admin | Same |
| Payments | None | None | None |
| Domain | `thepepstop.altasme.com` | Client custom domain (★P5). Catalog served only from the custom domain | Same |

**Hard rule for the build assistant:** if you are about to write a `fetch` to an API, a Pages Function, a D1 or R2 binding, an auth guard, a login page, a cart, or anything under `/admin`, `/api`, or `/catalog`: stop. It is Phase 2. Flag and defer.

**Why the catalog lives only on the client's domain:** the STARTER package includes a free ALTASME subdomain under Altaventures' name. Serving the client's catalog from an altasme.com hostname makes Altaventures look like the publisher of content it does not control. A client-registered domain keeps the publisher visibly the client.

---

## 2. Blocking inputs

### Hard launch gates (Phase 1)

| # | Item | Why it blocks | Needed from client |
|---|---|---|---|
| ★G1 | Business registration: DTI or SEC name and registered address | Footer identification, Privacy Policy controller, service agreement party | Certificate or registration number |
| ★G2 | Logo file (vector or high-res PNG) | Source says "use the supplied logo", but no file was supplied. Palette (§6) must be re-measured against it | Logo file |
| ★G3 | Signed service agreement including the content-responsibility clause (Appendix B.1) | Records that the client owns and is responsible for everything it publishes, before the client gets admin access in Phase 2 | Signature (source already schedules signing upon delivery; this clause must be in it) |

### Content blockers (ship as placeholder, hidden row, or omission)

| # | Item | Behavior until resolved |
|---|---|---|
| ★C1 | Final business introduction, mission, vision | Draft copy in §9 ships, listed in `HANDOVER.md` §5 as drafts |
| ★C2 | Business Gmail address | Email row hidden (PH-05) |
| ★C3 | Facebook Page URL | Messenger button hidden (PH-04); phone becomes primary CTA |
| ★C4 | Whether 0991 018 9669 is on Viber and/or WhatsApp | Only `tel:` and SMS render |
| ★C5 | Brand photography | Licensed lifestyle and texture imagery (PH-01, PH-02) |
| ★C6 | Business hours | Not stated |
| ★C7 | Privacy contact and retention preference | Privacy page renders with PH-07 draft banner |
| ★C8 | Analytics preference | Cloudflare Web Analytics only (cookieless). Meta Pixel on public routes only if supplied (§11) |

### Phase 2 gates (do not block Phase 1)

| # | Item | Needed for |
|---|---|---|
| ★P1 | Product data (names, variants, descriptions, specs, packaging, storage, images), entered by the client through admin | Catalog content. Catalog launches empty until the client publishes records |
| ★P2 | Documents and COA files with lot numbers, uploaded by the client | Documentation and Phase 2B |
| ★P3 | Admin users (emails) and roles | WorkOS allowlist |
| ★P4 | Inquiry notification recipients | Resend routing |
| ★P5 | Custom domain registered in the client's name, DNS on a Cloudflare zone | Catalog hostname, Search Console |
| ★P6 | Data retention period for inquiries | Purge job |

### 2.1 Placeholder Registry

| ID | Location | Renders as | Closed by |
|---|---|---|---|
| PH-01 | Home hero visual | Soft blush gradient with gold arc motif, or licensed skincare texture image | ★C5 |
| PH-02 | Focus area imagery | Licensed lifestyle images (skincare ritual, morning routine, active lifestyle) | ★C5 |
| PH-03 | Logo (header, footer, favicon, OG) | Wordmark "The Pep Stop" in the heading font, "Health & Beauty" in small caps beneath | ★G2 |
| PH-04 | Messenger button | Hidden | ★C3 |
| PH-05 | Email row | Hidden | ★C2 |
| PH-06 | Footer legal line | Omitted | ★G1 |
| PH-07 | Privacy page | Banner "Draft, pending approval by The Pep Stop" | ★C7 |
| PH-08 | Mission and vision (if drafts rejected) | Section hidden | ★C1 |

---

## 3. Tech stack (LOCKED)

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Rendering | Build-time prerender of every route (`vite-react-ssg` or equivalent). Facebook and Messenger link previews do not run JavaScript |
| Styling | Tailwind CSS, tokens in config (§6) |
| Backend | **None in Phase 1** |
| Fonts | Self-hosted via `@fontsource`: Bodoni Moda 500/600 (headings), Hanken Grotesk 400 to 700 (body and UI), latin subset (v1.5 and v1.6; supersedes the original Cormorant Garamond and DM Sans) |
| Icons | `lucide-react`, one stroke weight |
| Media | Cloudinary (`f_auto,q_auto`, responsive `srcset`) |
| Hosting | Cloudflare Workers static assets (`wrangler.jsonc`), Git-connected, static `dist/` |
| Analytics | Cloudflare Web Analytics (cookieless) |

Build output is a fully static `dist/` with no runtime secrets.

---

## 4. Information architecture

- **Primary nav:** Home · About · Health & Beauty · Wellness Education · Contact
- **Nav CTA:** "Message Us" (→ `CTA.primary`, §8).
- **No catalog link** in nav, footer, or any public page.

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About Us |
| `/health-beauty` | Health & Beauty |
| `/education` | Wellness Education index |
| `/education/:slug` | Article (only `published: true`) |
| `/contact` | Contact |
| `/privacy` | Privacy Policy |
| `*` | 404 |

- **Phase 2 routes (reserve, do not build):** `/catalog`, `/catalog/:productSlug`, `/catalog/coa`, `/admin`, `/admin/*`, `/api/*`.

---

## 5. File structure

```
src/
  main.tsx
  App.tsx                    # routes from §4
  index.css                  # Tailwind entry + CSS variables (§6)
  content/
    site.ts                  # SINGLE SOURCE OF TRUTH for copy and config
    articles.ts              # Wellness Education articles
    getContent.ts            # returns static content; Phase 2A swaps source here only
  lib/
    cta.ts                   # resolves every CTA from the CTA constant
    phone.ts                 # display "0991 018 9669", tel "+639910189669"
    analytics.ts             # CF Web Analytics wrapper
    seo.ts                   # per-route title, description, OG, canonical, JSON-LD
  components/
    layout/    (Header, MobileNav, Footer, StickyCtaBar)
    sections/  (Hero, Intro, FocusAreas, EducationHighlights, Values, ContactBlock, PageBanner)
    ui/        (Button, SectionHeading, Placeholder, Card, Disclaimer)
  pages/       (Home, About, HealthBeauty, Education, Article, Contact, Privacy, NotFound)
public/
  images/      # real or licensed assets only
  og/
```

**Rules:** no hardcoded strings; no `functions/`, `admin/`, or `catalog/` directory in Phase 1.

---

## 6. Brand system (LOCKED method; values provisional until ★G2)

The client delegated palette choice to Altaventures. On receipt of the logo, run the house two-pass extraction (32-step bucket clustering, then per-color RGB mask averaging), adjust magenta to the logo, and re-measure every pair.

```
--magenta:       #C30239   /* v1.5: now token "raspberry". Action colour */
--magenta-deep:  #7A0220   /* Headings, footer, dark sections */
--rose:          #F0829F   /* Secondary: fills and decorative only */
--rose-ink:      #B3103F   /* Derived. The only pink allowed as text on light backgrounds */
--gold:          #ECB86C   /* Accent: rules, icons on dark, ornaments */
--gold-ink:      #7A5712   /* Derived. Gold as text on light backgrounds */
--ivory:         #FFFAF4   /* Main background */
--blush:         #FBEAEF   /* Supporting section backgrounds */
--charcoal:      #2A2227   /* Body text */
```

**Measured contrast (WCAG 2.1, computed for this spec):**

| Pair | Ratio | Use |
|---|---|---|
| Charcoal on ivory / blush | 14.91 / 13.36 | Body text: passes |
| Magenta on ivory / blush | 7.43 / 6.65 | Links, icons: passes |
| White on magenta | 7.71 | Button text: passes |
| Magenta-deep on ivory | 12.60 | Headings: passes |
| White on magenta-deep | 13.08 | Footer text: passes |
| Gold on magenta-deep | 5.57 | Gold accents on dark: passes |
| Rose-ink on ivory / blush | 5.92 / 5.30 | Pink eyebrow labels: passes |
| Gold-ink on ivory | 5.60 | Gold text on light: passes |
| **Rose on ivory** | **2.35** | **Fails.** Never text or icon color on light |
| **Gold on ivory** | **2.26** | **Fails.** Never text or icon color on light; use gold-ink |

- **Type:** Cormorant Garamond headings, DM Sans body. Body 16px, never below 14px. Fluid heading scale via `clamp()`.
- **Buttons:** pill radius, 48px min height, 2px focus ring in `--magenta-deep`, offset 2px.
- **Motif:** thin gold arc, soft blush-to-ivory gradients. Decorative, `aria-hidden`.
- **Imagery (public site):** skincare textures, botanicals, calm routines, adults 30 to 60 of mixed gender. Avoid clinical or pharmaceutical imagery (source §2.2). **No AI-generated imagery.**
- **Voice:** warm, composed, plain. Philippine English. No hype words ("miracle", "breakthrough", "guaranteed").
- **Motion:** subtle fade on scroll; `prefers-reduced-motion` respected.
- **Catalog styling (Phase 2):** same tokens, denser layout, white product cards on ivory.

---

## 7. Content schema (`src/content/site.ts`, abbreviated)

```ts
export const ORG = {
  name: "The Pep Stop",
  descriptor: "Health & Beauty",
  tagline: "Your destination for wellness, beauty, and informed self-care.",
  legalName: null as null | string,          // ★G1
  registration: null as null | string,       // ★G1
  logo: null as null | string,               // ★G2, null = PH-03
  intro: "...", mission: "...", vision: "...", missionStatus: "draft" as "draft" | "approved",  // ★C1
};

export const CONTACT = {
  phoneDisplay: "0991 018 9669",
  phoneE164: "+639910189669",
  viber: false, whatsapp: false,             // ★C4
  email: null as null | string,              // ★C2
  facebookUrl: null as null | string,        // ★C3
  messengerUrl: null as null | string,       // m.me link once ★C3 supplied
  hours: null as null | string,              // ★C6
};

export type FocusArea = { id: string; title: string; summary: string; order: number; image: string | null };
export const FOCUS_AREAS: FocusArea[] = [ /* §9.3 */ ];

export type Article = { slug: string; title: string; summary: string; body: string; published: boolean; updatedAt: string };
export const VALUES = [ /* §9.2 */ ];
export const LEGAL = { privacyStatus: "draft" as "draft" | "approved", privacyContact: null };
export const SEO = { siteUrl: "https://thepepstop.altasme.com", routes: { /* §13 */ } };
```

Flat JSON-serializable shapes (the Phase 2A content store returns the same shapes); ordering from `order` fields.

---

## 8. Conversion system (the activation seam)

```ts
export const CTA = {
  primary:   CONTACT.messengerUrl ? { kind: "messenger", href: CONTACT.messengerUrl, label: "Message Us on Messenger" }
                                  : { kind: "phone", href: `tel:${CONTACT.phoneE164}`, label: "Call 0991 018 9669" },
  call:      { href: `tel:${CONTACT.phoneE164}`, label: "Call Us" },
  sms:       { href: `sms:${CONTACT.phoneE164}`, label: "Text Us" },
  viber:     CONTACT.viber ? { href: `viber://chat?number=%2B639910189669`, label: "Viber" } : null,
  whatsapp:  CONTACT.whatsapp ? { href: `https://wa.me/639910189669?text=${encodeURIComponent("Hi The Pep Stop, I have a question.")}` } : null,
  email:     CONTACT.email ? { href: `mailto:${CONTACT.email}?subject=Inquiry%20from%20website` } : null,
};
export const INQUIRY_MODE = "chat";          // Phase 2A: "form"
export const CATALOGUE_SOURCE = "none";      // Phase 2A: "db"
export const COMMERCE_MODE = "none";         // Not a Phase 2 switch (§10)
```

Messenger and Viber open blank; only WhatsApp supports prefilled text (house constraint). Copy beside chat buttons: "Tell us your name and what you would like to know."

---

## 9. Section-by-section build

### 9.1 Header and footer
- **Header:** logo or PH-03, nav (§4), "Message Us" button. Sticky, compact after scroll; mobile full-screen menu with focus trap, Esc closes.
- **Footer:** logo, tagline, nav links, contact rows, Privacy link, legal line `{legalName} · {registration}` (PH-06), "© {build year} The Pep Stop."
- **Footer disclaimer (small):** "Content on this website is general information. It is not medical advice. For health concerns, consult a licensed physician."

### 9.2 Home `/`
1. **Hero.** H1: "Your destination for wellness, beauty, and informed self-care." Supporting line: "The Pep Stop is a health and beauty brand built on clear information and attentive service." Primary `CTA.primary`, secondary "Explore Health & Beauty" → `/health-beauty`. Visual PH-01.
2. **Introduction.** Two short paragraphs from `ORG.intro` (★C1 draft).
3. **Focus areas.** Three tiles from `FOCUS_AREAS` → `/health-beauty#{id}`.
4. **Wellness Education highlights.** Up to three published articles; hidden if none.
5. **Brand values.** Four cards: Informed Choices · Honest Information · Attentive Service · Responsible Self-Care.
6. **Contact block.** Chat and phone buttons (§8), hours if ★C6.

### 9.3 Health & Beauty `/health-beauty`
Banner: "Beauty and wellness, approached with care." Sections from the source focus list: **Beauty & Skincare**, **Health & Wellness**, **Emerging Wellness Innovations**. Two to three sentences each in general terms, licensed image, link to related published articles. Altaventures-drafted copy stays general (§12); the client may revise through the Phase 2 content editor.

### 9.4 Wellness Education `/education`, `/education/:slug`
- Index lists published articles; empty state "Articles are coming soon."
- Article template: title, summary, body, "Last updated {date}", disclaimer at end.
- Altaventures may draft up to three general beauty and wellness articles (for example "Building a simple skincare routine", "Why sleep shows on your skin", "Reading a product label"), `published: false` until the client approves. Product-specific articles are client content (Phase 2 editor).

### 9.5 About `/about`
Banner, intro (★C1), mission and vision (drafts, PH-08 if rejected), brand philosophy, commitment to customer education, customer service approach. No founder credentials, years in business, or customer counts unless supplied in writing.

### 9.6 Contact `/contact`
Heading "Get in touch." Buttons: Messenger (if ★C3), Call, Text, Viber/WhatsApp (if ★C4), Email (if ★C2). Hours (★C6). No form in Phase 1 (house rule: PII capture is Phase 2).

### 9.7 Privacy `/privacy`
Outline in Appendix B.3; PH-07 banner until approved.

### 9.8 Mobile sticky CTA bar
Below 768px, after the hero, on content pages: one magenta button using `CTA.primary`. Hidden on Contact and Privacy.

---

## 10. Payment

**Not in scope.** `COMMERCE_MODE = "none"`. The source spec already deferred cart, checkout, and GCash/Maya/bank verification, with inquiry used instead. If the client later wants ordering, it is scoped as a new spec (cart, order tables, payment-proof workflow, and the client's documentation for the products involved), not a constant flip.

---

## 11. Analytics / event map

- Default: Cloudflare Web Analytics, cookieless.
- Meta Pixel on public routes only if ★C8 supplies an ID; disclosed on Privacy. **Not on `/catalog` routes:** Meta restricts health-related product signals and may restrict the ad account.

| Event | Fires when |
|---|---|
| `cta_messenger_click` / `cta_call_click` / `cta_sms_click` / `cta_viber_click` / `cta_whatsapp_click` / `cta_email_click` | Respective button |
| `article_view` | Article page view (slug only) |
| `catalog_inquiry_click` (2A) | "Ask about this product" on a catalog page (product id only) |

Conversion = outbound chat or call click. Payloads carry `{ page, cta }` only.

---

## 12. Launch-integrity rules (HARD CONSTRAINTS, for content Altaventures writes)

1. **No fabricated proof:** no testimonials, ratings, before-and-after images, customer counts, or awards unless supplied with written permission.
2. **No health claims in Altaventures-written copy.** No treat, cure, prevent, heal, reverse, weight loss, or "clinically proven" in public-site copy. House softening ("may help") for general lifestyle statements.
3. **Altaventures does not author product content.** No product descriptions, dosing, protocols, reconstitution or administration guides, or usage instructions, and no templates pre-filled with them. The documentation editor is a blank rich-text tool the client fills.
4. **Unlisted is described accurately.** Handover and admin help text say the catalog is excluded from search engines, not private or confidential; anyone with the link can view it (kept from source).
5. **COAs are not auto-labeled verified** (kept from source §7.3).
6. **Licensed imagery only, no AI imagery** in Altaventures-supplied assets.
7. **Placeholders look like placeholders** (§2.1).

**Client content:** everything the client enters in admin (products, prices, documents, COAs, claims, registration details) is the client's responsibility under the service agreement clause (Appendix B.1). The platform does not review or block it.

**Banned vocabulary sweep (M2, public-site copy only):** cure, treat, prevent, heal, weight loss, slimming, clinically proven, miracle, guaranteed, pharmaceutical grade. Each hit removed or justified in `HANDOVER.md` §9.

---

## 13. Responsive, accessibility, performance, SEO

- **Responsive:** design at 360px first; QA at 320, 375, 430, 768, 1024, 1280, 1440px. No horizontal overflow; 44px touch targets; no hover-only interactions. Admin panel usable at 360px (source §2.3).
- **Accessibility (WCAG 2.1 AA):** landmarks, one H1 per page, visible focus, keyboard-operable menu, contrast per §6.
- **Performance (mobile):** LCP under 2.5s, CLS under 0.1, INP under 200ms, JS under 120 KB gzipped on public pages.
- **SEO (public routes):** unique titles and descriptions, OG tags, canonical, `sitemap.xml` (public routes only), `robots.txt`. Preview deploys send `X-Robots-Tag: noindex`.
- **Titles:** Home "The Pep Stop | Health & Beauty"; Health & Beauty "Beauty & Wellness | The Pep Stop"; Education "Wellness Education | The Pep Stop"; About "About Us | The Pep Stop"; Contact "Contact | The Pep Stop".
- **JSON-LD:** `Organization` on Home (name, logo, url, `sameAs` Facebook, `contactPoint` telephone). No `Product` schema anywhere (catalog is noindex).
- **Search Console and Google Business Profile:** PRO items, done at the custom-domain move.

---

## 14. Build sequence (milestones)

- **M0 Foundation:** scaffold, prerender, tokens, `site.ts` and `articles.ts` with drafts, `Placeholder`, Git-connected Pages project.
- **M1 Pages:** header, mobile nav, footer, all §4 routes, CTA wiring, sticky bar.
- **M2 SEO, analytics, QA:** meta, OG image, JSON-LD, sitemap, robots, preview noindex, analytics; width pass; keyboard pass; Lighthouse; tap-test every CTA on Android and iPhone; placeholder sweep; banned-vocabulary sweep; dash audit; client review on preview URL.
- **M3 Launch:** after ★G1 and ★G2 closed, and ★G3 signed. Produce `HANDOVER.md`.

---

## 15. Definition of done (Phase 1)

- Every §4 route exists, is prerendered, and passes width and keyboard checks.
- All copy reads from `site.ts`/`articles.ts` through `getContent.ts`.
- Every CTA opens the correct app on a real Android and iPhone.
- No catalog link anywhere on the public site.
- Zero em and en dashes; no placeholders outside the registry; banned-vocabulary sweep clean.
- No `functions/`, `admin/`, `catalog/`, cart, or payment code in the repo.
- **`HANDOVER.md` exists and is complete (Appendix A).**

---

## 16. Explicitly OUT of scope for Phase 1 (Phase 2: reserved spec, do NOT build now)

### 16.1 Activation constants

| Constant | Phase 1 | Phase 2A | Phase 2B | Turns on |
|---|---|---|---|---|
| `INQUIRY_MODE` | `chat` | `form` | `form` | Inquiry form on `/contact` and catalog pages |
| `CONTENT_SOURCE` | `static` | `store` | `store` | Admin-edited public content, published by rebuild |
| `CATALOGUE_SOURCE` | `none` | `db` | `db` | `/catalog` serves published products |
| `ADMIN_ENABLED` (server env) | absent | `true` | `true` | `/admin`, `/api/admin/*`; absent = 404. Renewal kill switch |
| `COA_ENABLED` (server env) | absent | absent | `true` | `/catalog/coa` and COA links |
| `COMMERCE_MODE` | `none` | `none` | `none` | Not activatable (§10) |

### 16.2 Phase 2A architecture

- Cloudflare Pages Functions + D1 (`pepstop_db`) + R2 private bucket (`pepstop-files`) + Resend (inquiry notifications) + Turnstile + per-IP rate limit.
- Auth: WorkOS AuthKit, email allowlist (★P3). Roles: `owner` (everything, including admin users and publishing) and `editor` (create and edit drafts; cannot publish, delete, or manage users).
- `/catalog` routes are **server-rendered per request** from D1, so publish and unpublish take effect immediately without a rebuild.
- Database clients instantiated lazily inside each handler (house rule).

### 16.3 Product management

- **Status:** `draft` → `published` | `unavailable` | `archived`. New products are `draft` and never visible (source §5.2). Only `owner` can set `published`.
- **Fields (source §5.1):** id, name, slug, category, image, short description, full description, specifications, variants (strength or quantity, optional price), packaging, storage, related documents, status, created and updated dates, updated by.
- **Optional regulatory display fields (client-entered):** registration type, registration number, registration holder. If filled, shown on the product page as "Reg. No. {number}". The platform does not validate or require them.
- **Availability:** "Available", "Ask for availability", "Unavailable".
- **Prices:** per variant, optional, shown only if the client fills them and toggles `showPrice` per product.
- **Catalog ships empty.** No seed products, no imported product list.

### 16.4 Documentation editor

- Generic rich-text documents attached to a product (or general), with title, body, optional PDF attachment, status `draft | published | archived`, last updated date, updated by, version history (source §6.2).
- No calculators, no structured dose fields, no AI-generated content, no pre-filled templates (source §6.3 kept).
- Admin help text: "Documents you publish are visible to anyone with the catalog link. You are responsible for their content."

### 16.5 Unlisted catalog behavior (source §4.2, kept)

- `X-Robots-Tag: noindex, nofollow` on every `/catalog` response and every R2 file served through the Worker; matching `<meta name="robots">` in catalog HTML.
- Catalog excluded from `sitemap.xml`; not linked from public pages.
- **Do not** disallow `/catalog` in `robots.txt`: blocked crawlers never read the noindex directive.
- Catalog landing: categories, product cards, search by name, filter by category and variant (source §4.4). Published products only.
- Product page: overview, specifications, variants, packaging, storage, published documents, COAs (2B), "Ask about this product" (Messenger or inquiry form).
- Verification after deploy: `curl -I` on a product page and a document URL shows the noindex header (source §4.2).

### 16.6 Inquiry form (2A)

Fields: name ≤ 100, mobile or email (one required), topic (general, product availability, other), optional product reference (auto-filled from the catalog page), message ≤ 1,000, consent. Helper: "Please do not include medical history." Stored in D1, emailed to ★P4 recipients, acknowledgment to submitter. Retention per ★P6 (default proposal 12 months). Admin: list, status (new, replied, closed), notes.

### 16.7 Phase 2B: COA directory (source §7, kept)

- Record: product, lot number, lab name (optional), document title, PDF, upload date, last updated, publication status.
- The source's "verification status" field is kept as an internal-only admin note and never rendered publicly (source §7.3: not auto-labeled verified).
- Search by product name or lot number; result shows product, lot, availability, "View document".
- Upload validation: PDF only, magic bytes `%PDF`, ≤ 10 MB, random storage keys, served through the Worker with noindex header. Replace keeps history; archive hides.

### 16.8 Phase 2 data model (D1, reserved)

```sql
CREATE TABLE admin_users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, role TEXT NOT NULL CHECK (role IN ('owner','editor')), created_at TEXT NOT NULL);
CREATE TABLE product_categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, sort INTEGER NOT NULL);
CREATE TABLE products (
  id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  category_id TEXT REFERENCES product_categories(id),
  short_description TEXT, full_description TEXT, specifications TEXT, packaging TEXT, storage TEXT, image_key TEXT,
  reg_type TEXT, reg_number TEXT, reg_holder TEXT,
  availability TEXT NOT NULL DEFAULT 'ask', show_price INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','unavailable','archived')),
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL, updated_by TEXT
);
CREATE TABLE product_variants (id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), label TEXT NOT NULL, price_php INTEGER, available INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL);
CREATE TABLE product_documents (id TEXT PRIMARY KEY, product_id TEXT REFERENCES products(id), title TEXT NOT NULL, body TEXT, file_key TEXT, status TEXT NOT NULL DEFAULT 'draft', updated_at TEXT NOT NULL, updated_by TEXT NOT NULL);
CREATE TABLE product_document_versions (id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES product_documents(id), body TEXT, file_key TEXT, saved_at TEXT NOT NULL, saved_by TEXT NOT NULL);
CREATE TABLE coa_records (id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id), lot_number TEXT NOT NULL, lab_name TEXT, title TEXT NOT NULL, file_key TEXT NOT NULL, internal_note TEXT, status TEXT NOT NULL DEFAULT 'draft', uploaded_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE inquiries (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL, mobile TEXT, email TEXT, topic TEXT NOT NULL, product_id TEXT, message TEXT NOT NULL, consent INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'new', note TEXT, purge_after TEXT);
CREATE TABLE content_documents (key TEXT PRIMARY KEY, draft TEXT, published TEXT, updated_at TEXT, updated_by TEXT);
CREATE TABLE audit_log (id TEXT PRIMARY KEY, actor TEXT NOT NULL, action TEXT NOT NULL, subject_type TEXT, subject_id TEXT, detail TEXT, at TEXT NOT NULL, ip TEXT);
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start TEXT NOT NULL);
```

`admin_roles`/`admin_sessions` from the source are handled by WorkOS plus the `role` column. `product_guidelines` merges into `product_documents`. `orders`, `order_items`, `payment_records` not reserved (§10).

### 16.9 Admin panel (2A)

Dashboard (total products, drafts, published, COA count, recent uploads, recent audit entries); Products (CRUD, variants, images, publish); Documentation; Site content (draft, preview, publish → deploy hook; covers homepage, About, Health & Beauty, education, contact, footer per source §9.6); Inquiries; Admin users (owner only); Audit log (read-only: logins, product create/edit/publish, COA changes, document updates, content publishes, per source §9.7).

### 16.10 Security

HTTPS and HSTS on the custom domain; secrets in Cloudflare env only; password handling delegated to WorkOS; server-side role checks on every `/api/admin/*` call; Origin check and same-site cookies on writes; R2 private, files through the Worker; upload type, size, and magic-byte validation; Turnstile + honeypot + rate limit on forms; daily D1 export to R2 retained 30 days. **The catalog is not a security boundary** (source §11.3).

### 16.11 Renewal lapse behavior

PRO lapse (₱1,500/year): unset `ADMIN_ENABLED`, set `CATALOGUE_SOURCE = "none"` (catalog returns 410 Gone with a link to Contact). Public site and chat CTAs keep working. Data retained 90 days, exported on request, then deleted with written notice.

### 16.12 Phase 2 acceptance criteria (maps to source §14)

**2A:** admin login, logout, and protected routes work; unauthorized visitors get 404/401 on `/admin` and `/api/admin/*`; `editor` cannot publish or delete; new products are not visible until published; unpublish removes a product from `/catalog` immediately; search and filters return published products only; every `/catalog` response and file carries `X-Robots-Tag: noindex, nofollow` (`curl -I`); catalog absent from sitemap; documents keep version history and editor attribution; inquiry stores, notifies, acknowledges; audit log records the §16.9 events.
**2B:** COA upload, assign, replace, archive work; search by product and by lot works; spoofed PDFs rejected; no "verified" label rendered.

**Building any of §16 during Phase 1 is scope creep: flag and defer.**

---

## 17. Working rules for the build assistant (Claude Code, Lovable, or equivalent)

- Phase 1 only. No functions, bindings, auth, uploads, catalog, or admin directory.
- All content through `getContent.ts`. No hardcoded strings.
- Do not write product content, dosing, protocols, or usage guides, and do not seed product records, in any phase. The client enters catalog content.
- Every CTA through `CTA`. Hide a channel whose value is null; never invent a link.
- Rose and gold are never text on light backgrounds; use `--rose-ink` and `--gold-ink`.
- No em dashes or en dashes.
- On completion, produce `HANDOVER.md` from Appendix A.

---

## 18. Mandatory deliverable: the handover file

At the end of the build the assistant **must** generate `HANDOVER.md` at the repo root from **Appendix A**. Two readers: (a) Altaventures and The Pep Stop at review, (b) whoever builds Phase 2. No handover = build incomplete.

---

# APPENDIX A: `HANDOVER.md` TEMPLATE

> Copy to `HANDOVER.md` at repo root and fill every field. Write "n/a" if truly not applicable; never leave a bracket.

```markdown
# HANDOVER: The Pep Stop · Phase 1 (Public Website)

**Built by:** Altaventures Business Development Services
**Handover date:** [YYYY-MM-DD] · **Spec version built:** [vN]
**Preview URL:** [pages.dev url] · **Live URL:** [url or "not live: gates open"] · **Repo:** [url]

## 1. What was delivered
- [Routes shipped, per §4.]
- [Placeholders shipped, by PH ID, and why.]

## 2. Run & deploy
- Install `npm install` · Dev `npm run dev` · Build `npm run build`
- Cloudflare Pages, Git-connected, output `dist`. No runtime secrets.

## 3. Where to edit content
- Copy and config: `src/content/site.ts`. Articles: `src/content/articles.ts`.

## 4. Phase 2 activation map
| Constant | Now | Flip to | Turns on | Inputs needed |
|---|---|---|---|---|
| INQUIRY_MODE | chat | form | Inquiry form | 2A built, ★P4, ★P6 |
| CONTENT_SOURCE | static | store | Admin-edited content | content_documents seeded |
| CATALOGUE_SOURCE | none | db | /catalog | ★P1, ★P5 |
| ADMIN_ENABLED | absent | true | /admin | WorkOS, ★P3 |
| COA_ENABLED | absent | true | COA directory | ★P2 |

## 5. Draft and withheld content
- Draft copy: [intro, mission, vision, values, focus areas].
- Unpublished articles: [slugs].
- Hidden channels: [Messenger / Viber / WhatsApp / email, with reason].

## 6. Launch-integrity status
- [ ] ★G1 registration details in footer and Privacy
- [ ] ★G2 logo received; palette re-measured
- [ ] ★G3 service agreement with content-responsibility clause signed [date]
- [ ] No catalog link on public site
- [ ] Banned-vocabulary sweep (run on [date]); justified hits: [list]
- [ ] Licensed imagery only
- Remaining placeholders: [PH IDs]

## 7. Analytics
- Tools: [CF Web Analytics / Pixel]. Conversion = outbound chat or call click.

## 8. Accounts & infrastructure (pointers, never secrets)
- Cloudflare Pages project [name], owner [Altaventures]
- Cloudinary [cloud name] · Repo [url]

## 9. Known limitations / conflicts noted
- [Source vs spec conflicts resolved per §17; justified banned-word hits.]

## 10. Recommended next steps (plain language for The Pep Stop)
- [PRO: admin panel, unlisted catalog you manage yourself, documents, COA directory.]
```

---

# APPENDIX B: Client documents

### B.1 Service agreement clause: content responsibility (add to the agreement signed upon delivery)

> **Client Content.** Altaventures provides website development, hosting, and the administrative tools described in the Specification. All product listings, descriptions, prices, documents, certificates of analysis, images, and other material entered, uploaded, or published by the Client or its users ("Client Content") are created and controlled solely by the Client. The Client represents that it holds all licenses, registrations, and authorizations required to advertise, offer, and sell any product included in Client Content, and is solely responsible for its accuracy and legality. Altaventures does not review, approve, or verify Client Content and provides no medical, regulatory, or legal advice. The Client shall indemnify Altaventures against claims arising from Client Content. Altaventures may suspend access to any Client Content upon receipt of a lawful order or a request from a government authority or hosting provider.

_(Template wording only. Altaventures should have it reviewed by its own counsel before use.)_

### B.2 Message to The Pep Stop (send as one message)

> Hi! Thank you for choosing Altaventures for The Pep Stop website. Here's how the build works.
>
> **Your public website (STARTER)** presents The Pep Stop as a health and beauty brand: home, about, health and beauty, wellness articles, and contact by Messenger and phone.
>
> **Your product catalog (PRO)** is a private-link catalog that you manage yourself through your admin panel: products, variants, documents, and COAs. It's hidden from Google, but anyone with the link can view it. Since you'll control everything listed there, our service agreement includes a clause confirming that the catalog content and its product authorizations are your responsibility.
>
> **What we need from you**
> 1. Your DTI or SEC registration.
> 2. Your logo file.
> 3. Your business Gmail and Facebook Page link.
> 4. Whether 0991 018 9669 is on Viber or WhatsApp.
> 5. Your business hours.
> 6. Your review of the introduction, mission, and vision we'll draft.
> 7. If you take PRO: your preferred domain name (registered in your business name) and admin email addresses.
>
> Thank you, and we look forward to building this with you.

### B.3 Privacy Policy outline
Who we are (★G1) and privacy contact · What we collect (Phase 1: what you send by chat, phone, or email; cookieless analytics. Phase 2: inquiry form submissions) · Why · Who can access it · How long we keep it · Your rights under the Data Privacy Act of 2012 (RA 10173) · Changes. Legal review is the client's responsibility.

---

# APPENDIX C: Review log (what changed from the source spec, and why)

| # | Source issue | Resolution |
|---|---|---|
| C-1 | Source made checkout, dosing publication, and product activation conditional on client-supplied regulatory evidence, enforced by the builder | Per Chief Alta (v1.1): builder does not enforce. Platform is a client-managed CMS; responsibility recorded contractually (Appendix B.1, ★G3) |
| C-2 | Catalog would be served on Altaventures' free ALTASME subdomain | Catalog only on a client-registered domain (§1, ★P5) |
| C-3 | "Product guidelines" and "dosing information" modules | Merged into a generic documentation editor; Altaventures authors no product or dosing content (§16.4, §17) |
| C-4 | Cart, payment, and order tables reserved "if legally approved" | Not reserved; new spec if requested (§10) |
| C-5 | STARTER included "contact and inquiry integration" (a form) | House rule: PII capture is Phase 2. Phase 1 is chat and phone (§8, §16.6) |
| C-6 | Logo referenced as "supplied" but not supplied | ★G2 gate, PH-03 wordmark |
| C-7 | Palette named without values; rose and gold fail as text on ivory | Hex values set, contrast measured, `rose-ink` and `gold-ink` derived (§6) |
| C-8 | Phone stored as "09910189669" | Display "0991 018 9669", `tel:+639910189669` |
| C-9 | Role-based permissions unspecified | `owner` publishes and manages users, `editor` drafts (§16.2) |
| C-10 | Catalog rendering unspecified; unpublish could wait for a rebuild | `/catalog` rendered per request from D1 (§16.2) |
| C-11 | COA "verification status" field risked a public "verified" badge | Kept as internal note, never rendered (§16.7) |
| C-12 | Meta Pixel not addressed for catalog pages | Not on catalog routes (§11) |
| C-13 | robots.txt guidance correct (kept); headers on R2 files unspecified | Files served via Worker with `X-Robots-Tag` (§16.5) |
| C-14 | **Commercial (internal):** PRO at ₱1,500 covers WorkOS roles, catalog CMS, versioned documents, COA directory, inquiry backend, and audit log | Pricing kept verbatim per house rule. Flagged once for Chief Alta's review |
| C-15 | **Risk note (internal, for Chief Alta):** the client described some products as gray market. The contract clause shifts content responsibility but does not remove Altaventures' exposure as builder, host, and account holder. Hosting providers can suspend accounts over reported content, which would affect other sites on the same Cloudflare account | Recommended: put the catalog on a Cloudflare account separate from other Altaventures client sites, or the client's own account |
| C-16 | No handover deliverable | §18 + Appendix A |

**END OF SPEC**
