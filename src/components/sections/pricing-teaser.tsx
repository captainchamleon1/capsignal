import { capsignalPlan } from "@/lib/content/pricing";
import { GuaranteeLine } from "@/components/ui/guarantee-line";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";

export function PricingTeaser() {
  return (
    <section className="hairline-y bg-surface-elevated py-(--spacing-section-sm)">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-16">
          <Reveal direction="left">
            <SectionLabel index="—" title="Pricing" />
            <h2 className="display-serif mt-5 text-2xl font-semibold text-text-primary md:text-3xl">
              One plan. No success carry.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary">
              {capsignalPlan.price}/mo for verified investor contacts, ranked shortlists, outreach
              sequences, and hands-on raise support.
            </p>
            <TextLink href="/pricing" className="mt-6 inline-block">
              See everything included →
            </TextLink>
          </Reveal>

          <Reveal delay={150} direction="scale" blur>
            <div className="border border-border bg-surface-muted p-6 md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  CapSignal
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">{capsignalPlan.period}</span>
              </div>
              <p className="mt-3 font-mono text-2xl font-medium tabular-nums text-text-primary">
                {capsignalPlan.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {capsignalPlan.description}
              </p>
              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {capsignalPlan.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="text-[13px] text-text-secondary">
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" href="/start#apply" className="mt-8 w-full bg-brand border-brand hover:bg-brand/90">
                Get started
              </Button>
              <GuaranteeLine className="mt-3 w-full" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
