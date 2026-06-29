import type { Metadata } from "next";
import { onboardingMeta } from "@/lib/content/onboarding";
import { lpProofStats } from "@/lib/content/lp";
import { Container } from "@/components/ui/container";
import { LeadWizardWithParams } from "@/components/forms/lead-wizard-with-params";
import { Reveal, RevealStagger } from "@/components/ui/reveal";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Build your raise profile",
  description:
    "Complete your raise profile to get a scored investor shortlist — before any pricing or commitment.",
};

const journeySteps = [
  "About you & your company",
  "Business model & traction context",
  "Funding history & exit background",
  "Current raise details",
  "Review & score your matches",
  "Choose plan & unlock contacts",
];

export default function StartPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border pt-safe pb-8 md:pt-10 md:pb-16 lg:pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-20%,var(--brand-tint),transparent)]"
          aria-hidden="true"
        />
        <Container wide>
          {/* Mobile: compact intro above wizard */}
          <Reveal direction="up" className="mb-6 lg:hidden">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              Raise profile · {onboardingMeta.timeEstimate}
            </p>
            <h1 className="display-serif mt-3 text-balance text-[1.75rem] font-semibold leading-[1.08] text-text-primary">
              {onboardingMeta.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
              Six steps — see investor matches before pricing.
            </p>
          </Reveal>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,380px)_1fr]">
            <Reveal direction="up" className="hidden lg:block">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                Raise profile · {onboardingMeta.timeEstimate}
              </p>
              <h1 className="display-serif mt-5 text-balance text-[2.25rem] font-semibold leading-[1.06] text-text-primary xl:text-[3.25rem]">
                {onboardingMeta.title}
              </h1>
              <p className="mt-5 text-[16px] leading-[1.65] text-text-secondary">
                {onboardingMeta.subtitle} Complete all six steps — you&apos;ll see your investor
                matches before pricing.
              </p>

              <ol className="mt-10 space-y-3 border-t border-border pt-8">
                {journeySteps.map((item, i) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-surface-muted font-mono text-[10px] text-text-tertiary">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ol>

              <RevealStagger stagger={70} className="mt-10 grid grid-cols-2 gap-4">
                {lpProofStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="reveal-stagger-item border border-border bg-surface-elevated p-4"
                  >
                    <p className="font-mono text-base font-medium tabular-nums text-text-primary">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-text-tertiary">{stat.label}</p>
                  </div>
                ))}
              </RevealStagger>

              <ul className="mt-8 space-y-2">
                {[
                  "Source-attributed investor data only",
                  "Thesis-aware outreach from your domain",
                  "Full CRM through close",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={100} direction="left" className="min-w-0">
              <div
                id="apply"
                className="min-w-0 scroll-mt-20 border border-border bg-surface-elevated p-4 shadow-[0_32px_100px_-32px_rgba(0,0,0,0.15)] sm:p-6 md:scroll-mt-24 lg:p-10"
              >
                <LeadWizardWithParams source="lp-start" id="apply-form" />
              </div>
            </Reveal>
          </div>

          {/* Mobile: collapsible journey below wizard */}
          <details className="mt-8 border border-border bg-surface-muted p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-text-primary">
              What happens after you submit
            </summary>
            <ol className="mt-4 space-y-2.5">
              {journeySteps.map((item, i) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <span className="font-mono text-[10px] text-brand">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </details>
        </Container>
      </section>
    </>
  );
}
