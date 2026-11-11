---
name: The Pep Stop
description: A clean, premium, mobile-first health and beauty storefront where the curated range leads and a person is one tap away.
colors:
  ink: "#1A1217"
  raspberry: "#C30239"
  raspberry-deep: "#7A0220"
  petal: "#FDEFF2"
  mute: "#675A61"
  line: "#EBDDE2"
  gold: "#ECB86C"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.3rem + 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline-1:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline-2:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.2vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  page-max: "80rem"
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
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
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
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    padding: "8px 16px"
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
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: The Pep Stop

## Overview

**Creative North Star: "The Plain-Spoken Shop"**

A white page, one plum-black ink, and a single raspberry taken from the supplied logo. The range is the picture; everything else stays out of its way. The system is the category standard played straight: soft, friendly, mobile-first, with strong product tiles as the craft bar. It is not a themed or novelty world, and it does not borrow the older beauty-site look the first build used (cream ground, serif display, gold arcs, gradient washes, icon-on-card feature grids).

Density is calm and generous. Headlines are set large and left, tight and tracked, in sentence case. Surfaces are flat and separated by hairlines or a pale petal tint. Raspberry is reserved for action, so that the order button is always the loudest thing on the screen. A person is always one tap away: the message or call control sits in the header, in the hero, and in a sticky bar on phones.

Honesty about missing material is part of the look. Image slots that await real photography render as flat petal boxes with a faint diagonal cross, an ink tag, and a white panel stating canvas size, aspect ratio and type.

**Key Characteristics:**
- White ground, ink text, raspberry for action only.
- One grotesk family, 600 weight display, tight negative tracking, sentence case.
- Flat surfaces, hairline rules, no shadows in use.
- Pill controls, square-cornered imagery and placeholders, 12px fields and option tiles.
- One authored motion: sections rise into place once.
- Placeholders are flat, labeled and unmistakably placeholders.

## Colors

A restrained plum-and-raspberry palette on white. The accent is measured from the logo and appears rarely.

