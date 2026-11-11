import { Seo, organizationJsonLd } from "../lib/seo";
import { Hero } from "../components/sections/Hero";
import { Intro } from "../components/sections/Intro";
import { FocusAreas } from "../components/sections/FocusAreas";
import { EducationHighlights } from "../components/sections/EducationHighlights";
import { Values } from "../components/sections/Values";
import { ContactBlock } from "../components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={organizationJsonLd()} />
      <Hero />
      <Intro />
      <FocusAreas />
      <EducationHighlights />
      <Values />
      <ContactBlock />
    </>
  );
}
