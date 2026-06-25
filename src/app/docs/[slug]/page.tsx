import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docs, getDoc, docCategories, getDocsByCategory } from "@/lib/content/docs";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageSection } from "@/components/ui/page-section";
import { SectionLabel } from "@/components/ui/section-label";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: "Documentation" };
  return { title: doc.title, description: doc.description };
}

function DocsSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav className="sticky top-24 space-y-8">
      {docCategories.map((cat) => (
        <div key={cat.id}>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
            {cat.label}
          </p>
          <ul className="mt-3 space-y-1">
            {getDocsByCategory(cat.id).map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/docs/${d.slug}`}
                  className={`block py-1 text-sm transition-colors ${
                    d.slug === activeSlug
                      ? "font-medium text-text-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const category = docCategories.find((c) => c.id === doc.category);

  return (
    <>
      <section className="border-b border-border bg-surface-elevated pt-14 pb-12 md:pt-20 md:pb-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <DocsSidebar activeSlug={slug} />
            </aside>
            <div className="max-w-3xl">
              <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: doc.title }]} />
              {category && (
                <SectionLabel index="—" title={category.label} className="mt-6" />
              )}
              <h1 className="display-serif mt-5 text-balance text-3xl font-semibold text-text-primary md:text-[2.5rem]">
                {doc.title}
              </h1>
              <p className="mt-4 text-[17px] leading-relaxed text-text-secondary">{doc.description}</p>
            </div>
          </div>
        </Container>
      </section>

      <PageSection size="sm">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block" aria-hidden="true" />
          <article className="prose-content max-w-(--width-reading)">
            {doc.sections.map((section) => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </article>
        </div>
      </PageSection>
    </>
  );
}
