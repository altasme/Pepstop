# HANDOVER: The Pep Stop · Phase 1 (Public Website)

**Built by:** Altaventures Business Development Services
**Handover date:** 2026-11-11 · **Spec version built:** v1.1
**Preview URL:** not yet deployed (connect repo to Cloudflare Pages) · **Live URL:** not live: gates open · **Repo:** altasme/pepstop

## 1. What was delivered
- Routes, all prerendered: `/`, `/about`, `/health-beauty`, `/education`, `/education/:slug` (published articles only; none published yet, so none generated), `/contact`, `/privacy`, `/404` plus `404.html`.
- Also generated at build: `sitemap.xml` (public routes only), `robots.txt`, `_headers` (security headers, noindex on pages.dev hosts).
- Front end only. No `functions/`, `admin/`, `catalog/`, API calls, forms, cart or payment code. `npm run audit:content` enforces this.
- Phase 2 readiness: activation constants in `site.ts`, a single content seam in `getContent.ts`, Article and FocusArea shapes that match the Phase 2A store, Cloudinary helper in `src/lib/media.ts`, reserved routes documented in `src/App.tsx`.
- Placeholders shipped (none of them are generated images). Each renders canvas size, aspect ratio and file type:

| ID | Where | Canvas | Ratio | Type |
|---|---|---|---|---|
| PH-01 | Home hero | 1200 × 1500 px | 4:5 portrait | JPG or WebP |
| PH-02 | Focus tiles (Home, Health & Beauty), 3 images | 1200 × 900 px | 4:3 landscape | JPG or WebP |
| PH-03 | Logo, header and footer (wordmark shown) | 960 × 240 px | 4:1 | SVG preferred, or transparent PNG |
| PH-03 | Favicon (none set) | 512 × 512 px | 1:1 | PNG |
| PH-03 | Open Graph image (tag omitted until supplied) | 1200 × 630 px | 40:21 | PNG or JPG |

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
| CATALOGUE_SOURCE | none | db | /catalog | ★P1, ★P5 |
| ADMIN_ENABLED | absent | true | /admin | WorkOS, ★P3 |
| COA_ENABLED | absent | true | COA directory | ★P2 |
| COMMERCE_MODE | none | not activatable | n/a | New spec (§10) |

## 5. Draft and withheld content
- Draft copy: intro, mission, vision (`missionStatus: "draft"`, a note shows on About), values, focus areas, About text, Privacy Policy.
- Unpublished articles: `building-a-simple-skincare-routine`, `why-sleep-shows-on-your-skin`, `reading-a-product-label`. Education shows "Articles are coming soon." and Home hides the highlights until one is published.
- Hidden channels: Messenger (★C3 Facebook URL missing), Viber and WhatsApp (★C4 unconfirmed), email (★C2 missing). Only Call and Text render. Business hours (★C6) hidden.

## 6. Launch-integrity status
- [ ] ★G1 registration details in footer and Privacy (PH-06 omitted until supplied)
- [ ] ★G2 logo received; palette re-measured
- [ ] ★G3 service agreement with content-responsibility clause signed [date pending]
- [x] No catalog link on public site (audit checks the built output)
- [x] Banned-vocabulary sweep run 2026-11-11 over `src/content`; justified hits: none
- [x] Licensed imagery only (no images shipped)
- Remaining placeholders: PH-01, PH-02, PH-03, PH-04, PH-05, PH-06, PH-07

## 7. Analytics
- Tools: Cloudflare Web Analytics loads only when `ANALYTICS.cfBeaconToken` is set (★C8). Meta Pixel is not loaded; ID slot exists, public routes only. Conversion = outbound chat or call click. Events: `cta_*_click`, `article_view`, payloads `{ page, cta }` or `{ slug }` only. Events also dispatch a `pepstop:event` window event.

## 8. Accounts & infrastructure (pointers, never secrets)
- Cloudflare Pages project: to be created, owner Altaventures
- Cloudinary: cloud name not set · Repo: altasme/pepstop

## 9. Known limitations / conflicts noted
- Nav button label: spec says "Message Us". While Messenger is hidden the primary CTA is the phone, so the button reads "Call Us" to stay truthful. It switches to "Message Us" when ★C3 is supplied.
- `ORG.intro` is a two-item array instead of one string, to render the two paragraphs.
- Article gained an optional `focusAreaId` to link articles to Health & Beauty sections.
- Vite 6 is used because `vite-react-ssg` requires Vite 6 or later.
- OG image and favicon are not set; no tag is emitted and a blank data-URI favicon avoids a 404 until supplied.
- Not yet done (needs real devices or client input): tap test of every CTA on Android and iPhone, Lighthouse run on the deployed preview, client review.
- Banned-vocabulary hits: none.

## 10. Recommended next steps (plain language for The Pep Stop)
- Send us your registration, logo, Facebook page link, business email, hours, and whether your number is on Viber or WhatsApp. Review the draft introduction, mission and vision.
- Supply licensed photos to the sizes listed above, and tell us which articles to publish.
- PRO: admin panel, an unlisted catalog you manage yourself, documents and a COA directory, on a domain registered in your business name.
