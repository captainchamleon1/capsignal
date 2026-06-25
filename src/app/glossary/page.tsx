import type { Metadata } from "next";
import { glossaryTerms } from "@/lib/content/glossary";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Fundraising and investor outreach terminology.",
};

export default function GlossaryPage() {
  const sorted = [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <>
      <PageHeader
        label="Glossary"
        title="Fundraising terminology"
        description="Definitions for terms used across CapSignal and our resources."
      />

      <PageSection>
        <dl className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
          {sorted.map((item) => (
            <div key={item.term} className="py-6 first:pt-6 last:pb-6">
              <dt className="text-base font-semibold text-text-primary">{item.term}</dt>
              <dd className="mt-2.5 text-sm leading-relaxed text-text-secondary">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </PageSection>
    </>
  );
}
