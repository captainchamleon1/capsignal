import { pricingTiers } from "@/lib/content/pricing";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";

export function PricingTeaser() {
  const featured = pricingTiers.find((t) => t.featured)!;
  const others = pricingTiers.filter((t) => !t.featured);

  return (
    <section className="hairline-y bg-surface-elevated py-(--spacing-section-sm)">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-16">
          <Reveal direction="left">
            <SectionLabel index="—" title="Pricing" />
            <h2 className="display-serif mt-5 text-2xl font-semibold text-text-primary md:text-3xl">
              Monthly plans. No success carry.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-text-secondary">
              Launch from {pricingTiers[0].price}/mo, Scale at {featured.price}/mo. Full
              Service at {pricingTiers[2].price}/mo for end-to-end engagement.
            </p>

            <RevealStagger stagger={80} className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((tier) => (
                <div key={tier.name} className="reveal-stagger-item flex items-baseline gap-2">
                  <span className="text-sm text-text-tertiary">{tier.name}</span>
                  <span className="font-mono text-sm font-medium tabular-nums text-text-primary">
                    {tier.price}
                  </span>
                </div>
              ))}
            </RevealStagger>

            <TextLink href="/pricing" className="mt-6 inline-block">
              Compare all tiers →
            </TextLink>
          </Reveal>

          <Reveal delay={150} direction="scale" blur>
            <div className="border border-border bg-surface-muted p-6 md:p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Most popular
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">{featured.period}</span>
              </div>
              <h3 className="mt-3 text-lg font-medium text-text-primary">{featured.name}</h3>
              <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-text-primary">
                {featured.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {featured.description}
              </p>
              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {featured.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="text-[13px] text-text-secondary">
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" href="/request-access" className="mt-8 w-full">
                Request access
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
