# HANDOVER: The Pep Stop · Phase 1 (Public Website)

**Built by:** Altaventures Business Development Services
**Handover date:** 2026-11-11 · **Spec version built:** v1.3 (storefront added per client direction; logo and palette applied)
**Preview URL:** not yet deployed (connect repo to Cloudflare Pages) · **Live URL:** not live: gates open · **Repo:** altasme/pepstop

## 1. What was delivered
- Routes, all prerendered: `/`, `/about`, `/health-beauty`, `/education`, `/education/:slug` (published articles only; none published yet, so none generated), `/contact`, `/privacy`, `/404` plus `404.html`.
- Also generated at build: `sitemap.xml` (public routes only), `robots.txt`, `_headers` (security headers, noindex on pages.dev hosts).
- **Storefront (v1.2):** `/shop` (search, category filter, sort), `/shop/:slug` (variants, quantity, add to cart, ask about product), `/cart`, `/checkout` (validated delivery form, GCash, Maya, bank transfer, cash on delivery choice), `/checkout/confirmation`. Home shows featured products and a "shopping with us" business strip alongside the brand sections.
- **How orders work now:** the cart lives in the browser (localStorage). Placing an order stores a summary in sessionStorage and shows the confirmation screen. Nothing is transmitted by the site. The customer sends the prefilled summary by text or WhatsApp (when enabled), copies it for Messenger or Viber, or calls. No payment is collected. `src/lib/orders.ts` `submitOrder` is the single place the Phase 2A orders endpoint plugs in.
- **Products are labeled sample slots** (`src/content/products.ts`): generic names, no descriptions or claims, PHP 0.00. Sample products are noindex and excluded from the sitemap. The client replaces them and removes `isSample`. Altaventures does not author product content.
- Front end only. No `functions/`, `admin/`, `catalog/`, API calls, forms, cart or payment code. `npm run audit:content` enforces this.
- Phase 2 readiness: activation constants in `site.ts`, a single content seam in `getContent.ts`, Article and FocusArea shapes that match the Phase 2A store, Cloudinary helper in `src/lib/media.ts`, reserved routes documented in `src/App.tsx`.
- **Logo (★G2 closed):** supplied as an SVG wrapping two embedded PNGs (a masked raster, not vector paths). Kept untouched in `design/logo-original.svg` (2.4 MB, not deployed). Web exports are in `public/images/` (160, 320, 640 px WebP). A true vector or a clean transparent PNG at 2000 px or more would be better for print and large displays; ask the designer if needed.
- **Palette re-measured against the logo (two-pass: 32-step bucket clustering, then per-family RGB mean).** Logo families: crimson #940219, raspberry #C30239, hot pink #EA0662, gold #ECB86C, cream #FAEDE4. Tokens now: magenta #C30239, magenta-deep #7A0220 (darker shade of the logo crimson), rose #F0829F, rose-ink #B3103F, gold #ECB86C, gold-ink #7A5712. Measured contrast: charcoal on ivory 14.91, magenta on ivory 5.97 and blush 5.35, white on magenta 6.20, magenta-deep on ivory 10.89, white on magenta-deep 11.31, gold on magenta-deep 6.27, rose-ink on ivory 6.61 and blush 5.92, gold-ink on ivory 6.32 and blush 5.66. Rose on ivory 2.41 and gold on ivory 1.74 fail, so they stay decorative only.
- Placeholders still shipped (none of them are generated images). Each renders canvas size, aspect ratio and file type:

| ID | Where | Canvas | Ratio | Type |
|---|---|---|---|---|
| PH-01 | Home hero | 1200 × 1500 px | 4:5 portrait | JPG or WebP |
| PH-02 | Focus tiles (Home, Health & Beauty), 3 images | 1200 × 900 px | 4:3 landscape | JPG or WebP |
| PH-09 | Product images (shop cards, product page, cart), one per product | 1000 × 1000 px | 1:1 square | JPG or WebP |
| PH-03 | Logo: **supplied, closed.** Header and footer badge plus live wordmark text | 640 × 640 px (source 1218 × 1218) | 1:1 | WebP, transparent |
| PH-03 | Favicon (192 and 48 px) and Apple touch icon (180 px): **derived from the logo** | 192 × 192 px | 1:1 | PNG |
| PH-03 | Open Graph image: **logo on ivory** | 1200 × 630 px | 40:21 | PNG |

  Slots live in `IMAGE_SLOTS` in `src/content/site.ts`. To replace one: upload to Cloudinary, set `MEDIA.cloudName`, then set the slot `src` (or `FocusArea.image`, `ORG.logo`). The placeholder disappears automatically.

