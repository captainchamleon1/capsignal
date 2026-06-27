import { Hero } from "@/components/sections/hero";
import { ProductStory } from "@/components/sections/product-story";
import { ProcessBand } from "@/components/sections/process-band";
import { Proof } from "@/components/sections/proof";
import { OpenVcCompare } from "@/components/sections/openvc-compare";
import { OutcomeBand } from "@/components/sections/outcome-band";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductStory />
      <ProcessBand />
      <Proof />
      <OpenVcCompare />
      <OutcomeBand />
    </>
  );
}
