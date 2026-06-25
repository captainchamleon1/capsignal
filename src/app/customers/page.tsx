import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/content/customers";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Customers",
  description: "Verified case studies from CapSignal campaigns.",
};

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        label="Customers"
        title="Verified outcomes"
        description="We publish case studies only from real customer campaigns with permission."
      />

      <PageSection>
        {caseStudies.length === 0 ? (
          <div className="border border-border bg-surface-elevated p-8 text-center md:p-12">
            <p className="text-base text-text-secondary">
              No published case studies yet. Outcomes will appear here as customers opt in to share
              results.
            </p>
            <Link
              href="/request-access"
              className="mt-6 inline-flex text-sm font-medium text-text-primary hover:underline"
            >
              Request access →
            </Link>
          </div>
        ) : (
          <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/customers/${study.slug}`}
                className="panel-interactive flex flex-col p-6 md:p-8"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  <span>{study.stage}</span>
                  <span aria-hidden="true">·</span>
                  <span>{study.sector}</span>
                </div>
                <h2 className="display-serif mt-4 text-lg font-semibold text-text-primary">
                  {study.headline}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  {study.summary}
                </p>
              </Link>
            ))}
          </div>
        )}
      </PageSection>
    </>
  );
}
