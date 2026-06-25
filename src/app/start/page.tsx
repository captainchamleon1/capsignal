import type { Metadata } from "next";
import { logos, stats, comparisonRows } from "@/lib/content/home";
import { lpFaqs, lpProofStats, lpSteps } from "@/lib/content/lp";
import { testimonials } from "@/lib/content/home";
import { siteConfig } from "@/lib/content/site";
import { Container } from "@/components/ui/container";
import { LeadWizard } from "@/components/forms/lead-wizard";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Get investor meetings without the spreadsheet grind",
  description:
    "CapSignal matches you with active investors, runs thesis-aware outreach from your inbox, and tracks every reply through close.",
  openGraph: {
    title: "Get investor meetings without the spreadsheet grind",
    description: siteConfig.description,
    url: `${siteConfig.url}/start`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

const featured = testimonials[0];

export default function StartPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--brand-tint),transparent)]"
          aria-hidden="true"
        />
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            <Reveal direction="up">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                Signal over spray
              </p>
              <h1 className="display-serif mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] text-text-primary md:text-[3.75rem]">
                Ten investor meetings
                <span className="block text-text-secondary">in two weeks—not two months</span>
              </h1>
              <p className="mt-6 max-w-lg text-[17px] leading-[1.65] text-text-secondary">
                Stop copy-pasting into spreadsheets. CapSignal scores active investors in your space,
                sends thesis-aware outreach from your domain, and tracks every reply through close.
              </p>

              <RevealStagger stagger={80} className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {lpProofStats.map((stat) => (
                  <div key={stat.label} className="reveal-stagger-item border-t border-border pt-4">
                    <p className="font-mono text-lg font-medium tabular-nums tracking-tight text-text-primary md:text-xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-text-tertiary">{stat.label}</p>
                  </div>
                ))}
              </RevealStagger>

              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                  Referred from
                </span>
                {logos.slice(0, 4).map((name) => (
                  <span key={name} className="text-[13px] text-text-tertiary">
                    {name}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} direction="left">
              <div id="apply" className="scroll-mt-24 border border-border bg-surface-elevated p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.12)] md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
                  Free shortlist preview
                </p>
                <h2 className="mt-3 text-xl font-semibold text-text-primary">
                  See who&apos;s deploying in your space
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Three quick steps — then we show your top investor matches before you commit.
                </p>
                <div className="mt-6">
                  <LeadWizard source="lp-start" id="apply-form" hidePricing />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-dark py-14 text-text-on-dark md:py-20">
        <Container>
          <Reveal direction="up">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <blockquote>
                <p className="text-balance text-xl font-medium leading-[1.5] md:text-2xl">
                  &ldquo;{featured.quote}&rdquo;
                </p>
                <footer className="mt-6">
                  <cite className="not-italic text-sm font-medium">{featured.author}</cite>
                  <p className="text-sm text-text-on-dark-muted">{featured.title}</p>
                  <p className="mt-2 font-mono text-xs tabular-nums text-text-on-dark-muted">
                    {featured.detail}
                  </p>
                </footer>
              </blockquote>
              <div className="grid grid-cols-2 gap-4 border-t border-surface-dark-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-t border-surface-dark-border pt-4">
                    <p className="font-mono text-lg tabular-nums text-text-on-dark">{stat.value}</p>
                    <p className="mt-1 text-xs text-text-on-dark-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container>
          <Reveal direction="up">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              How it works
            </p>
            <h2 className="display-serif mt-4 max-w-xl text-2xl font-semibold text-text-primary md:text-3xl">
              From raise profile to live campaign in under a week
            </h2>
          </Reveal>

          <RevealStagger stagger={100} className="mt-12 grid gap-8 md:grid-cols-3">
            {lpSteps.map((step) => (
              <article key={step.step} className="reveal-stagger-item border-t border-border pt-6">
                <span className="font-mono text-xs text-brand">{step.step}</span>
                <h3 className="mt-3 text-lg font-medium text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.body}</p>
              </article>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="border-y border-border bg-surface-muted py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container>
          <Reveal direction="up">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
              Why founders switch
            </p>
            <h2 className="display-serif mt-4 text-2xl font-semibold text-text-primary md:text-3xl">
              Manual outreach vs. CapSignal
            </h2>
          </Reveal>

          <div className="mt-10 overflow-x-auto">
            <table className="data-table w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left">Capability</th>
                  <th className="text-left">Manual</th>
                  <th className="text-left">CapSignal</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.slice(0, 4).map((row) => (
                  <tr key={row.feature}>
                    <td className="font-medium text-text-primary">{row.feature}</td>
                    <td className="text-text-tertiary">{row.manual}</td>
                    <td className="text-text-primary">
                      <span className="inline-flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        {row.capsignal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-(--spacing-section-sm) md:py-(--spacing-section)">
        <Container narrow>
          <Reveal direction="up">
            <h2 className="display-serif text-center text-2xl font-semibold text-text-primary md:text-3xl">
              Common questions
            </h2>
          </Reveal>
          <RevealStagger stagger={80} className="mt-10 space-y-0">
            {lpFaqs.map((faq) => (
              <details key={faq.q} className="reveal-stagger-item group border-t border-border py-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-text-primary [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="font-mono text-lg text-text-tertiary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{faq.a}</p>
              </details>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="border-t border-border bg-brand-tint py-14 md:py-20">
        <Container>
          <Reveal direction="up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="display-serif text-2xl font-semibold text-text-primary md:text-3xl">
                Ready to stop guessing who to email?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                Your ranked shortlist is one form away. See your matches first—then decide.
              </p>
              <div className="mt-8">
                <a
                  href="#apply"
                  className="inline-flex h-11 items-center bg-text-primary px-6 text-sm font-medium text-text-on-dark transition-colors hover:bg-[var(--primary-hover)]"
                >
                  See my matches
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-page/95 p-3 backdrop-blur-sm md:hidden">
        <a
          href="#apply"
          className="flex h-11 w-full items-center justify-center bg-text-primary text-sm font-medium text-text-on-dark"
        >
          See my matches
        </a>
      </div>
    </>
  );
}
