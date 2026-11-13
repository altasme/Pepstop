# HANDOVER: The Pep Stop · Phase 1 (Public Website)

**Built by:** Altaventures Business Development Services
**Handover date:** 2026-11-11 · **Spec version built:** v1.25 (storefront added per client direction; logo and palette applied)
**Preview URL:** https://pepstop.altasmeworks.workers.dev (moved to the dedicated account 2026-11-13, noindex) · **Live URL:** not live: gates open · **Repo:** altasme/pepstop

## 1. What was delivered
- Routes, all prerendered: `/`, `/about`, `/health-beauty`, `/education`, `/education/:slug` (published articles only; none published yet, so none generated), `/contact`, `/privacy`, `/404` plus `404.html`.
- Also generated at build: `sitemap.xml` (public routes only), `robots.txt`, `_headers` (security headers, noindex on pages.dev hosts).
- **Storefront (v1.2):** `/shop` (search, category filter, sort), `/shop/:slug` (variants, quantity, add to cart, ask about product), `/cart`, `/checkout` (validated delivery form, GCash, Maya, bank transfer choice; cash on delivery hidden until the client confirms it), `/checkout/confirmation`. Home shows featured products and a "shopping with us" business strip alongside the brand sections.
- **How orders work now:** the cart lives in the browser (localStorage). Placing an order stores a summary in sessionStorage and shows the confirmation screen. Nothing is transmitted by the site. The customer sends the prefilled summary by text or WhatsApp (when enabled), copies it for Messenger or Viber, or calls. No payment is collected. `src/lib/orders.ts` `submitOrder` is the single place the Phase 2A orders endpoint plugs in.
- **Products are labeled sample slots** (`src/content/products.ts`): generic names, no descriptions, claims or prices (the cart and order summary say "Confirmed when we reply"). Sample products are noindex and excluded from the sitemap. The client replaces them and removes `isSample`. Altaventures does not author product content.
- Front end only. No `functions/`, `admin/`, `catalog/`, API calls, forms, cart or payment code. `npm run audit:content` enforces this.
- Phase 2 readiness: activation constants in `site.ts`, a single content seam in `getContent.ts`, Article and FocusArea shapes that match the Phase 2A store, Cloudinary helper in `src/lib/media.ts`, reserved routes documented in `src/App.tsx`.
- **Logo (★G2 closed):** supplied as an SVG wrapping two embedded PNGs (a masked raster, not vector paths). Kept untouched in `design/logo-original.svg` (2.4 MB, not deployed). Web exports are in `public/images/` (160, 320, 640 px WebP). A true vector or a clean transparent PNG at 2000 px or more would be better for print and large displays; ask the designer if needed.
- **Palette re-measured against the logo (two-pass: 32-step bucket clustering, then per-family RGB mean).** Logo families: crimson #940219, raspberry #C30239, hot pink #EA0662, gold #ECB86C, cream #FAEDE4. Tokens now: magenta #C30239, magenta-deep #7A0220 (darker shade of the logo crimson), rose #F0829F, rose-ink #B3103F, gold #ECB86C, gold-ink #7A5712. Measured contrast: charcoal on ivory 14.91, magenta on ivory 5.97 and blush 5.35, white on magenta 6.20, magenta-deep on ivory 10.89, white on magenta-deep 11.31, gold on magenta-deep 6.27, rose-ink on ivory 6.61 and blush 5.92, gold-ink on ivory 6.32 and blush 5.66. Rose on ivory 2.41 and gold on ivory 1.74 fail, so they stay decorative only.
- Placeholders still shipped (none of them are generated images). Each renders canvas size, aspect ratio and file type:

