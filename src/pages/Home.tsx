import { Seo, organizationJsonLd } from "../lib/seo";
import { Hero } from "../components/sections/Hero";
import { Marquee } from "../components/sections/Marquee";
import { CategoryTiles } from "../components/sections/CategoryTiles";
import { FeaturedProducts } from "../components/sections/FeaturedProducts";
import { BrandStory } from "../components/sections/BrandStory";
import { WhyUs } from "../components/sections/WhyUs";
import { HowItWorks } from "../components/sections/HowItWorks";
import { EducationHighlights } from "../components/sections/EducationHighlights";
import { ContactBlock } from "../components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={organizationJsonLd()} />
      <Hero />
      <Marquee />
      <CategoryTiles />
      <FeaturedProducts />
      <BrandStory />
      <WhyUs />
      <HowItWorks />
      <EducationHighlights />
      <ContactBlock />
    </>
  );
}
