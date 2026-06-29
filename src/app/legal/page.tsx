import type { Metadata } from "next";
import Link from "next/link";
import { legalHub } from "@/lib/content/legal";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Legal",
  description: legalHub.description,
};

export default function LegalPage() {
  return (
    <>
      <PageHeader label="Company" title={legalHub.title} description={legalHub.description} />

      <PageSection size="sm">
        <div className="mx-auto grid max-w-(--width-content) gap-px border border-border bg-border sm:grid-cols-2">
          {legalHub.links.map((link) => (
            <Link key={link.href} href={link.href} className="group block">
              <Panel className="h-full border-0 transition-colors group-hover:bg-surface-muted">
                <h2 className="text-lg font-semibold text-text-primary">{link.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{link.description}</p>
                <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-wider text-text-tertiary group-hover:text-text-primary">
                  Read →
                </span>
              </Panel>
            </Link>
          ))}
        </div>
      </PageSection>
    </>
  );
}
