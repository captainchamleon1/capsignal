import { Container } from "@/components/ui/container";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { testimonials, testimonialStats } from "@/lib/content/testimonials";
import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";

export function TestimonialsSection() {
  return (
    <section className="border-t border-border py-(--spacing-section)">
      <Container wide>
        <Reveal direction="up">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
              Founders on CapSignal
            </p>
            <h2 className="display-serif mt-4 text-balance text-2xl font-semibold text-text-primary md:text-3xl">
              Built for founders who hate fundraising admin
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
              Representative outcomes from AI, SaaS, and fintech raises on CapSignal. Names
              altered for privacy.
            </p>
          </div>
        </Reveal>

        <RevealStagger
          stagger={80}
          className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {testimonialStats.map((stat) => (
            <div key={stat.label} className="reveal-stagger-item bg-surface-elevated p-6">
              <p className="font-mono text-2xl font-medium text-text-primary">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </RevealStagger>

        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 40} direction="up">
              <figure className="flex h-full flex-col bg-surface-elevated p-6 md:p-8">
                {t.highlight && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-brand">
                    {t.highlight}
                  </p>
                )}
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-text-primary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-sm text-text-secondary">
                    {t.role}, {t.company}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    {t.stage} · {t.sector}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <Button variant="primary" href="/start#apply" className="min-h-[48px] bg-brand border-brand hover:bg-brand/90">
            Build your raise profile
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
