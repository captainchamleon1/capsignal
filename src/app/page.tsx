import { Hero } from "@/components/sections/hero";
import { RaiseMovementBand } from "@/components/sections/raise-movement-band";
import { ProductStory } from "@/components/sections/product-story";
import { ProcessBand } from "@/components/sections/process-band";
import { HomepageApplyBand } from "@/components/sections/homepage-apply-band";
import { Proof } from "@/components/sections/proof";
import { OpenVcCompare } from "@/components/sections/openvc-compare";
import { OutcomeBand } from "@/components/sections/outcome-band";
import { HomeAdsEntryWithParams } from "@/components/home/home-ads-entry-with-params";

export default function Home() {
  return (
    <>
      <HomeAdsEntryWithParams />
      <Hero />
      <RaiseMovementBand />
      <ProductStory />
      <ProcessBand />
      <HomepageApplyBand />
      <Proof />
      <OpenVcCompare />
      <OutcomeBand />
    </>
  );
}
