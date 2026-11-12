/**
 * Wellness Education articles (CLAUDE.md §9.4).
 * Body format: paragraphs separated by a blank line; a line starting with "## " is a subheading.
 * Drafts below are general and unpublished. Only the client may set `published: true`.
 * Product-specific articles are client content and are not written here.
 */
export type Article = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  published: boolean;
  updatedAt: string; // YYYY-MM-DD
  focusAreaId?: string; // links the article to a Health & Beauty section
};

export const ARTICLES: Article[] = [
  {
    slug: "building-a-simple-skincare-routine",
    title: "Building a simple skincare routine",
    summary: "A short, gentle guide to starting with a few steps you can enjoy every day.",
    focusAreaId: "skin-beauty",
    published: false,
    updatedAt: "2026-11-11",
    body: `A skincare routine does not need to be long to be useful. Many people begin with three steps and add more only if they want to.

## Start with the basics

Cleansing, moisturising, and sun protection in the morning are the steps most often described as a good starting point. In the evening, cleansing and moisturising are usually enough.

## Add one thing at a time

If you would like to try a new product, introduce it on its own, and give it a few weeks before judging it. Adding several products at once makes it hard to know what is working for you and what is not.

## Keep it consistent

A routine you can keep up on a busy morning is worth more than a complicated one you skip. Choose products you find pleasant to use, and keep the steps few.

## When to ask a professional

Every person's skin is different. If you have a concern about your skin, a licensed dermatologist is the right person to ask.`,
  },
  {
    slug: "why-sleep-shows-on-your-skin",
    title: "Why sleep shows on your skin",
    summary: "A look at how everyday habits, sleep included, are often linked with how skin looks and feels.",
    focusAreaId: "skin-beauty",
    published: false,
    updatedAt: "2026-11-11",
    body: `Many people notice that after a few short nights, their skin looks tired. It is a common observation, and a good reason to think of sleep as part of everyday self-care.

## One habit among several

Sleep is one of several everyday habits, along with drinking enough water, eating regular meals, moving your body, and protecting your skin from the sun, that people often associate with how their skin looks.

## Small steps that may help

Going to bed at a similar time each night, keeping screens out of the last half hour before bed, and keeping your room dark and cool are simple routines that may help you rest better.

## A note on expectations

No single habit changes how you look overnight. Think of these as steady, gentle practices, not quick fixes.

## When to ask a professional

If you often have trouble sleeping, or are worried about your health, please speak with a licensed physician.`,
  },
  {
    slug: "reading-a-product-label",
    title: "Reading a product label",
    summary: "What to look for on a beauty or wellness label, so every purchase feels like a confident one.",
    focusAreaId: "skin-beauty",
    published: false,
    updatedAt: "2026-11-11",
    body: `A product label is the quickest way to learn what you are buying. A few minutes with it can help you ask better questions.

## The name and the maker

Look for the product name, the manufacturer or distributor, and where it was made. A label that is missing this basic information is worth asking about.

## Ingredients

Ingredient lists are usually written from the largest amount to the smallest. If you know you are sensitive to something, check the list before you buy.

## Batch and expiry

A batch or lot number and an expiry date help you track the product you are holding. Check the date before you buy, and follow the storage instructions on the label.

## Questions to ask

If something on a label is unclear, ask the seller to explain it. A good seller will be happy to help, and will tell you when they do not know.`,
  },
];
