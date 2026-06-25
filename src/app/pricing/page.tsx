import type { Metadata } from "next";
import { pricingComparison, pricingFaqs } from "@/lib/content/pricing";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCards } from "@/components/ui/pricing-cards";
import { FaqList } from "@/components/ui/faq-list";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Launch, Scale, and Full Service tiers for structured fundraising.",
};

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <span className="font-mono text-text-primary">✓</span>;
  if (value === false) return <span className="text-text-tertiary">—</span>;
  return <span className="text-text-primary">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHeader
        label="Pricing"
        title="Simple monthly plans. No success fees."
        description="Launch, Scale, and Full Service from $49.99/mo. No per-seat pricing, no carry, no percentage of capital raised."
      />

      <PageSection border="bottom">
        <PricingCards />
      </PageSection>

      <PageSection>
        <SectionHeading label="Compare" title="Feature comparison" />
        <div className="data-table-wrap mt-8">
          <table className="data-table min-w-[560px]">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Launch</th>
                <th>Scale</th>
                <th>Full service</th>
              </tr>
            </thead>
            <tbody>
              {pricingComparison.map((row) => (
                <tr key={row.feature}>
                  <td className="font-medium text-text-primary">{row.feature}</td>
                  <td><CellValue value={row.launch} /></td>
                  <td className="bg-surface-muted/50"><CellValue value={row.scale} /></td>
                  <td><CellValue value={row.full} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection variant="muted" border="top">
        <SectionHeading label="FAQ" title="Billing questions" />
        <div className="mt-8 max-w-2xl">
          <FaqList items={pricingFaqs} />
        </div>
      </PageSection>
    </>
  );
}
