---
name: The Pep Stop
description: A premium, feminine, mobile-first health and beauty shop led by the logo's own world of raspberry, pink, gold and sparkle, where the curated range leads and a person is one tap away.
colors:
  ink: "#2B1220"
  claret: "#5A0118"
  raspberry: "#C30239"
  raspberry-deep: "#7A0220"
  petal: "#FFEEF2"
  mute: "#6F5B66"
  line: "#F2D9E1"
  gold: "#ECB86C"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.3rem + 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline-1:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.6vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline-2:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.2vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.33
  wordmark:
    fontFamily: "Bodoni Moda, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "28px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "64px"
  page-max: "80rem"
  prose-max: "40rem"
components:
  button-primary:
    backgroundColor: "{colors.raspberry}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.raspberry-deep}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.raspberry}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.raspberry}"
    textColor: "{colors.white}"
  button-on-dark:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-on-dark-hover:
    backgroundColor: "{colors.petal}"
  announcement-bar:
    backgroundColor: "{colors.raspberry}"
    textColor: "{colors.white}"
    padding: "8px 16px"
  hero:
    backgroundColor: "{colors.raspberry}"
    textColor: "{colors.white}"
    padding: "80px 32px"
  petal-panel:
    backgroundColor: "{colors.petal}"
    textColor: "{colors.ink}"
    padding: "64px 32px"
  footer:
    backgroundColor: "{colors.claret}"
    textColor: "{colors.white}"
    padding: "64px 32px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
  placeholder:
    backgroundColor: "{colors.petal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: The Pep Stop

## Overview

**Creative North Star: "The Raspberry Counter"**

The shop takes its world from the supplied logo: raspberry lacquer, pink, gold and a four-point sparkle. A white page carries plum ink and petal panels. One full-width raspberry field opens the home page and one claret field closes every page. Between them the range is the picture and a person is one tap away. It is a premium, feminine, brand-led store, and it deliberately refuses the older beauty-site tropes: cream grounds, gold arcs, gradient washes, eyebrow labels, and icon-on-card feature grids.

Voice is high-contrast and warm. Bodoni Moda gives headings a fashion-counter polish; Hanken Grotesk keeps body, buttons and product data plain and legible on a phone. Surfaces are flat, separated by hairlines and the petal tint. Imagery is soft, with 20px corners. Gold appears only as a hairline frame and as sparkle on raspberry or claret, never as text on white.

Honesty about missing material is part of the look. Image slots awaiting real photography render as flat petal boxes with a faint raspberry diagonal cross, a raspberry tag with the registry ID, and a caption stating canvas size, aspect ratio and type.

**Key Characteristics:**
- White ground, plum ink, petal panels, one raspberry hero, claret footer.
- Bodoni Moda 500 headings over Hanken Grotesk body, sentence case.
- The four-point sparkle is the single motif.
- Pill controls, 20px imagery and cards, 12px fields.
- Flat surfaces and hairlines; depth by tint, not shadow.
- One authored motion: sections rise into place once.
- Placeholders are flat, labeled and unmistakably placeholders.

## Colors

A raspberry-and-plum palette on white, measured from the logo. Raspberry is saturated and rare: the hero field, the announcement bar, and every action.