### Primary
- **Logo Raspberry** (#C30239): Primary buttons, nav hover and active text, the cart and order action, error text and borders, form accent (checkbox, radio, caret), text selection, scrollbar thumb. White text on it passes AA.

### Secondary
- **Deep Raspberry** (#7A0220): Hover state of the primary button. Not used as a resting surface in the build.

### Tertiary
- **Logo Gold** (#ECB86C): Only on dark grounds: the focus ring inside `.on-dark` regions and the active link in the full-screen mobile menu. Never text or icon on white.

### Neutral
- **Plum Ink** (#1A1217): Body and heading text, secondary button outline and fill, announcement bar, default focus ring, tags on placeholders.
- **Page White** (#FFFFFF): Page ground, cards, fields, spec panels.
- **Petal Tint** (#FDEFF2): Placeholder ground, tinted panels, hover for the on-dark button, mobile menu button hover, scrollbar track.
- **Hairline Petal** (#EBDDE2): Borders on cards, fields, the scrolled header rule.
- **Muted Mauve Grey** (#675A61): Secondary text: category names, availability, descriptions, placeholder specs.

### Named Rules
**The Action-Only Raspberry Rule.** Raspberry marks what you can do (order, add, go) or what went wrong (error). It is not used for decoration, backgrounds of sections, or heading color.

**The Gold-On-Dark Rule.** Gold exists only against ink. On white it fails contrast and is not used.

## Typography

**Display Font:** Hanken Grotesk (with system-ui, sans-serif)
**Body Font:** Hanken Grotesk (same family, 400)
**Label Font:** Hanken Grotesk 500 to 600

**Character:** One friendly, slightly geometric grotesk at two or three weights. Hierarchy comes from size and tracking, not from a second face. Numerals are tabular (`tnum`) and the `ss01` alternate is on.

### Hierarchy
- **Display** (600, clamp 2.5rem to 5rem, 0.98, -0.04em): Home hero headline only.
- **Headline 1** (600, clamp 2.25rem to 4rem, 1.02, -0.035em): One H1 per inner page.
- **Headline 2** (600, clamp 1.75rem to 3rem, 1.06, -0.03em): Section headings, capped at 22ch, balanced wrap.
- **Title** (600, clamp 1.25rem to 1.625rem, 1.2, -0.02em): Subsections and large cards. Product titles use 600 at 16 to 18px.
- **Body** (400, 16px, 1.5): Running text, never below 14px; lead text 18 to 20px at 80% ink. Prose capped near 40rem.
- **Label** (500 to 600, 14 to 16px): Buttons, nav (15px), badges (12px 600), product meta (14px).

### Named Rules
**The Heading Carries Itself Rule.** No small label sits above a heading. The heading alone opens a section.

**The Sentence Case Rule.** Display and headings are sentence case. The only uppercase in the build is the tracked wordmark in the logo lockup.

## Layout

Single-column mobile first, designed from 320 to 360px, widening at `md` (768px) and `lg` (1024px). Page container is 80rem max, centered, with gutters of 16px, 24px (sm) and 32px (lg). The hero is a two-column grid (1.2fr / 0.8fr) from md, with the headline and actions first on phones and the 4:5 image slot below. Vertical rhythm uses generous section padding (about 56px mobile, 80px desktop at the hero) with 8 / 12 / 16 / 24 / 40 steps inside components. Controls are 48px minimum height, nav links 44px, mobile menu rows 56px. The header is sticky, compacts on scroll, and gains a hairline. An ink announcement bar sits above it. A sticky message bar serves phones. Nothing overflows horizontally.

## Elevation & Depth

Flat. Depth comes from the white to petal tint change and 1px hairlines in Hairline Petal; no shadow is applied anywhere in the build. A `lift` shadow token exists in the Tailwind config but is unused and is not part of the system. Hover feedback is color change, underline, or a slow 1.03 image zoom, never a shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces carry no shadow at rest or on hover. Cards are never nested.

## Shapes

Pills for controls (9999px), 12px for fields, square corners for imagery, placeholders, cards and panels. Placeholders are flat white with a hairline and a diagonal cross, with plain caption text and no inner plate. Sample badges and tags are small pills. Borders are 1px hairline; selected options use an ink border plus a 1px ink ring.

## Components

### Buttons
- **Shape:** Full pill (9999px), 48px minimum height, 12px 24px padding, 16px 600 label, 8px gap for icons.
- **Primary:** Raspberry fill, white text; hover Deep Raspberry.
- **Secondary:** 1px ink outline, ink text; hover fills ink with white text.
- **On dark:** White fill, ink text, hover petal; outline variant uses white 60% border, fills white on hover.
- **Focus:** 2px ink outline offset 2 to 3px (gold on dark regions). Transition 200ms ease-out. Disabled drops to 40% opacity.

### Cards / Containers
- **Product tile:** No container. A 12px image with a white pill "sample" badge top right, then category in mute, title 600 (underline on hover), optional short line, and a price and availability row.
- **Card:** White, 12px radius, 1px hairline, 20 to 24px padding, no shadow, never nested.

### Placeholder slot
Petal ground, 12px radius, raspberry diagonal cross at 20% opacity, ink pill tag top left with the registry ID, white 8px panel at the bottom with name, canvas size, aspect ratio and image type. Role is `img` with a full spoken description.

### Inputs / Fields
- **Style:** White, 1px hairline, 12px radius, 48px minimum height, 16px text, raspberry caret.
- **Focus:** 2px ink outline, 3px offset.
- **Error:** Raspberry border and a 600 raspberry message below. Hints in 80% ink at 14px.
- **Choice rows:** 48px minimum, 12px radius, hairline; selected gets ink border and ring; radios and checkboxes 20px with raspberry accent.

### Navigation
Ink 15px 500 links, 44px targets, raspberry on hover, raspberry with a 2px underline offset 10px when active. Header: logo badge left, cart and a raspberry "message" pill right, menu icon button (48px round, petal hover) below lg. Mobile menu is a full-screen ink dialog with 3xl 600 links, white by default and gold when active, with a focus trap.

### Announcement bar
Ink strip, white 13px 500 centered text, above the header.

## Do's and Don'ts

### Do:
- **Do** keep the ground white and let the product image be the color.
- **Do** use raspberry for the single main action per view and for errors only.
- **Do** keep one family, 600 display with negative tracking, sentence case.
- **Do** give every control 48px height (44px for nav links) and a visible ink focus ring.
- **Do** render missing imagery as a registered placeholder stating size, ratio and type.
- **Do** separate with hairlines and the petal tint instead of shadows.
- **Do** keep the phone number, message, and cart reachable in the header and the sticky phone bar.

### Don't:
- **Don't** use gold or rose as text or icon color on white.
- **Don't** add serif display faces, gradient washes, gold arc ornaments, or cream grounds.
- **Don't** build icon-on-card feature grids or put a small label above a heading.
- **Don't** nest cards or add drop shadows.
- **Don't** invent photography, testimonials, ratings or claims to fill a slot.
- **Don't** use hype words such as miracle, breakthrough or guaranteed in any copy.
