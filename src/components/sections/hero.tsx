import { logos, stats } from "@/lib/content/home";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { ProductShowcase } from "@/components/sections/product-showcase";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-safe pb-0 md:pt-20">
      <Container wide>
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <Reveal direction="up">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Built to get you investors
            </p>

            <h1 className="display-serif mt-5 text-balance text-[2rem] font-semibold leading-[1.08] text-text-primary sm:text-[2.65rem] md:mt-7 md:text-[4.5rem]">
              Investor outreach
              <span className="block text-text-secondary">that gets meetings</span>
            </h1>

            <p className="mt-5 max-w-lg text-[16px] leading-[1.65] text-text-secondary md:mt-7 md:text-[17px]">
              Match with investors deploying in your space. Send thesis-aware
              sequences from your inbox. Track every reply in an investor CRM
              and share diligence through a built-in data room—all the way to
              close.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <Button
                variant="primary"
                href="/start#apply"
                className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90 sm:w-auto"
              >
                Build your raise profile
              </Button>
              <TextLink
                href="#product"
                className="inline-flex min-h-[44px] items-center justify-center sm:justify-start"
              >
                See how it works
              </TextLink>
            </div>
          </Reveal>

          <Reveal delay={150} direction="left">
            <RevealStagger
              stagger={120}
              className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-8 sm:gap-x-8 sm:gap-y-6 lg:border-t-0 lg:pt-0"
            >
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

      <Reveal delay={200} direction="scale" blur className="mt-10 min-w-0 md:mt-16">
        <div className="w-full border-y border-border bg-surface-elevated">
          <Container wide className="py-1">
            <ProductShowcase className="border-0" />
          </Container>
        </div>
      </Reveal>

      <Container wide>
        <Reveal delay={280}>
          <RevealStagger
            stagger={60}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-8 md:gap-x-5 md:py-14"
          >
            <span className="reveal-stagger-item font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
              Referred from
            </span>
            {logos.map((name, i) => (
              <span key={name} className="reveal-stagger-item flex items-center gap-4 md:gap-5">
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
