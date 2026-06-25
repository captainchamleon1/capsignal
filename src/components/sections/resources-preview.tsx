import Link from "next/link";
import { guides } from "@/lib/content/resources";
import { Container } from "@/components/ui/container";

export function ResourcesPreview() {
  const featured = guides.slice(0, 4);

  return (
    <section className="border-t border-border py-(--spacing-section)">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
              Fundraising guides
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              Practical writing on outreach, targeting, and running a structured raise.
            </p>
          </div>
          <Link href="/resources" className="shrink-0 text-sm text-text-secondary hover:text-text-primary">
            All guides →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {featured.map((guide) => (
            <Link
              key={guide.slug}
              href={`/resources/${guide.slug}`}
              className="group rounded-xl border border-border p-6 transition-colors hover:border-border-strong md:p-8"
            >
              <div className="flex items-center gap-3 text-xs text-text-tertiary">
                <span>{guide.category}</span>
                <span>·</span>
                <span>{guide.readTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:underline">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
