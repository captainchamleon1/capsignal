import { pricingTiers } from "@/lib/content/pricing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PricingCardsProps = {
  compact?: boolean;
};

export function PricingCards({ compact }: PricingCardsProps) {
  return (
    <div className="grid gap-px border border-border bg-border lg:grid-cols-3">
      {pricingTiers.map((tier) => (
        <article
          key={tier.name}
          className={cn(
            "flex flex-col p-6 md:p-8",
            tier.featured ? "bg-surface-muted" : "bg-surface-elevated",
          )}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold text-text-primary">{tier.name}</h3>
            {tier.featured && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                Popular
              </span>
            )}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-medium tabular-nums tracking-tight text-text-primary">
              {tier.price}
            </span>
            <span className="text-sm text-text-tertiary">{tier.period}</span>
          </div>
          {!compact && (
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{tier.description}</p>
          )}
          <ul
            className={cn(
              "flex-1 space-y-2.5",
              compact ? "mt-5" : "mt-6 border-t border-border pt-6",
            )}
          >
            {tier.features.map((feature) => (
              <li key={feature} className="text-[13px] leading-snug text-text-secondary">
                {feature}
              </li>
            ))}
          </ul>
          <Button
            variant={tier.featured ? "primary" : "secondary"}
            href="/request-access"
            className="mt-8 w-full"
          >
            Request access
          </Button>
        </article>
      ))}
    </div>
  );
}