| ID | Where | Canvas | Ratio | Type |
|---|---|---|---|---|
| PH-01 | Home hero, desktop, full bleed (subject right 40 percent, clean light area left 55 percent) | 2400 × 1000 px | 12:5 landscape | JPG or WebP |
| PH-01 | Home hero, phone crop (subject centered, 15 percent margin) | 1200 × 1000 px | 6:5 landscape | JPG or WebP |
| PH-02 | Focus tiles (Home, Health & Beauty), 3 images | 1200 × 900 px | 4:3 landscape | JPG or WebP |
| PH-10 | Brand story image (Home "Behind the shop" and About): a real photo of the shop, team or packing table | 1200 × 1500 px | 4:5 portrait | JPG or WebP |
| PH-09 | Product images (shop cards, product page, cart), one per product | 1000 × 1000 px | 1:1 square | JPG or WebP |
| PH-03 | Logo: **supplied, closed.** Header and footer badge plus live wordmark text | 640 × 640 px (source 1218 × 1218) | 1:1 | WebP, transparent |
| PH-03 | Favicon (192 and 48 px) and Apple touch icon (180 px): **derived from the logo** | 192 × 192 px | 1:1 | PNG |
| PH-03 | Open Graph image: **logo on ivory** | 1200 × 630 px | 40:21 | PNG |

  Slots live in `IMAGE_SLOTS` in `src/content/site.ts`. To replace one: upload to Cloudinary, set `MEDIA.cloudName`, then set the slot `src` (or `FocusArea.image`, `ORG.logo`). The placeholder disappears automatically.

## 2. Run & deploy
- Install `npm install` · Dev `npm run dev` · Build `npm run build` · Audit `npm run audit:content` (after build) · Types `npm run typecheck`
- **Cloudflare Worker with static assets, D1 and R2.** `wrangler.jsonc`: worker `pepstop`, entry `worker/index.ts`, assets `./dist` (binding `ASSETS`, Worker runs first), D1 `pepstop_db` (binding `DB`, migrations in `migrations/`), R2 `pepstop-files` (binding `FILES`). The Worker serves `/api/public/*`, `/api/admin/*`, `/files/*`, the admin shell at `/admin`, and falls back to the prerendered `/shop/_` and `/education/_` shells for database products and articles.
- Build: `npm run build` (public site prerender, sitemap, then the admin app into `dist/admin`). Checks: `npm run typecheck`, `npm run audit:content`.
- Database: `npm run db:migrate` (remote) and `npm run db:migrate:local`. Migrations are version-controlled and the seed only adds the five categories and default settings.
- Deploy: `npm run deploy` (builds, then `wrangler deploy`). Local run on the Workers runtime: `npm run dev:worker` (put local secrets in `.dev.vars`, which is gitignored).
- **Fallback deploy:** `npm run deploy:inline` bundles the Worker with `dist/` embedded in one script and deploys it with the same bindings. It was used because the static assets upload step is rejected (401) inside the build sandbox. From a normal machine use `npm run deploy`.
- **Worker secrets (never committed):** `ADMIN_BOOTSTRAP_PASSWORD` provisions the first administrator (username `admin`) on the first sign-in attempt when the admins table is empty; the account must change it at first login. `ADMIN_RESET_TOKEN` powers the administrator reset screen and is held by the developer team, not the client. Set with `npx wrangler secret put NAME`.
- Headers come from `public/_headers`. Custom domain: add it under the Worker, Settings, Domains and Routes.

## 2.5 Design system (v1.5 redesign)
- Premium, feminine, brand-led beauty store with Glossier and Rare Beauty as craft bar. Raspberry lacquer hero, white sections, petal panels, claret footer, plum ink. Bodoni Moda headings with Hanken Grotesk body and UI. The logo's sparkle is the only motif.
- **Categories (client-set):** Weight & Wellness, Next-Generation Wellness, Skin & Beauty, Vitality & Cellular Health, Energy & Cellular Wellness. Defined in `FOCUS_AREAS` (site.ts) and `PRODUCT_CATEGORIES` (products.ts); they drive Home tiles, Shop filters and the Health & Beauty page.
- **Pep Match:** the invented sales device. A goal-led "What are you shopping for today?" row plus a "Not sure where to start? Get matched" panel that hands the shopper to a person by one message (SMS and WhatsApp prefilled, Messenger and phone open blank). It promises navigation and a reply, nothing else. Flat placeholders (hairline, diagonal cross) state canvas size, aspect ratio and type. Home: announcement bar, hero, shop by category, featured range, curated statement, how ordering works, education (hidden until an article is published), raspberry contact band.
- Direction contract: `.impeccable/surfaces/`. Design record: `DESIGN.md`. Product record: `PRODUCT.md`.
- Slop removed: cream gradients, gold arcs, serif display, eyebrow labels, icon-on-card grids, shadowed floating cards, hover lift. `impeccable detect` reports no findings on `src`.

