import type { Metadata } from "next";
import { compareFeatures, compareVerdicts } from "@/lib/content/compare";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Compare",
  description: "CapSignal vs manual outreach, generic CRMs, and fundraising agencies.",
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        label="Compare"
        title="How CapSignal compares"
        description="Side-by-side on targeting, outreach, cost, and results."
      >
        <Button variant="primary" href="/request-access">
          Request access
        </Button>
      </PageHeader>

      <PageSection border="bottom">
        <div className="data-table-wrap">
          <table className="data-table min-w-[800px]">
            <thead>
              <tr>
                <th>Feature</th>
                <th>CapSignal</th>
                <th>Manual</th>
                <th>CRM</th>
                <th>Agency</th>
              </tr>
            </thead>
            <tbody>
              {compareFeatures.map((row) => (
                <tr key={row.feature}>
                  <td className="font-medium text-text-primary">{row.feature}</td>
                  <td className="bg-surface-muted/60 font-medium text-text-primary">{row.capsignal}</td>
                  <td className="text-text-secondary">{row.manual}</td>
                  <td className="text-text-secondary">{row.crm}</td>
                  <td className="text-text-secondary">{row.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading label="Verdict" title="When each approach makes sense" />
        <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
          {compareVerdicts.map((v) => (
            <Panel key={v.title} padding="default" className="border-0">
              <h3 className="text-lg font-semibold text-text-primary">{v.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {v.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </PageSection>
    </>
  );
}
