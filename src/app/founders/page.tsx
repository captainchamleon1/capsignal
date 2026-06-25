import type { Metadata } from "next";
import {
  founderBenefits,
  founderStages,
  founderSectors,
  founderTimeline,
} from "@/lib/content/founders";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { ProductPreview } from "@/components/sections/product-preview";

export const metadata: Metadata = {
  title: "Founders",
  description: "Structured fundraising for Seed through Series B founders.",
};

export default function FoundersPage() {
  return (
    <>
      <PageHeader
        label="Founders"
        title="Stop fundraising blind"
        description="CapSignal gives you a ranked investor pipeline, inbox-native outreach, and weekly reporting—so you spend time in meetings, not spreadsheets."
      >
        <Button variant="primary" href="/request-access">
          Request access
        </Button>
      </PageHeader>

      <PageSection border="bottom">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {founderBenefits.map((b) => (
            <Panel key={b.title} className="border-0">
              <h3 className="text-lg font-semibold text-text-primary">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{b.body}</p>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading label="Stages" title="Where we fit" />
            <div className="data-table-wrap mt-8">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Check size</th>
                    <th>Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {founderStages.map((row) => (
                    <tr key={row.stage}>
                      <td className="font-medium text-text-primary">{row.stage}</td>
                      <td className="text-text-secondary">{row.check}</td>
                      <td className="text-text-secondary">{row.timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              Sectors
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {founderSectors.map((s) => (
                <span
                  key={s}
                  className="border border-border bg-surface-elevated px-3 py-1.5 text-sm text-text-secondary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading label="Timeline" title="First two weeks" />
            <ol className="relative mt-8 space-y-0">
              {founderTimeline.map((item, i) => (
                <li key={item.day} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < founderTimeline.length - 1 && (
                    <span className="absolute left-[11px] top-8 h-[calc(100%-8px)] w-px bg-border" />
                  )}
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center border border-border bg-surface-page font-mono text-[10px] tabular-nums text-text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[11px] text-text-tertiary">{item.day}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{item.event}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PageSection>

      <PageSection variant="muted" border="top">
        <SectionHeading label="Dashboard" title="Your campaign at a glance" />
        <div className="panel mt-8">
          <ProductPreview />
        </div>
      </PageSection>
    </>
  );
}
