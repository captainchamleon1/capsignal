import { openvcComparison } from "@/lib/content/openvc-compare";
import { selfServePricing } from "@/lib/content/guarantee";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal, RevealStagger } from "@/components/ui/reveal";

export function OpenVcCompare() {
  return (
    <section className="hairline-y bg-surface-page py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <SectionLabel index="—" title="Compare" />
          <h2 className="display-serif mt-5 max-w-2xl text-2xl font-semibold text-text-primary md:text-3xl">
            {openvcComparison.title}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            {openvcComparison.subtitle}
          </p>
        </Reveal>

        <Reveal delay={100} direction="up" className="mt-10">
          <div className="hidden overflow-hidden border border-border md:block">
            <div className="grid grid-cols-[minmax(160px,220px)_1fr_1fr] border-b border-border bg-surface-muted">
              <div className="px-5 py-3" />
              <div className="border-l border-border px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  {openvcComparison.columns.free}
                </span>
              </div>
              <div className="border-l border-border bg-brand-tint px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-brand">
                  {openvcComparison.columns.capsignal}
                </span>
              </div>
            </div>

            {openvcComparison.rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[minmax(160px,220px)_1fr_1fr] ${i < openvcComparison.rows.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="px-5 py-4">
                  <span className="text-sm font-medium text-text-primary">{row.feature}</span>
                </div>
                <div className="border-l border-border px-5 py-4">
                  <span className="text-sm text-text-tertiary">
                    {row.freeBad ? "❌ " : ""}
                    {row.free}
                  </span>
                </div>
                <div className="border-l border-border bg-brand-tint/50 px-5 py-4">
                  <span className="text-sm font-medium text-text-primary">✅ {row.capsignal}</span>
                </div>
              </div>
            ))}
          </div>

          <RevealStagger className="divide-y divide-border border border-border md:hidden">
            {openvcComparison.rows.map((row) => (
              <div key={row.feature} className="reveal-stagger-item bg-brand-tint/30 px-4 py-4">
                <p className="text-sm font-medium text-text-primary">{row.feature}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">✅ {row.capsignal}</p>
                <p className="mt-1 text-xs text-text-tertiary">❌ {row.free}</p>
              </div>
            ))}
          </RevealStagger>
        </Reveal>

        <Reveal delay={200} className="mt-10 flex flex-col items-start gap-4 border border-border bg-surface-elevated p-5 pb-safe md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-lg">
            <p className="font-mono text-[10px] uppercase tracking-wider text-brand">{selfServePricing.trialLabel}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Build your raise profile, preview your matches, and try the full platform free for{" "}
              {selfServePricing.trialDays} days. Cancel anytime before the trial ends.
            </p>
          </div>
          <Button
            variant="primary"
            href="/start#apply"
            className="min-h-[48px] w-full shrink-0 bg-brand border-brand hover:bg-brand/90 md:w-auto"
          >
            Build your raise profile
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
