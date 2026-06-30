"use client";

import Link from "next/link";
import { lpProofStats } from "@/lib/content/lp";
import { Container } from "@/components/ui/container";
import { StartApplyButton } from "@/components/ui/start-apply-button";
import { Reveal } from "@/components/ui/reveal";
import { Check } from "lucide-react";

export function HomepageApplyBand() {
  return (
    <section
      id="homepage-apply"
      className="scroll-mt-20 border-y border-border bg-surface-elevated py-(--spacing-section-sm) transition-shadow duration-500"
    >
      <Container wide>
        <Reveal direction="up">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
                Free raise profile · ~4 min
              </p>
              <h2 className="display-serif mt-4 text-balance text-2xl font-semibold text-text-primary md:text-3xl">
                See your investor matches before any pricing
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">
                Six quick steps. We score investors against your stage, sector, and check size —
                then you choose a plan only if the shortlist looks right.
              </p>

              <ul className="mt-6 space-y-2">
                {[
                  "Source-attributed investor data only",
                  "Thesis-aware outreach from your domain",
                  "Full CRM through close",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
                {lpProofStats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="border border-border bg-surface-page p-3">
                    <p className="font-mono text-sm font-medium tabular-nums text-text-primary">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-text-tertiary">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[240px]">
              <StartApplyButton
                variant="primary"
                className="min-h-[52px] w-full bg-brand border-brand hover:bg-brand/90"
              >
                Build your raise profile
              </StartApplyButton>
              <Link
                href="/pricing"
                className="text-center text-sm text-text-secondary hover:text-text-primary"
              >
                View pricing first →
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