## 2. Run & deploy
- Install `npm install` · Dev `npm run dev` · Build `npm run build` · Audit `npm run audit:content` (after build) · Types `npm run typecheck`
- Cloudflare Pages, Git-connected, build command `npm run build`, output `dist`. No runtime secrets. Node 20 or later.

## 3. Where to edit content
- Copy and config: `src/content/site.ts`. Articles: `src/content/articles.ts`. Read through `src/content/getContent.ts`.
- Dev server shows unpublished article drafts at `/education/:slug` (marked Draft). Production builds never do.

## 4. Phase 2 activation map
| Constant | Now | Flip to | Turns on | Inputs needed |
|---|---|---|---|---|
| INQUIRY_MODE | chat | form | Inquiry form (slot marked in `Contact.tsx`) | 2A built, ★P4, ★P6 |
| CONTENT_SOURCE | static | store | Admin-edited content (`getContent.ts` throws until built) | content_documents seeded |
| CATALOGUE_SOURCE | static | db | Products from D1 instead of `products.ts` | ★P1, ★P5 |
| ADMIN_ENABLED | absent | true | /admin | WorkOS, ★P3 |
| COA_ENABLED | absent | true | COA directory | ★P2 |
| COMMERCE_MODE | frontend | live | Server-side orders and payment handling | Orders endpoint, payment provider and proof workflow, shipping rules (new scope) |

## 5. Draft and withheld content
- Draft copy: intro, mission, vision (`missionStatus: "draft"`, a note shows on About), values, focus areas, About text, Privacy Policy.
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
- Cloudflare Pages project: to be created, owner Altaventures
- Cloudinary: cloud name not set · Repo: altasme/pepstop

## 9. Known limitations / conflicts noted
- **Spec conflict, resolved in favor of the client's direction:** CLAUDE.md v1.1 set `COMMERCE_MODE = "none"`, kept products in an unlisted catalog on the client's own domain, and said checkout would be a new spec. The client asked for an ecommerce store that also showcases the business, so v1.2 builds the storefront front end only. The responsibility questions behind the old rules still apply: product listings, prices, claims, and registration details are client content (Appendix B.1), ★G3 should be signed before real products go live, and the Appendix C-15 hosting-account risk note stands. Raise with Chief Alta before launch.
- The shop is publicly linked and indexable. If the client wants it unlisted, add noindex to the shop pages and remove it from nav and sitemap.
- The cart cannot verify stock or compute shipping; both are confirmed by The Pep Stop after the order is sent.
- Nav button label: spec says "Message Us". While Messenger is hidden the primary CTA is the phone, so the button reads "Call Us" to stay truthful. It switches to "Message Us" when ★C3 is supplied.
- `ORG.intro` is a two-item array instead of one string, to render the two paragraphs.
- Article gained an optional `focusAreaId` to link articles to Health & Beauty sections.
- Vite 6 is used because `vite-react-ssg` requires Vite 6 or later.
- The logo is a glossy, saturated raster badge. The site palette follows it, but the badge stays small in the header (44 to 56 px) with the name as live text beside it, because the lettering inside the badge is not legible at that size. The footer and mobile menu place it on an ivory circle so it reads on the dark background.
- Not yet done (needs real devices or client input): tap test of every CTA on Android and iPhone, Lighthouse run on the deployed preview, client review.
- Banned-vocabulary hits: none.

## 10. Recommended next steps (plain language for The Pep Stop)
- Send us your registration, logo, Facebook page link, business email, hours, and whether your number is on Viber or WhatsApp. Review the draft introduction, mission and vision.
- Supply licensed photos to the sizes listed above, and tell us which articles to publish.
- PRO: admin panel, an unlisted catalog you manage yourself, documents and a COA directory, on a domain registered in your business name.
