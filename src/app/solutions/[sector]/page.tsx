import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectors, getSector } from "@/lib/content/sectors";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatGrid } from "@/components/ui/stat-grid";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = { params: Promise<{ sector: string }> };

export async function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) return { title: "Solutions" };
  return { title: sector.name, description: sector.description };
}

export default async function SectorPage({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  return (
    <>
      <PageHeader label="Solutions" title={sector.headline} description={sector.description}>
        <Button variant="primary" href="/request-access">
          Request access
        </Button>
      </PageHeader>

      <PageSection border="bottom">
        <Breadcrumbs items={[{ label: "Solutions", href: "/founders" }, { label: sector.name }]} />
        <div className="mt-8">
          <StatGrid items={sector.stats} columns={3} />
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading label="Challenges" title="What founders in this sector face" />
            <ul className="mt-8 space-y-3 border-l border-border pl-5">
              {sector.challenges.map((c) => (
                <li key={c} className="text-sm leading-relaxed text-text-secondary">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading label="Approach" title="How CapSignal targets" />
            <ul className="mt-8 space-y-3 border-l border-border pl-5">
              {sector.approach.map((a) => (
                <li key={a} className="text-sm leading-relaxed text-text-secondary">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Panel muted className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
            Example investors
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {sector.exampleInvestors.join(" · ")}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-tertiary">
            Illustrative examples—not endorsements. Your matches are scored from live signal data.
          </p>
        </Panel>
      </PageSection>
    </>
  );
}
