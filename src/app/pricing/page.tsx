import type { Metadata } from "next";
import { pricingComparison, pricingFaqs } from "@/lib/content/pricing";
import { guarantee, selfServePricing } from "@/lib/content/guarantee";
import { openvcComparison } from "@/lib/content/openvc-compare";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCards } from "@/components/ui/pricing-cards";
import { FaqList } from "@/components/ui/faq-list";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One simple plan for structured fundraising — no success fees.",
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
        title="One plan. No success fees."
        description={`${selfServePricing.priceFull}/mo · ${guarantee.short}. No per-seat pricing, no carry, no percentage of capital raised.`}
      />

      <PageSection border="bottom">
        <div className="mx-auto max-w-lg">
          <PricingCards />
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading label="Compare" title={openvcComparison.title} />
        <p className="mt-3 max-w-xl text-sm text-text-secondary">{openvcComparison.subtitle}</p>
        <div className="data-table-wrap mt-8">
          <table className="data-table min-w-[560px]">
            <thead>
              <tr>
                <th>Feature</th>
                <th>{openvcComparison.columns.free}</th>
                <th className="bg-brand-tint/50">{openvcComparison.columns.capsignal}</th>
              </tr>
            </thead>
            <tbody>
              {openvcComparison.rows.map((row) => (
                <tr key={row.feature}>
                  <td className="font-medium text-text-primary">{row.feature}</td>
                  <td className="text-text-tertiary">❌ {row.free}</td>
                  <td className="bg-brand-tint/30 font-medium text-text-primary">✅ {row.capsignal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading label="Included" title="What's in CapSignal" />
        <div className="data-table-wrap mt-8">
          <table className="data-table min-w-[400px]">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="bg-brand-tint/50">CapSignal</th>
              </tr>
            </thead>
            <tbody>
              {pricingComparison.map((row) => (
                <tr key={row.feature}>
                  <td className="font-medium text-text-primary">{row.feature}</td>
                  <td className="bg-brand-tint/30">
                    <CellValue value={row.capsignal} />
                  </td>
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
