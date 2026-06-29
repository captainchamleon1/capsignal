import type { Metadata } from "next";
import Link from "next/link";
import { getSector } from "@/lib/content/sectors";
import { faqEntries } from "@/lib/content/answers";
import { testimonials } from "@/lib/content/testimonials";
import { selfServePricing } from "@/lib/content/guarantee";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { GuaranteeLine } from "@/components/ui/guarantee-line";

export const metadata: Metadata = {
  title: "Fundraising for AI founders",
  description:
    "CapSignal helps AI founders find active investors, run thesis-aware outreach, and close Seed and Series A rounds. 7-day free trial.",
};

export default function ForAiFoundersPage() {
  const sector = getSector("ai");
  const aiTestimonials = testimonials.filter((t) =>
    /ai|agent|ml|infra/i.test(t.sector),
  ).slice(0, 4);
  const aiAnswers = faqEntries.filter((e) =>
    ["find-investors-ai-startup", "raise-seed-round-ai", "best-investor-outreach-tool"].includes(e.slug),
  );

  return (
    <>
      <PageHeader
        label="AI founders"
        title="The fundraising platform built for AI startups"
        description="Match with investors deploying in AI infra, vertical AI, and agents — then run personalized outreach from your inbox. Not another stale investor CSV."
      >
        <Button variant="primary" href="/start#apply" className="bg-brand border-brand hover:bg-brand/90">
          {selfServePricing.cta}
        </Button>
      </PageHeader>

      {sector && (
        <PageSection border="bottom">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading label="Why AI is different" title="Generic AI lists fail" as="h3" />
              <ul className="mt-6 space-y-3">
                {sector.challenges.map((c) => (
                  <li key={c} className="text-sm leading-relaxed text-text-secondary">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading label="Approach" title="How CapSignal matches AI raises" as="h3" />
              <ul className="mt-6 space-y-3">
                {sector.approach.map((a) => (
                  <li key={a} className="text-sm leading-relaxed text-text-secondary">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>
      )}

      <PageSection border="bottom">
        <SectionHeading label="Founders" title="AI founders on CapSignal" />
        <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
          {aiTestimonials.map((t) => (
            <Panel key={t.id} padding="default" className="border-0">
              <blockquote className="text-[15px] leading-relaxed text-text-primary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm font-medium text-text-primary">
                {t.name} · {t.company}
              </p>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection border="bottom">
        <SectionHeading label="FAQ" title="AI fundraising questions" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {aiAnswers.map((entry) => (
            <Link
              key={entry.slug}
              href={`/answers/${entry.slug}`}
              className="panel-interactive p-5"
            >
              <h3 className="font-medium text-text-primary">{entry.question}</h3>
              <p className="mt-2 text-sm text-text-secondary line-clamp-3">{entry.answer}</p>
            </Link>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <GuaranteeLine />
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="primary" href="/start#apply" className="bg-brand border-brand hover:bg-brand/90">
            Preview your AI investor matches
          </Button>
          <Button variant="secondary" href="/resources/ai-seed-investors-still-writing-checks">
            Read: AI Seed investors in 2026
          </Button>
        </div>
      </PageSection>
    </>
  );
}
