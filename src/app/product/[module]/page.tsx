import type { Metadata } from "next";
import Link from "next/link";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { productModules } from "@/lib/content/product";
import { DetailHeader } from "@/components/ui/detail-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { ProductPreview } from "@/components/sections/product-preview";
import { SequencesPreview } from "@/components/product/sequences-preview";
import { AnalyticsPreview } from "@/components/product/analytics-preview";

type Props = { params: Promise<{ module: string }> };

const previews: Record<string, ComponentType> = {
  matching: ProductPreview,
  outreach: SequencesPreview,
  analytics: AnalyticsPreview,
};

export async function generateStaticParams() {
  return productModules.map((m) => ({ module: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: id } = await params;
  const mod = productModules.find((m) => m.id === id);
  if (!mod) return { title: "Product" };
  return { title: mod.title, description: mod.description };
}

export default async function ProductModulePage({ params }: Props) {
  const { module: id } = await params;
  const mod = productModules.find((m) => m.id === id);
  if (!mod) notFound();

  const Preview = previews[id];
  const others = productModules.filter((m) => m.id !== id);

  return (
    <>
      <DetailHeader
        breadcrumbs={[{ label: "Product", href: "/product" }, { label: mod.title }]}
        label={mod.title}
        title={mod.headline}
        description={mod.description}
      >
        <Button variant="primary" href="/request-access">
          Request access
        </Button>
      </DetailHeader>

      <PageSection border="bottom">
        <div className="panel">{Preview && <Preview />}</div>
      </PageSection>

      <PageSection>
        <SectionHeading label="Capabilities" title="What this module handles" />
        <ul className="mt-8 max-w-2xl space-y-3 border-l border-border pl-5">
          {mod.bullets.map((b) => (
            <li key={b} className="text-[15px] leading-snug text-text-secondary">
              {b}
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection variant="muted" size="sm" border="top">
        <SectionHeading label="Modules" title="Explore the rest of the platform" as="h3" />
        <div className="mt-6 flex flex-wrap gap-3">
          {others.map((m) => (
            <Link
              key={m.id}
              href={`/product/${m.id}`}
              className="panel-interactive px-4 py-2.5 text-sm font-medium text-text-primary"
            >
              {m.title} →
            </Link>
          ))}
        </div>
        <TextLink href="/product" className="mt-6 inline-block">
          All modules →
        </TextLink>
      </PageSection>
    </>
  );
}
