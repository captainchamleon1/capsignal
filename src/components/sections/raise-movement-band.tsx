import { raiseMovement } from "@/lib/content/raise-movement";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Check, X } from "lucide-react";

export function RaiseMovementBand() {
  return (
    <section className="border-b border-border bg-surface-page py-(--spacing-section-sm)">
      <Container wide>
        <Reveal direction="up">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              {raiseMovement.eyebrow}
            </p>
            <h2 className="display-serif mt-4 text-balance text-2xl font-semibold text-text-primary md:text-[2.25rem]">
              The old way of raising is broken. This is the new default.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary">
              Founders used to stitch together five tools and a $20K retainer just to get a meeting.
              CapSignal is how you run a raise now — matched investors, outreach, and pipeline in one
              system.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-surface-elevated p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
                The old way
              </p>
              <ul className="mt-5 space-y-3">
                {raiseMovement.oldWay.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-brand/30 bg-brand/[0.04] p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand">
                With CapSignal
              </p>
              <ul className="mt-5 space-y-3">
                {raiseMovement.newWay.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-primary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {raiseMovement.easePoints.map((point) => (
              <div key={point.title} className="border border-border bg-surface-elevated p-5">
                <p className="text-sm font-medium text-text-primary">{point.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{point.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
