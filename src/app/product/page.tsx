import type { Metadata } from "next";
import { productModules, productStats } from "@/lib/content/product";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedStatGrid } from "@/components/ui/animated-stat-grid";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { ProductPreview } from "@/components/sections/product-preview";
import { SequencesPreview } from "@/components/product/sequences-preview";
import { AnalyticsPreview } from "@/components/product/analytics-preview";

export const metadata: Metadata = {
  title: "Product",
  description: "Investor matching, outreach sequences, and campaign analytics for structured raises.",
};

const previews = {
  matching: ProductPreview,
  outreach: SequencesPreview,
  analytics: AnalyticsPreview,
};

const indices = ["01", "02", "03"];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        label="Product"
        title="Everything you need to run a raise"
        description="Three integrated modules share the same data layer. Targeting improves as replies come in."
      >
        <Button variant="primary" href="/request-access">
          Request access
        </Button>
      </PageHeader>

      <PageSection border="bottom">
        <AnimatedStatGrid items={productStats} />
      </PageSection>

      {productModules.map((mod, i) => {
        const Preview = previews[mod.id as keyof typeof previews];
        const reversed = i % 2 === 1;

        return (
          <PageSection
            key={mod.id}
            id={mod.id}
            variant={reversed ? "muted" : "default"}
            border={i < productModules.length - 1 ? "bottom" : "none"}
          >
            <div
              className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-20 ${
                reversed ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={reversed ? "lg:[direction:ltr]" : ""}>
                <SectionHeading index={indices[i]} label={mod.title} title={mod.headline} />
                <p className="mt-5 text-[16px] leading-[1.7] text-text-secondary">{mod.description}</p>
                <ul className="mt-8 space-y-3 border-l border-border pl-5">
                  {mod.bullets.map((b) => (
                    <li key={b} className="text-[15px] leading-snug text-text-secondary">
                      {b}
                    </li>
                  ))}
                </ul>
                <TextLink href={`/product/${mod.id}`} className="mt-8 inline-block">
                  Deep dive →
                </TextLink>
              </div>
              <div className={reversed ? "lg:[direction:ltr]" : ""}>
                <div className="panel">{Preview && <Preview />}</div>
              </div>
            </div>
          </PageSection>
        );
      })}

      <PageSection size="sm" variant="elevated" border="top">
        <p className="text-center text-sm text-text-secondary">
          Want a walkthrough?{" "}
          <TextLink href="/request-access" className="text-text-primary">
            Request access
          </TextLink>{" "}
          and we&apos;ll schedule a product demo.
        </p>
      </PageSection>
    </>
  );
}
