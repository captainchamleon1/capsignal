import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/content/customers";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Customers",
  description: "Case studies from recent CapSignal campaigns.",
};

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        label="Customers"
        title="Results from recent raises"
        description="Founders across Seed and Series A using CapSignal for structured investor outreach."
      />

      <PageSection>
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
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
                {study.results.slice(0, 2).map((r) => (
                  <div key={r.label}>
                    <p className="font-mono text-lg font-medium tabular-nums text-text-primary">
                      {r.value}
                    </p>
                    <p className="mt-0.5 text-xs text-text-tertiary">{r.label}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </PageSection>
    </>
  );
}
