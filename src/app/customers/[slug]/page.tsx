import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/content/customers";
import { DetailHeader, MetaSep } from "@/components/ui/detail-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatGrid } from "@/components/ui/stat-grid";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study" };
  return {
    title: study.company,
    description: study.headline,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <DetailHeader
        back={{ label: "All case studies", href: "/customers" }}
        meta={
          <>
            <span>{study.company}</span>
            <MetaSep />
            <span>{study.stage}</span>
            <MetaSep />
            <span>{study.sector}</span>
            <MetaSep />
            <span>{study.timeline}</span>
          </>
        }
        title={study.headline}
        description={study.summary}
      />

      <PageSection border="bottom">
        <StatGrid
          items={study.results.map((r) => ({ value: r.value, label: r.label }))}
          columns={study.results.length <= 3 ? 3 : 4}
        />
      </PageSection>

      <PageSection variant="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading label="Challenge" title="Where they started" as="h3" />
            <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{study.challenge}</p>
          </div>
          <div>
            <SectionHeading label="Approach" title="What CapSignal ran" as="h3" />
            <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{study.approach}</p>
          </div>
        </div>

        <Panel className="mt-12">
          <p className="display-serif text-xl leading-relaxed text-text-primary md:text-2xl">
            &ldquo;{study.quote}&rdquo;
          </p>
          <footer className="mt-6 font-mono text-sm text-text-tertiary">
            — {study.founder}, {study.role}, {study.company}
          </footer>
        </Panel>
      </PageSection>

      <PageSection size="sm">
        <Button variant="primary" href="/request-access">
          Run a raise like this
        </Button>
      </PageSection>
    </>
  );
}
