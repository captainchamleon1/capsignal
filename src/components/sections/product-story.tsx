import { productModules } from "@/lib/content/product";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { ProductPreview } from "@/components/sections/product-preview";
import { SequencesPreview } from "@/components/product/sequences-preview";
import { AnalyticsPreview } from "@/components/product/analytics-preview";

const previews = {
  matching: ProductPreview,
  outreach: SequencesPreview,
  analytics: AnalyticsPreview,
};

const indices = ["01", "02", "03"];

export function ProductStory() {
  return (
    <section id="product" className="overflow-x-clip bg-surface-elevated hairline-y">
      {productModules.map((mod, i) => {
        const Preview = previews[mod.id as keyof typeof previews];
        const reversed = i % 2 === 1;

        return (
          <div
            key={mod.id}
            className="relative py-(--spacing-section) hairline-y last:shadow-none"
          >
            <Reveal direction="scale" delay={100}>
              <span
                className="pointer-events-none absolute right-6 top-8 hidden font-mono text-[7rem] font-medium leading-none tabular-nums text-border/60 select-none lg:block"
                aria-hidden="true"
              >
                {indices[i]}
              </span>
            </Reveal>

            <Container>
              <div
                className={`grid min-w-0 items-start gap-12 lg:grid-cols-2 lg:gap-20 ${
                  reversed ? "lg:[direction:rtl]" : ""
                }`}
              >
                <Reveal
                  direction={reversed ? "right" : "left"}
                  className={reversed ? "lg:[direction:ltr]" : ""}
                >
                  <div className="lg:sticky lg:top-28 lg:pb-8">
                    <SectionLabel index={indices[i]} title={mod.title} />
                    <h2 className="display-serif mt-6 text-balance break-safe text-3xl font-semibold text-text-primary md:text-[2.5rem]">
                      {mod.headline}
                    </h2>
                    <p className="mt-5 text-[16px] leading-[1.7] text-text-secondary">
                      {mod.description}
                    </p>
                    <RevealStagger stagger={70} className="mt-8 space-y-3 border-l border-border pl-5">
                      {mod.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="reveal-stagger-item list-none text-[15px] leading-snug text-text-secondary"
                        >
                          {bullet}
                        </li>
                      ))}
                    </RevealStagger>
                    <TextLink href={`/product/${mod.id}`} className="mt-8 inline-block">
                      {mod.title} →
                    </TextLink>
                  </div>
                </Reveal>

                <Reveal
                  delay={120}
                  direction={reversed ? "left" : "right"}
                  blur
                  className={reversed ? "lg:[direction:ltr]" : ""}
                >
                  <div className="border border-border bg-surface-page shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)]">
                    {Preview && <Preview />}
                  </div>
                </Reveal>
              </div>
            </Container>
          </div>
        );
      })}
    </section>
  );
}
