import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide } from "@/lib/content/resources";
import { DetailHeader, MetaSep } from "@/components/ui/detail-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };
  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guides.filter((g) => g.slug !== slug && g.category === guide.category).slice(0, 2);

  return (
    <>
      <DetailHeader
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: guide.title }]}
        narrow
        meta={
          <>
            <span>{guide.category}</span>
            <MetaSep />
            <span>{guide.readTime}</span>
            <MetaSep />
            <span>{guide.published}</span>
          </>
        }
        title={guide.title}
        description={guide.description}
      />

      <PageSection>
        <article className="prose-content mx-auto max-w-(--width-reading)">
          {guide.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </article>
      </PageSection>

      {related.length > 0 && (
        <PageSection variant="muted" size="sm" border="top">
          <SectionHeading label="Related" title="Continue reading" as="h3" />
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/resources/${g.slug}`}
                className="panel-interactive p-5"
              >
                <h3 className="font-medium text-text-primary">{g.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{g.description}</p>
              </Link>
            ))}
          </div>
        </PageSection>
      )}

      <PageSection size="sm">
        <Button variant="primary" href="/request-access">
          Run a raise with CapSignal
        </Button>
      </PageSection>
    </>
  );
}