### Motion and vector system (v1.12)
- Components: `Sprig` (botanical line art), `SparkleField` and `Sparkle` (logo stars), `Marquee` (collections ticker), `RuleItem` (drawing hairline), `Reveal`, `Parallax`; hook `useReveal`; keyframes and reduced-motion switches at the end of `src/index.css`.
- Copy-free and decorative: all `aria-hidden`; nothing hides content without JavaScript; `prefers-reduced-motion` shows the final state with no movement.
- To retune: sprig placement is per section (search `Sprig` and `SparkleField`); timing lives in the `--ease` token and the keyframe durations in `index.css`.

### Image sizes for every screen (hero)
| File | Used at | Ratio | Recommended size | Status |
|---|---|---|---|---|
| Hero, desktop | 1280 px and up | 12:5 | 3200 × 1333 (minimum 2400 × 1000) | Supplied at 1944 × 809: sharp on standard screens, soft on retina and 4K |
| Hero, phone and tablet | under 1280 px | 6:5 | 1800 × 1500 (minimum 1200 × 1000) | Supplied at 1374 × 1145; shown at 6:5 on phones, 16:9 on large phones, 2:1 on tablets |
| Optional: social share | link previews | 1.91:1 | 1200 × 630 | Currently the logo on ivory |
- Safe zone for the 6:5 file: keep every face between 25 and 55 percent of the height so the wider tablet crops keep all faces. Safe zone for the 12:5 file: subjects in the right 53 percent, headroom at least 20 percent, left 45 percent clean and light.
- Export WebP, quality 80 to 85, about 250 KB for desktop and 150 KB for phone, sRGB.
- Origin and licence of the supplied photographs must be confirmed by the client before launch (spec §6 and §12.6: licensed imagery, no AI-generated imagery).

### Hero image brief
- Two files from the same shoot: desktop 2400 × 1000 and phone 1200 × 1000. Set their Cloudinary ids on `IMAGE_SLOTS.hero.src` and `IMAGE_SLOTS.heroMobile.src` in `src/content/site.ts`.
- Left 55 percent of the desktop image must be a clean, light, low-contrast area (blush to white) so claret text passes AA. Keep the subject's head and key product inside the right 40 percent and the middle 75 percent of the height.
- Real photography only (spec §6, §12.6). If any AI-assisted editing is used, it must be limited to extending background, cropping and colour matching; never change the subject, the product, its label text, or imply results.

## 3. Where to edit content
- Copy and config: `src/content/site.ts`. Articles: `src/content/articles.ts`. Read through `src/content/getContent.ts`.
- Dev server shows unpublished article drafts at `/education/:slug` (marked Draft). Production builds never do.

## 4. Activation map (v1.21, private catalog)
| Constant or switch | Now | Notes |
|---|---|---|
| INQUIRY_MODE | form | Contact page form posts to `/api/public/inquiries` (honeypot, rate limit, no medical history) |
| CONTENT_SOURCE | store | Published website text overrides built-in copy field by field (`src/lib/remote.ts`) |
| CATALOGUE_SOURCE | db | Published products replace the sample slots; with none published, samples stay |
| ADMIN_ENABLED | on | `/admin` and `/api/admin/*` are live; remove the Worker route or secret to switch off |
| COA library | on, private | `/coa` and `/files/coa/*` open only to approved customers (and administrators); published documents only, never labeled verified |
| Catalog access | approved customers only | Registration, manual approval, backend checks on every request (see section 9) |
| COMMERCE_MODE | database orders, manual payment | Orders are saved by the Worker; no payment is collected or verified automatically |

## 5. Draft and withheld content
- Draft copy: Home "Why shop with The Pep Stop" lines (the payment line lists methods the checkout offers; the client confirms which they accept), intro, mission, vision (`missionStatus` is "approved", so no draft note shows on About; set it back to "draft" to bring the note back), values, focus areas, About text, Privacy Policy; also the Home lines "Our range is kept short so questions are easy to answer" and "Message or call and we will talk it through with you", whose range and curation wording is the owners' to confirm; and the whole site's v1.16 emotional copy (hero headline, collection taglines and summaries, story, Why, ordering steps, About, Contact). The copy addresses women by client direction; the client should confirm the audience wording and approve every line before launch.
- Unpublished articles: `building-a-simple-skincare-routine`, `why-sleep-shows-on-your-skin`, `reading-a-product-label`. Education shows "Articles are coming soon." and Home hides the highlights until one is published.
- Sample products 1 to 6 (labeled, zero price) until real data is supplied. Shipping fee, payment instructions, payment account details and delivery areas are not stated anywhere yet and need client input.
- Hidden channels: Messenger (★C3 Facebook URL missing), Viber and WhatsApp (★C4 unconfirmed), email (★C2 missing). Only Call and Text render. Business hours (★C6) hidden.

