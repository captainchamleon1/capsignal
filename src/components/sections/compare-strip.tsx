import { comparisonRows } from "@/lib/content/home";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";
import { CompareTableAnimated, CompareMobileAnimated } from "@/components/sections/compare-table-animated";

export function CompareStrip() {
  return (
    <section className="hairline-y bg-surface-elevated py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-md">
              <SectionLabel index="—" title="Compare" />
              <h2 className="display-serif mt-5 text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
                Built for raises, not sales pipelines
              </h2>
            </div>
            <TextLink href="/compare" className="shrink-0">
              Full comparison →
            </TextLink>
          </div>
        </Reveal>

        <Reveal delay={100} direction="up" className="mt-10">
          <CompareTableAnimated />
          <CompareMobileAnimated />
        </Reveal>
      </Container>
    </section>
  );
}
