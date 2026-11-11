import { Seo, organizationJsonLd } from "../lib/seo";
import { Hero } from "../components/sections/Hero";
import { CategoryTiles } from "../components/sections/CategoryTiles";
import { FeaturedProducts } from "../components/sections/FeaturedProducts";
import { Curated } from "../components/sections/Curated";
import { HowItWorks } from "../components/sections/HowItWorks";
import { EducationHighlights } from "../components/sections/EducationHighlights";
import { ContactBlock } from "../components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={organizationJsonLd()} />
      <Hero />
      <CategoryTiles />
      <FeaturedProducts />
      <Curated />
      <HowItWorks />
      <EducationHighlights />
      <ContactBlock />
    </>
  );
}
