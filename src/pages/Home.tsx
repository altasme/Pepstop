import { Seo, organizationJsonLd } from "../lib/seo";
import { Hero } from "../components/sections/Hero";
import { Intro } from "../components/sections/Intro";
import { FocusAreas } from "../components/sections/FocusAreas";
import { FeaturedProducts } from "../components/sections/FeaturedProducts";
import { TrustStrip } from "../components/sections/TrustStrip";
import { EducationHighlights } from "../components/sections/EducationHighlights";
import { Values } from "../components/sections/Values";
import { ContactBlock } from "../components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={organizationJsonLd()} />
      <Hero />
      <Intro />
      <FeaturedProducts />
      <FocusAreas />
      <TrustStrip />
      <EducationHighlights />
      <Values />
      <ContactBlock />
    </>
  );
}
