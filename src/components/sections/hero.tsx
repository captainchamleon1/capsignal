import { logos } from "@/lib/content/home";
import { heroContent } from "@/lib/content/hero";
import { Container } from "@/components/ui/container";
import { StartApplyButton } from "@/components/ui/start-apply-button";
import { BookCallButton } from "@/components/book-call/book-call-button";
import { TextLink } from "@/components/ui/text-link";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { HeroRaiseCanvas } from "@/components/sections/hero-raise-canvas";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-safe pb-0 md:pt-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_100%_0%,var(--brand-tint),transparent_55%)]"
        aria-hidden="true"
      />

      <Container wide className="relative">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-20">
          <Reveal direction="up">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              {heroContent.eyebrow}
            </p>

            <h1 className="display-serif mt-5 text-balance text-[2rem] font-semibold leading-[1.06] text-text-primary sm:text-[2.75rem] md:mt-7 md:text-[3.75rem] lg:text-[4.25rem]">
              {heroContent.headline[0]}
              <span className="mt-1 block text-text-secondary">{heroContent.headline[1]}</span>
            </h1>

            <p className="mt-5 max-w-lg text-[16px] leading-[1.65] text-text-secondary md:mt-7 md:text-[17px] md:leading-[1.7]">
              {heroContent.subhead}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-3">
              <StartApplyButton
                variant="primary"
                className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90 sm:w-auto"
              >
                {heroContent.cta}
              </StartApplyButton>
              <BookCallButton
                variant="secondary"
                className="min-h-[48px] w-full sm:w-auto"
              />
              <TextLink
                href="#product"
                className="inline-flex min-h-[44px] items-center justify-center sm:justify-start"
              >
                {heroContent.ctaSecondary}
              </TextLink>
            </div>
          </Reveal>

          <Reveal delay={120} direction="left">
            <HeroRaiseCanvas />
          </Reveal>
        </div>
      </Container>

      <Reveal delay={200} direction="scale" blur className="mt-12 min-w-0 md:mt-20">
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
