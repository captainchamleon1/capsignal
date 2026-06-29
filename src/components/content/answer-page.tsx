import type { AnswerEntry } from "@/lib/content/answers";
import Link from "next/link";
import { DetailHeader, MetaSep } from "@/components/ui/detail-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

type AnswerPageProps = {
  entry: AnswerEntry;
  breadcrumbLabel?: string;
  breadcrumbHref?: string;
};

export function AnswerPage({ entry, breadcrumbLabel = "Answers", breadcrumbHref = "/answers" }: AnswerPageProps) {
  return (
    <>
      <DetailHeader
        breadcrumbs={[{ label: breadcrumbLabel, href: breadcrumbHref }, { label: entry.question }]}
        narrow
        meta={
          <>
            <span>FAQ</span>
            <MetaSep />
            <span>CapSignal</span>
          </>
        }
        title={entry.question}
        description={entry.description}
      />

      <PageSection>
        <article className="prose-content mx-auto max-w-(--width-reading)">
          <p className="text-lg leading-relaxed text-text-primary">{entry.answer}</p>
          {entry.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </article>
      </PageSection>

      {entry.relatedSlugs && entry.relatedSlugs.length > 0 && (
        <PageSection variant="muted" size="sm" border="top">
          <SectionHeading label="Related" title="Continue reading" as="h3" />
          <ul className="mt-6 space-y-3">
            {entry.relatedSlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/answers/${slug}`} className="text-sm font-medium text-text-primary hover:underline">
                  {slug.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </PageSection>
      )}

      <PageSection size="sm">
        <Button variant="primary" href="/start#apply" className="bg-brand border-brand hover:bg-brand/90">
          Start 7-day free trial
        </Button>
      </PageSection>
    </>
  );
}
