import Link from "next/link";
import { testimonials } from "@/lib/content/home";
import { caseStudies } from "@/lib/content/customers";
import { Container } from "@/components/ui/container";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { TextLink } from "@/components/ui/text-link";

const featured = testimonials[0];
const secondary = testimonials[1];
const meridian = caseStudies.find((c) => c.slug === featured.slug)!;

export function Proof() {
  return (
    <section className="bg-surface-dark py-(--spacing-section) text-text-on-dark">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <Reveal direction="right">
            <blockquote className="relative">
              <span
                className="pointer-events-none absolute -left-1 -top-6 font-serif text-[5rem] leading-none text-surface-dark-border select-none md:-top-8 md:text-[6rem]"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="relative text-balance text-2xl font-medium leading-[1.45] tracking-[-0.02em] text-text-on-dark md:text-[1.85rem]">
                {featured.quote}
              </p>
              <footer className="mt-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <cite className="not-italic text-sm font-medium text-text-on-dark">
                    {featured.author}
                  </cite>
                  <p className="mt-0.5 text-sm text-text-on-dark-muted">{featured.title}</p>
                </div>
                <p className="font-mono text-sm tabular-nums text-text-on-dark-muted">
                  {featured.detail}
                </p>
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={120} direction="left">
            <div className="flex flex-col justify-between border-t border-surface-dark-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-on-dark-muted">
                  Case study
                </p>
                <Link
                  href={`/customers/${featured.slug}`}
                  className="link-hover mt-3 block text-lg font-medium text-text-on-dark"
                >
                  Meridian Labs — Seed round
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-text-on-dark-muted">
                  Ten meetings in fourteen days from a standing start. Full write-up
                  on shortlist quality and reply rates.
                </p>

                <RevealStagger stagger={90} className="mt-8 grid grid-cols-2 gap-4">
                  {meridian.results.map((result) => (
                    <div
                      key={result.label}
                      className="reveal-stagger-item border-t border-surface-dark-border pt-3"
                    >
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-text-on-dark-muted">
                        {result.label}
                      </dt>
                      <dd className="mt-1 font-mono text-sm tabular-nums text-text-on-dark">
                        <CountUp value={result.value} />
                      </dd>
                    </div>
                  ))}
                </RevealStagger>
              </div>

              <TextLink
                href="/customers"
                className="mt-10 text-text-on-dark-muted hover:text-text-on-dark"
              >
                All case studies →
              </TextLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={180} direction="up">
          <figure className="mt-16 border-t border-surface-dark-border pt-10 md:mt-20">
            <p className="max-w-2xl text-[15px] leading-relaxed text-text-on-dark-muted">
              &ldquo;{secondary.quote}&rdquo;
            </p>
            <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-text-on-dark">{secondary.author}</span>
              <span className="text-sm text-text-on-dark-muted">{secondary.title}</span>
              <span className="font-mono text-xs tabular-nums text-text-on-dark-muted">
                · {secondary.detail}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
