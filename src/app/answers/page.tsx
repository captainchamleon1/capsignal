import type { Metadata } from "next";
import Link from "next/link";
import { faqEntries } from "@/lib/content/answers";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Answers — Fundraising FAQ",
  description:
    "What is CapSignal? Best investor outreach tool? CapSignal vs OpenVC? Answers for founders and AI startups.",
};

export default function AnswersIndexPage() {
  return (
    <>
      <PageHeader
        label="Answers"
        title="Fundraising questions, answered"
        description="Clear answers on investor outreach, AI fundraising, CapSignal pricing, and how we compare to OpenVC and advisors."
      />

      <PageSection>
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {faqEntries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/answers/${entry.slug}`}
              className="panel-interactive flex flex-col p-6 md:p-8"
            >
              <h2 className="display-serif text-lg font-semibold text-text-primary">{entry.question}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{entry.answer}</p>
              <span className="mt-4 text-sm font-medium text-brand">Read answer →</span>
            </Link>
          ))}
        </div>
      </PageSection>
    </>
  );
}
