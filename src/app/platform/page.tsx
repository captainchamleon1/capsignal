import type { Metadata } from "next";
import { platformMetrics, platformFaqs, signalLayers } from "@/lib/constants";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedStatGrid } from "@/components/ui/animated-stat-grid";
import { Panel } from "@/components/ui/panel";
import { FaqList } from "@/components/ui/faq-list";
import { TextLink } from "@/components/ui/text-link";
import { PlatformPipelineAnimated } from "@/components/sections/platform-pipeline-animated";
import { PlatformSignalsAnimated } from "@/components/sections/platform-signals-animated";

export const metadata: Metadata = {
  title: "Platform",
  description: "Signal layers, data pipeline, and scoring methodology behind CapSignal.",
};

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        label="Platform"
        title="Signal-driven investor intelligence"
        description="Four data layers refreshed daily. Every match includes rationale—not a black-box score."
      />

      <PageSection border="bottom">
        <AnimatedStatGrid
          items={platformMetrics.map((m) => ({
            value: m.value,
            label: m.label,
            detail: m.detail,
          }))}
        />
      </PageSection>

      <PageSection>
        <SectionHeading label="Pipeline" title="How data flows" />
        <div className="mt-10">
          <PlatformPipelineAnimated />
        </div>
      </PageSection>

      <PageSection variant="muted" border="y">
        <SectionHeading label="Signals" title="Four layers of investor intelligence" />
        <div className="mt-10">
          <PlatformSignalsAnimated layers={signalLayers} />
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionHeading label="FAQ" title="Platform questions" />
            <div className="mt-8">
              <FaqList items={platformFaqs} />
            </div>
          </div>
          <Panel muted>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              Security
            </p>
            <h3 className="mt-3 text-lg font-semibold text-text-primary">Security & compliance</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Encryption at rest and in transit, role-based access, and US-based infrastructure.
              SOC 2 Type I in progress.
            </p>
            <TextLink href="/security" className="mt-5 inline-block">
              Read security overview →
            </TextLink>
          </Panel>
        </div>
      </PageSection>
    </>
  );
}
