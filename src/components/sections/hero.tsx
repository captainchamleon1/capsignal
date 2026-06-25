import { logos, stats } from "@/lib/content/home";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { ProductShowcase } from "@/components/sections/product-showcase";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-0 md:pt-20">
      <Container wide>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal direction="up">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Built to get you investors
            </p>

            <h1 className="display-serif mt-7 text-balance text-[2.65rem] font-semibold text-text-primary md:text-[4.5rem]">
              Investor outreach
              <span className="block text-text-secondary">that gets meetings</span>
            </h1>

            <p className="mt-7 max-w-lg text-[17px] leading-[1.65] text-text-secondary">
              Match with investors deploying in your space. Send thesis-aware
              sequences from your inbox. Track every reply in an investor CRM
              and share diligence through a built-in data room—all the way to
              close.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="primary" href="/request-access">
                Request access
              </Button>
              <TextLink href="#product">See how it works</TextLink>
            </div>
          </Reveal>

          <Reveal delay={150} direction="left">
            <RevealStagger stagger={120} className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 lg:border-t-0 lg:pt-0">
              {stats.map((stat) => (
                <div key={stat.label} className="reveal-stagger-item">
                  <dt className="font-mono text-xl font-medium tracking-tight text-text-primary md:text-2xl">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug text-text-tertiary">{stat.label}</dd>
                </div>
              ))}
            </RevealStagger>
          </Reveal>
        </div>
      </Container>

      <Reveal delay={200} direction="scale" blur className="mt-12 md:mt-16">
        <div className="bleed-x border-y border-border bg-surface-elevated">
          <Container wide className="py-1">
            <ProductShowcase className="border-0" />
          </Container>
        </div>
      </Reveal>

      <Container wide>
        <Reveal delay={280}>
          <RevealStagger stagger={60} className="flex flex-wrap items-center gap-x-5 gap-y-2 py-10 md:py-14">
            <span className="reveal-stagger-item font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
              Referred from
            </span>
            {logos.map((name, i) => (
              <span key={name} className="reveal-stagger-item flex items-center gap-5">
                {i > 0 && (
                  <span className="hidden text-border sm:inline" aria-hidden="true">
                    /
                  </span>
                )}
                <span className="text-[13px] text-text-tertiary">{name}</span>
              </span>
            ))}
          </RevealStagger>
        </Reveal>
      </Container>
    </section>
  );
}
