import type { Metadata } from "next";
import Link from "next/link";
import { guides, guideCategories } from "@/lib/content/resources";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Resources",
  description: "Fundraising guides on outreach, targeting, and running a structured raise.",
};

export default function ResourcesPage() {
  const byCategory = guideCategories.map((cat) => ({
    category: cat,
    guides: guides.filter((g) => g.category === cat),
  }));

  return (
    <>
      <PageHeader
        label="Resources"
        title="Fundraising guides"
        description="Practical writing on investor outreach, shortlist building, and raise execution—from the CapSignal team."
      />

      <PageSection>
        {byCategory.map(({ category, guides: catGuides }) =>
          catGuides.length > 0 ? (
            <div key={category} className="mb-14 last:mb-0">
              <SectionHeading label={category} title={category} as="h3" />
              <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
                {catGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/resources/${guide.slug}`}
                    className="panel-interactive flex flex-col p-6"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                      <span>{guide.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.published}</span>
                    </div>
                    <h3 className="display-serif mt-3 text-base font-semibold text-text-primary">
                      {guide.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </PageSection>
    </>
  );
}
