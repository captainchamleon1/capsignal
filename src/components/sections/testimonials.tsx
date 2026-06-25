import Link from "next/link";
import { testimonials } from "@/lib/content/home";
import { Container } from "@/components/ui/container";

export function Testimonials() {
  return (
    <section className="border-y border-border bg-surface-muted py-(--spacing-section)">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
            From recent raises
          </h2>
          <Link href="/customers" className="shrink-0 text-sm text-text-secondary hover:text-text-primary">
            All case studies →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Link
              key={t.slug}
              href={`/customers/${t.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface-elevated p-6 transition-colors hover:border-border-strong md:p-8"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-text-primary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
                <div>
                  <p className="text-sm font-medium text-text-primary">{t.author}</p>
                  <p className="text-sm text-text-tertiary">{t.title}</p>
                </div>
                <p className="font-mono text-xs tabular-nums text-text-secondary">{t.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
