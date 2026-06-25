import { capabilities } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

function MatchingPreview() {
  const rows = [
    { name: "Horizon Capital", score: 94 },
    { name: "Northwind Ventures", score: 91 },
    { name: "Basecamp Fund", score: 87 },
  ];

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-muted p-3">
      {rows.map((row) => (
        <div key={row.name} className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0">
          <span className="text-text-secondary">{row.name}</span>
          <span className="font-mono tabular-nums text-text-primary">{row.score}</span>
        </div>
      ))}
    </div>
  );
}

function OutreachPreview() {
  return (
    <div className="mt-6 space-y-2 rounded-lg border border-border bg-surface-muted p-3 text-[11px] leading-relaxed text-text-secondary">
      <p className="text-text-tertiary">To: m.reeves@horizon.vc</p>
      <p className="text-text-primary">Re: Meridian — B2B infra, $2.5M seed</p>
      <p className="line-clamp-3">
        Hi Mark — saw Horizon&apos;s follow-on in RelayDB last month. We&apos;re building
        the orchestration layer for…
      </p>
    </div>
  );
}

function PipelinePreview() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {[
        { label: "Sent", value: "186" },
        { label: "Replied", value: "24" },
        { label: "Meetings", value: "41" },
      ].map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface-muted p-3 text-center">
          <p className="font-mono text-lg tabular-nums font-semibold text-text-primary">{item.value}</p>
          <p className="text-[10px] text-text-tertiary">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const previews = {
  matching: MatchingPreview,
  outreach: OutreachPreview,
  pipeline: PipelinePreview,
};

export function Capabilities() {
  return (
    <section id="product" className="border-t border-border bg-surface-elevated py-(--spacing-section)">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
            Three systems, one raise
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Matching, outreach, and pipeline management share the same data
            layer—so targeting improves as replies come in.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {capabilities.map((cap) => {
            const Preview = previews[cap.id as keyof typeof previews];
            return (
              <article
                key={cap.id}
                className={cn(
                  "rounded-xl border border-border bg-surface-page p-6 md:p-8",
                  cap.span === "large" && "md:col-span-2 md:grid md:grid-cols-2 md:gap-8",
                )}
              >
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-text-primary">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {cap.description}
                  </p>
                </div>
                {Preview && (
                  <div className={cap.span === "large" ? "" : ""}>
                    <Preview />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
