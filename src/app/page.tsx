import { Hero } from "@/components/sections/hero";
import { ProductStory } from "@/components/sections/product-story";
import { ProcessBand } from "@/components/sections/process-band";
import { Proof } from "@/components/sections/proof";
import { CompareStrip } from "@/components/sections/compare-strip";
import { OutcomeBand } from "@/components/sections/outcome-band";
import { PricingTeaser } from "@/components/sections/pricing-teaser";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductStory />
      <ProcessBand />
      <Proof />
      <CompareStrip />
      <OutcomeBand />
      <PricingTeaser />
    </>
  );
}
