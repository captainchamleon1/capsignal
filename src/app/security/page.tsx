import type { Metadata } from "next";
import { securityFeatures, compliance } from "@/lib/content/security";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = {
  title: "Security",
  description: "Security, encryption, and data handling at CapSignal.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        label="Security"
        title="Built for sensitive raise data"
        description="Campaign data includes investor relationships, messaging, and traction metrics. We treat it accordingly."
      />

      <PageSection>
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {securityFeatures.map((section) => (
            <Panel key={section.title} className="border-0">
              <h3 className="text-lg font-semibold text-text-primary">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection variant="muted" border="top">
        <SectionHeading label="Compliance" title="Certification status" />
        <div className="data-table-wrap mt-8 max-w-xl">
          <table className="data-table">
            <thead>
              <tr>
                <th>Standard</th>
                <th>Status</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {compliance.map((row) => (
                <tr key={row.label}>
                  <td className="font-medium text-text-primary">{row.label}</td>
                  <td className="text-text-secondary">{row.status}</td>
                  <td className="font-mono text-text-tertiary">{row.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-sm text-text-secondary">
          Questions?{" "}
          <TextLink href="mailto:security@capsignal.com" className="text-text-primary">
            security@capsignal.com
          </TextLink>
        </p>
      </PageSection>
    </>
  );
}
