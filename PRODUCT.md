# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Existing codebase: React 18, Vite 6, TypeScript, Tailwind 3, vite-react-ssg (build-time prerender). Deployed as static assets on Cloudflare Workers (`wrangler.jsonc`). Front end only; no backend, database or payment processing.

## Users
Primary: Philippine adults 30 to 60 who find The Pep Stop on Facebook or Messenger, browse on a phone, compare options, and want to ask a person before ordering. Mixed gender. They convert by message or call, not by paying on the site.

## Product Purpose
A hybrid site for The Pep Stop, a health and beauty brand: it presents the business (who it is, how it serves, what it believes) and sells a curated range through a storefront (shop, product pages, cart, checkout). Success is a visitor who trusts the brand and sends an order or a question by message or phone.

## Positioning
A curated range, chosen by the owners, sold with plain information and a real person on the other end of every order and question. Orders are confirmed personally, not by a faceless checkout.

## Operating Context
Checkout is front end only (COMMERCE_MODE "frontend"): the cart and order live in the browser and the customer sends a prefilled summary by SMS, WhatsApp, Messenger or phone. No payment is collected on the site. Payment methods offered to arrange: GCash, Maya, bank transfer, cash on delivery. Shipping fee, payment account details and delivery areas are not yet defined.

## Capabilities and Constraints
- Routes: Home, Shop, Product, Cart, Checkout, Order summary, About, Health & Beauty, Wellness Education (articles), Contact, Privacy, 404.
- All copy and config in `src/content/site.ts`, products in `src/content/products.ts`, articles in `src/content/articles.ts`, read through `src/content/getContent.ts`.
- Products are labeled sample slots; the client supplies real records. The builder never writes product descriptions, claims, dosing or usage guidance.
- Phase 2 (admin, database, COA directory, live payments) is reserved and not built.
- Spec: CLAUDE.md (v1.4) governs content rules, launch integrity, banned vocabulary and handover.

## Brand Commitments
- Name: The Pep Stop, descriptor Health & Beauty.
- Supplied logo (glossy crimson, raspberry and hot-pink script badge with gold outline, transparent, 1:1) in `public/images/` and `design/logo-original.svg`. It is binding; the site palette must come from it.
- Voice: warm, composed, plain, Philippine English. No hype words.
- No fabricated proof, no health claims in builder-written copy, no AI-generated imagery, licensed imagery only. Image slots render registered placeholders stating canvas size, aspect ratio and type until real photography is supplied.
- Phone 0991 018 9669 is the always-on channel; Messenger, Viber, WhatsApp and email appear only when confirmed.

- Standing preference (chosen by the user, 2026-11-11): the category standard played straight, a clean premium beauty store, with Glossier and Rare Beauty as the craft bar (soft, friendly, mobile-first, strong product tiles). Not a themed or novelty world.

## Evidence on Hand
Logo files. Draft intro, mission, vision and three unpublished general articles. No photography, testimonials, customer counts, awards or real product data; none may be invented.

## Product Principles
1. The curated range is the product: show fewer things, better.
2. A person is always one tap away: message and call are never buried.
3. Plain information beats persuasion; claims stay modest and honest.
4. Mobile first: the Facebook visitor on a phone is the primary scene.
5. Placeholders are honest about what is missing.

## Accessibility & Inclusion
WCAG 2.1 AA, 44px touch targets, visible focus, keyboard-operable menu, prefers-reduced-motion respected, no horizontal overflow from 320px.
