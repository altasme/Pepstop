import { Head } from "vite-react-ssg";
import { CONTACT, IMAGE_SLOTS, ORG, SEO } from "../content/site";
import { cloudinaryUrl } from "./media";

type Props = {
  path: string;
  title?: string;
  description?: string;
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd?: object;
};

const absolute = (u: string | null) => (u && u.startsWith("/") ? `${SEO.siteUrl}${u}` : u);

function ogImage(): string | null {
  return IMAGE_SLOTS.og.src ? absolute(cloudinaryUrl(IMAGE_SLOTS.og.src, 1200)) : null;
}

/** Per-route title, description, OG, canonical and optional JSON-LD. */
export function Seo({ path, title, description, noindex, type = "website", jsonLd }: Props) {
  const route = SEO.routes[path];
  const t = title ?? route?.title ?? ORG.name;
  const d = description ?? route?.description ?? ORG.tagline;
  const url = `${SEO.siteUrl}${path === "/" ? "" : path}`;
  const image = ogImage();
  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:site_name" content={ORG.name} />
      <meta property="og:locale" content={SEO.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Head>
  );
}

/** Organization schema for Home. No Product schema anywhere. */
export function organizationJsonLd() {
  const logo = ORG.logo ? absolute(cloudinaryUrl(ORG.logo, 600)) : null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG.name,
    url: SEO.siteUrl,
    ...(logo ? { logo } : {}),
    ...(CONTACT.facebookUrl ? { sameAs: [CONTACT.facebookUrl] } : {}),
    contactPoint: [{ "@type": "ContactPoint", telephone: CONTACT.phoneE164, contactType: "customer service", areaServed: "PH", availableLanguage: ["en", "fil"] }],
  };
}
