import type { Metadata } from "next";
import Link from "next/link";
import { docCategories, getDocsByCategory } from "@/lib/content/docs";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Help center for CapSignal campaigns, outreach, and account setup.",
};

export default function DocsPage() {
  return (
    <>
      <PageHeader
        label="Documentation"
        title="Help center"
        description="Setup guides, campaign configuration, and account documentation."
      />

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-[220px_1fr]">
          <aside>
            <nav className="sticky top-24 space-y-8">
              {docCategories.map((cat) => (
                <div key={cat.id}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
                    {cat.label}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {getDocsByCategory(cat.id).map((doc) => (
                      <li key={doc.slug}>
                        <Link
                          href={`/docs/${doc.slug}`}
                          className="block py-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
                        >
                          {doc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <div>
            {docCategories.map((cat) => {
              const catDocs = getDocsByCategory(cat.id);
              if (catDocs.length === 0) return null;
              return (
                <div key={cat.id} className="mb-14 last:mb-0">
                  <SectionHeading label={cat.label} title={cat.label} as="h3" />
                  <div className="mt-6 divide-y divide-border border border-border">
                    {catDocs.map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="flex flex-col px-5 py-4 transition-colors hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-text-primary">{doc.title}</span>
                        <span className="mt-1 text-sm text-text-secondary sm:mt-0">{doc.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>
    </>
  );
}