### Primary
- **Logo Raspberry** (#C30239): Primary buttons, the home hero field, the announcement bar, nav hover and active text, prices, error text and borders, placeholder tags, form accent (checkbox, radio, caret), text selection, scrollbar thumb. White text on it passes AA.

### Secondary
- **Deep Raspberry** (#7A0220): Heading color on white and petal panels (page banners, section headings on petal, value titles, product name, logo wordmark on light), and hover state of the primary button.
- **Claret** (#5A0118): The footer and the full-screen mobile menu. The dark closing ground.

### Tertiary
- **Logo Gold** (#ECB86C): The thin frame around the hero image, the sparkle on raspberry, and the active link in the mobile menu on claret. Focus ring inside `.on-dark` regions. Never text or icon on white.

### Neutral
- **Plum Ink** (#2B1220): Body text, default focus ring, hero-adjacent text on white, on-dark button text, skip link.
- **Page White** (#FFFFFF): Page ground, cards, fields, the primary text color on raspberry and claret.
- **Petal Tint** (#FFEEF2): Page banners, the curated and contact panels, placeholder ground, on-dark button hover, scrollbar track.
- **Hairline Petal** (#F2D9E1): Borders on cards, fields, the scrolled header rule.
- **Muted Plum Grey** (#6F5B66): Secondary text: category names, availability, placeholder specs, wordmark descriptor.

### Named Rules
**The One Drench Rule.** Raspberry floods a surface once per page: the home hero field. Other raspberry is a control, a thin bar, or a mark, never a second full section.

**The Gold-On-Deep Rule.** Gold exists only against raspberry or claret, as hairline, sparkle or active link. On white it fails contrast and is not used.

**The Deep-Heading Rule.** Headings on light grounds are Deep Raspberry or Ink; bright raspberry stays with actions, prices and numerals.

## Typography

**Display Font:** Bodoni Moda (with Georgia, serif), weights 500 and 600
**Body Font:** Hanken Grotesk (with system-ui, sans-serif), 400 to 700
**Label Font:** Hanken Grotesk 500 to 600

**Character:** A high-contrast Didone for headings against a plain humanist grotesk for everything functional. Display sits at 500 with slight negative tracking; the wordmark is the only 600. Numerals in Hanken are tabular (`tnum`) and the `ss01` alternate is on.

### Hierarchy
- **Display** (500, clamp 2.5rem to 5rem, 1.02, -0.02em): Home hero headline, white on raspberry.
- **Headline 1** (500, clamp 2.25rem to 4rem, 1.06, -0.02em): One H1 per inner page, Deep Raspberry on the petal banner.
- **Headline 2** (500, clamp 1.75rem to 3rem, 1.1, -0.015em): Section headings, capped at 22ch, balanced wrap.
- **Title** (Bodoni 500, 1.5rem): Category names, value titles, article cards. How-it-works numerals are Bodoni 500 at 3rem in raspberry.
- **Body** (Hanken 400, 16px, 1.5): Running text, never below 14px; lead text 18 to 20px at 80% ink, prose capped at 40rem. Product titles are Hanken 600 at 16 to 18px.
- **Label** (Hanken 500 to 600, 14 to 16px): Buttons, nav (15px), badges (12px 600), product meta (14px). Mobile menu links are Hanken 600 at 1.875rem.

### Named Rules
**The Heading Carries Itself Rule.** No small label sits above a heading. The sparkle may precede it; text may not.

**The Sentence Case Rule.** Display and headings are sentence case. The build has no uppercase text and no tracked caps.

**The Two-Voice Rule.** Bodoni is for headings, category and value names, and the wordmark. Buttons, nav, forms and product data are always Hanken.

## Layout

Single-column mobile first, designed from 320 to 360px, widening at `sm` (640px), `md` (768px) and `lg` (1024px). Page container is 80rem max, centered, with gutters of 16px, 24px (sm) and 32px (lg). The hero is a two-column grid (1.15fr / 0.85fr) from md, headline and actions first on phones with the 4:5 image slot below. Section padding is 56 to 64px on phones and 80 to 96px on desktop; components step through 8 / 12 / 16 / 24 / 40. Category tiles are three columns from md; values are one hairline-topped column that becomes 2 then 4 columns. Controls are 48px minimum height, nav links 44px, mobile menu rows 56px. The header is sticky, compacts on scroll and gains a hairline; a raspberry announcement bar sits above it. A sticky message bar appears on phones once the visitor scrolls past 70% of the viewport and is hidden on Contact, Privacy and product pages. Nothing overflows horizontally.

## Elevation & Depth

Flat. Depth comes from the white, petal, raspberry and claret ground changes and 1px hairlines in Hairline Petal. Cards, tiles, fields and placeholders carry no shadow at rest or on hover. Hover feedback is color change, underline, or a slow 1.03 image zoom. A `lift` shadow token exists in the Tailwind config but is unused and is not part of the system.

### Named Rules
**The Flat-By-Default Rule.** Surfaces carry no shadow at rest or on hover. Cards are never nested.

## Shapes

Pills (9999px) for buttons, badges, tags and the cart control. 20px for imagery, product tiles, cards and placeholders, so photography reads soft. The home hero image sits inside a 28px frame with a 1px gold ring at 80% and 8px of padding. Fields and option rows use 12px; inline notes use 8px. Borders are 1px hairline; selected options use an ink border plus a 1px ink ring. The four-point sparkle (a concave star drawn from the logo) is the one recurring silhouette: 12px in the announcement bar, 24 to 28px ahead of a hero or banner headline, and two larger ones around the hero image on md and up. It is gold on raspberry, raspberry on petal, white as an accent, and always decorative (`aria-hidden`).

## Components

### Buttons
- **Shape:** Full pill (9999px), 48px minimum height, 12px 24px padding, 16px 600 label, 8px gap for icons.
- **Primary:** Raspberry fill, white text; hover Deep Raspberry.
- **Secondary:** 1px raspberry outline, raspberry text; hover fills raspberry with white text.
- **On dark:** White fill, ink text, hover petal. Outline variant has a white 60% border, fills white on hover.
- **Focus:** 2px outline offset 2px (ink, gold inside `.on-dark`). Transition 200ms ease-out. Disabled drops to 40% opacity.

### Hero
Full-width raspberry field, white Bodoni display headline left with a gold sparkle above, 18 to 20px white lead capped at 34ch, and a pair of actions (on-dark and on-dark outline). The 4:5 image slot sits right inside a gold hairline frame. The field is the page's one drench.

### Cards / Containers
- **Product tile:** No container. A 20px image with a white pill "sample" badge, then category in mute, title Hanken 600 (underline on hover), optional short line, and a raspberry 600 price beside a mute availability. Image zooms to 1.03 on hover.
- **Card:** White, 20px radius, 1px hairline, 20 to 24px padding, no shadow, never nested.
- **Petal panel:** Full-width petal band for page banners, the curated statement and the contact block, with a raspberry sparkle, a Deep Raspberry heading and 80% ink body.
- **Value item:** No card. A raspberry hairline at 40% on top, Bodoni 500 title in Deep Raspberry, 80% ink text.

### Placeholder slot
Petal ground, 20px radius, raspberry diagonal cross at 20% opacity, raspberry pill tag top left with the registry ID, caption bottom with name, canvas size, aspect ratio and image type. Role is `img` with a full spoken description.

### Inputs / Fields
- **Style:** White, 1px hairline, 12px radius, 48px minimum height, 16px text, raspberry caret.
- **Focus:** 2px ink outline, 3px offset.
- **Error:** Raspberry border and a 600 raspberry message; the error summary is a raspberry block with white text. Hints in 80% ink at 14px.
- **Choice rows:** 48px minimum, 12px radius, hairline; selected gets ink border and ring; radios and checkboxes 20px with raspberry accent.

### Navigation
Ink 15px 500 links, 44px targets, raspberry on hover, raspberry with a 2px underline offset 10px when active. Header: logo badge with the live wordmark (Bodoni 600 in Deep Raspberry, mute descriptor beneath), cart and a raspberry "message" pill right, round 48px menu button (petal hover) below lg. Mobile menu is a full-screen claret dialog with 1.875rem 600 links, white by default and gold when active, hairline dividers in white 15%, and a focus trap.

### Announcement bar
Raspberry strip, white 14px 500 centered text flanked by two small gold sparkles, above the header.

### Footer
Claret ground, white text with 75 to 80% white for secondary copy, white hairline at 15%. Logo lockup on dark (badge on a white ring, white wordmark), three columns from md, then the disclaimer and legal row.

## Do's and Don'ts

### Do:
- **Do** keep the ground white and let the range and the raspberry hero carry the color.
- **Do** drench raspberry once per page, in the hero, and keep other raspberry to controls, prices, numerals and the announcement bar.
- **Do** set headings in Bodoni Moda 500, sentence case, in Deep Raspberry or Ink on light grounds and white on raspberry or claret.
- **Do** use the four-point sparkle as the only ornament, decorative and `aria-hidden`.
- **Do** round imagery and cards at 20px, fields at 12px, controls as pills.
- **Do** give every control 48px height (44px for nav links) and a visible focus ring (ink, gold on dark).
- **Do** render missing imagery as a registered placeholder stating size, ratio and type.
- **Do** separate with hairlines and ground changes instead of shadows.
- **Do** keep message, call and cart reachable in the header, the hero and the sticky phone bar.

### Don't:
- **Don't** use gold or rose as text or icon color on white.
- **Don't** add cream grounds, gradient washes, gold arcs, or eyebrow labels above headings.
- **Don't** build icon-on-card feature grids.
- **Don't** nest cards or add drop shadows.
- **Don't** use Bodoni for buttons, nav, forms or product data.
- **Don't** invent photography, testimonials, ratings or claims to fill a slot.
- **Don't** use hype words such as miracle, breakthrough or guaranteed in any copy.