## 6. Launch-integrity status
- [ ] ★G1 registration details in footer and Privacy (PH-06 omitted until supplied)
- [x] ★G2 logo received 2026-11-11; palette re-measured
- [ ] ★G3 service agreement with content-responsibility clause signed [date pending]
- [x] No hidden catalog: the shop is public and linked. Admin, `/api`, COA routes absent (audit checks the built output)
- [x] Banned-vocabulary sweep run 2026-11-11 over `src/content`; justified hits: none
- [x] Licensed imagery only (no images shipped)
- Remaining placeholders: PH-01, PH-02, PH-04, PH-05, PH-06, PH-07, PH-09 (PH-03 closed)

## 7. Analytics
- Tools: Cloudflare Web Analytics loads only when `ANALYTICS.cfBeaconToken` is set (★C8). Meta Pixel is not loaded; ID slot exists, public routes only. Conversion = outbound chat or call click. Events: `cta_*_click`, `article_view`, payloads `{ page, cta }` or `{ slug }` only. Events also dispatch a `pepstop:event` window event.

## 8. Accounts & infrastructure (pointers, never secrets)
- Cloudflare Worker `pepstop` with D1 `pepstop_db` and R2 `pepstop-files`, in a dedicated account (Altasmeworks@gmail.com's Account, subdomain `altasmeworks`), separate from other Altaventures client sites as Appendix C-15 recommends. The earlier Worker on the shared account (`pepstop.vanamaranto1.workers.dev`) is superseded; remove it and its empty D1 database and R2 bucket there once the client confirms the new address.
- Cloudinary: cloud name not set · Repo: altasme/pepstop

## 9. Known limitations / conflicts noted
- **Category names are health-adjacent.** "Weight", "Cellular Health" and "Cellular Wellness" read as health claims in some advertising and platform policies (Meta restricts health-related product signals, and Philippine FDA rules apply to claims about specific products). The names are the client's choice and are used as labels only. Builder-written copy under them is general and promises no results. Any product copy, results language, before-and-after material or testimonials the client adds is client content under Appendix B.1 and should be reviewed by the client's own counsel before publishing, and before any paid advertising.
- **Spec conflict, resolved in favor of the client's direction:** CLAUDE.md v1.1 set `COMMERCE_MODE = "none"`, kept products in an unlisted catalog on the client's own domain, and said checkout would be a new spec. The client asked for an ecommerce store that also showcases the business, so v1.2 builds the storefront front end only. The responsibility questions behind the old rules still apply: product listings, prices, claims, and registration details are client content (Appendix B.1), ★G3 should be signed before real products go live, and the Appendix C-15 hosting-account risk note stands. Raise with Chief Alta before launch.
- **Client copy refresh (v1.18):** all page copy now follows the client's "E-Commerce Website Copy Refresh" document. Three calls to confirm with the client: cash on delivery is hidden (flip `PAYMENT_METHODS` in `site.ts` once supported); the document's eyebrow labels are not rendered; the audit exempts only the exact phrase "diagnosis, or treatment guidance" in the client's product disclaimer (the word "treat" is otherwise banned, spec section 12). The five category taglines and summaries are still the earlier v1.16 text; the client's document asks that taglines stay as they are, so confirm those too.
- **Client imagery (v1.19):** the five collection images, brand story image and product image were supplied by the client and are wired in. The product and story images show branded gift boxes that look like rendered mockups, and some photographs may be AI-generated; CLAUDE.md §6 and §12.6 allow licensed imagery only, so the client must confirm origin and licence before launch. All six sample products currently share the one product image; replace per product when real photos exist.
- **Admin panel built against the Phase 1 only rule (v1.20).** CLAUDE.md v1.1 to v1.19 reserved admin, database, COA and orders for Phase 2 and said not to build them. The client's Admin Panel specification asked for them, so v1.20 supersedes those rules. The reasons for the old rules still apply: product listings, prices, claims, documents and registration details are client content (Appendix B.1); ★G3 should be signed before real products go live; and the Appendix C-15 risk stands (see the shared-account note below).
- **Cloudflare account separation (done 2026-11-13).** The database, bucket and Worker were first created on the shared Altaventures account, then moved to a dedicated account per Appendix C-15. The Worker secrets must be set on the new account (`npx wrangler secret put`), and a custom domain, when added, goes on this account.
- **Password hashing is PBKDF2-SHA256 (100,000 iterations), not Argon2id or bcrypt.** Neither is available in the Workers runtime and 100,000 is the platform maximum. Passwords are salted, never returned by the API, never in local storage. Sessions are random 256-bit tokens, stored hashed, in HttpOnly Secure SameSite=Strict cookies.
- **Temporary password.** The specification contains the initial password in plain text. It is stored only as the Worker secret `ADMIN_BOOTSTRAP_PASSWORD`, never in source (the audit fails the build if it appears). On 2026-11-13 the administrator account was provisioned and the client changed the temporary password at first login (the activity log shows it). The bootstrap secret only matters while the admins table is empty, so it can be deleted from the Worker. `ADMIN_RESET_TOKEN` is held by the developer team and is needed only for the Forgot password screen.
- **Critique and polish pass (v1.23).** An isolated design review and a detector and browser measurement run scored the public site 26/40 and the admin 25/40 and listed the changes now made (see CLAUDE.md v1.23 and DESIGN.md). The detector reports 0 findings. Left as they are, deliberately: the client's own wording (Title Case headings and the repeated "we're here to help" phrasing came from their copy document, and you asked for structure fixes only, so rewriting them needs the client's sign-off); the photography (the story and product images look like off-palette mockups and their licence is unconfirmed); and the private-catalog login wall (no product preview before registering, a product decision, not a design fix).
- **Admin notification counters.** Orders, Customers and Inquiries show how many items are waiting. Counts refresh every 30 seconds while the tab is open, when it regains focus and on each page change; the browser tab title shows the total. There is no sound, email or push notification: the admin must have the panel open to see them. Adding email or Messenger alerts would need a provider and recipient addresses.
- **Admin branding (v1.22).** The admin panel uses the public brand system (see DESIGN.md, Admin panel) instead of the navy accents the admin specification suggested, per the client's request.
- **Categories.** The specification names four categories (Weight & Metabolic Research and others). The client's five categories (Weight & Wellness and others) were already live, and the specification says to preserve existing assignments, so the five are seeded and remain editable. The "Research" wording is not used on the site.
- **Search visibility.** The specification asks for noindex. The setting defaults to Hidden, which adds `X-Robots-Tag: noindex, nofollow` to public pages and withholds `sitemap.xml`. Admin, API and files are always noindex. This is a request to search engines, not access control. Private pages (`/shop`, `/cart`, `/checkout`, `/coa`, `/account`) are always noindex and are never in the sitemap; real protection is the login described below.
- **Product information and guidelines** share one table (`product_information`, section `guidelines`). A guideline cannot be published until a person marks it Reviewed. The system generates no dosing, claims or recommendations.
- **Payments.** Customers can submit a reference number and optional proof; proof files are private (admin only). Nothing is verified automatically; an administrator marks each payment verified or rejected.
- **Backups.** D1 Time Travel gives point-in-time restore for 30 days. A restore test and scheduled exports to R2 are not set up and are listed under next steps.
- **Not built:** email or SMS notifications, image resizing, multiple roles, scheduled backups, automated end-to-end tests in CI. The rich-text editor is a lightweight toolbar; output is sanitized to a short allow-list on the server.
- **Public JS and code splitting.** Every page except Home loads on demand (`src/App.tsx`). Total JavaScript per page is about 105 KB (Home) to 110 KB (checkout confirmation, the heaviest) gzipped, against the 120 KB budget, so roughly 10 KB of headroom. Most of the weight is React, the router and the shared site copy, which every page needs. Further savings would need splitting the large copy file or replacing the icon library. The admin app is a separate 73 KB bundle that public visitors never load.
- **Private catalog (v1.21).** The public shop and public COA directory were replaced by a login-gated catalog. Visitors see brand pages only. The Worker returns 401 or 403 to visitors and to pending, rejected and suspended accounts for the catalog API, product images, certificates, cart and orders, and re-reads the account status on every request, so a suspension takes effect on open sessions at once. This was tested end to end (63 API checks and a browser run). Frontend redirects are only the friendly layer.
- **Phone OTP is not built.** It needs an SMS provider and the client has not confirmed it. Registered phone numbers are therefore unverified; the admin profile says so. Approval is the only gate.
- **No customer password recovery yet.** A customer who forgets a password cannot reset it themselves, and the admin panel has no "set a new password" action for customers. This is a gap to close next (an administrator-issued temporary password is the simplest fit).
- **Regulatory gate.** A product must be marked Verified for Intended Sale before it can be published; the server enforces this on every save and status change, and moving a product out of Verified unpublishes it immediately. The administrator sets the review status; the system cannot judge legality and does not. The client remains responsible for each product's authorization (Appendix B.1). Existing products were set to Unpublished and Pending Review by the migration.
- **"Unpublished" status** is stored as a draft flag (`unpublished = 1`) because SQLite cannot alter the status constraint and D1 blocks the table rebuild; the API presents it as its own status.
- **Product images are private.** Product photos upload to `catalog/` and are served only to approved customers and administrators. Site images (hero, journal, category) stay public. A product image URL copied out of the admin panel will not load for the public.
- **Order identity.** Orders take the customer's name and phone from the approved account; the checkout form no longer asks for them.
- The cart cannot verify stock or compute shipping; both are confirmed by The Pep Stop after the order is sent.
- Nav button label: spec says "Message Us". While Messenger is hidden the primary CTA is the phone, so the button reads "Call Us" to stay truthful. It switches to "Message Us" when ★C3 is supplied.
- `ORG.intro` is a two-item array instead of one string, to render the two paragraphs.
- Article gained an optional `focusAreaId` to link articles to Health & Beauty sections.
- The spec said Cloudflare Pages; deployment is Workers static assets per the client. Verified locally with `wrangler dev`: all routes return 200, unknown URLs return 404 with the branded page, `/shop/` redirects to `/shop`. Verified on the live deploy: routes return 200, unknown URLs 404, and `x-robots-tag: noindex` is sent on the workers.dev URL.
- Vite 6 is used because `vite-react-ssg` requires Vite 6 or later.
- The logo is a glossy, saturated raster badge. The site palette follows it, but the badge stays small in the header (44 to 56 px) with the name as live text beside it, because the lettering inside the badge is not legible at that size. The footer and mobile menu place it on an ivory circle so it reads on the dark background.
- Not yet done (needs real devices or client input): tap test of every CTA on Android and iPhone, Lighthouse run on the deployed preview, client review.
- Banned-vocabulary hits: none.

- v1.24 finishing pass: the mobile menu now renders in a portal on the page body (a fixed element inside the blurred header was only 72px tall); header navigation switches to the menu at 1280 px because the row overflowed at 1024 px; Contact is two columns; duplicate disclaimer and placeholder sentences removed. Checked at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px with no horizontal overflow; content audit and design detector report no findings.

- v1.25 copy rewrite: all customer-facing text in `src/content/site.ts` was rewritten in a plainer, more commercial voice (see CLAUDE.md v1.25). The client should still read every page and approve the wording; unpublished articles in `src/content/articles.ts` were not changed.

### Hand-over checklist: only the client can supply these
| Item | Where it goes | Until then |
|---|---|---|
| Business registration (DTI or SEC) and address, ★G1 | `ORG.legalName`, `ORG.registration` in `src/content/site.ts` | Footer legal line and Privacy registration sentence are omitted |
| Privacy approval, retention period and privacy contact, ★C7 | `LEGAL.privacyStatus`, `LEGAL.retention`, `LEGAL.privacyContact` | Red "draft" banner stays on Privacy |
| Facebook Page, business email, hours, Viber or WhatsApp, ★C2 to ★C6 | `CONTACT` | Hidden; Call and Text show |
| Real products, photos, prices, payment instructions, delivery details | Admin panel | Catalog is empty; customers see "Log in to view products" |
| Origin and licence of all supplied photographs | Confirm in writing | Required before launch |
| Custom domain in the client's name | `SEO.siteUrl`, Worker route | Site uses the workers.dev address |
| Signed service agreement, ★G3 | Agreement | Open |
| Customer password recovery and phone OTP | Needs an SMS provider and a scoped spec | Not built; the administrator resets access |

## 10. Recommended next steps (plain language for The Pep Stop)
- Send us your registration, logo, Facebook page link, business email, hours, and whether your number is on Viber or WhatsApp. Review the draft introduction, mission and vision.
- Supply licensed photos to the sizes listed above, and tell us which articles to publish.
- PRO: admin panel, an unlisted catalog you manage yourself, documents and a COA directory, on a domain registered in your business name.
