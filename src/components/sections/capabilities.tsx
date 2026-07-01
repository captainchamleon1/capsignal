import { capabilities } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

function MatchingPreview() {
  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-muted p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        Example layout
      </p>
      {["Firm A", "Firm B", "Firm C"].map((name, i) => (
        <div key={name} className="flex items-center justify-between py-2 text-xs first:pt-2 last:pb-0">
          <span className="text-text-secondary">{name}</span>
          <span className="font-mono tabular-nums text-text-tertiary">—</span>
        </div>
      ))}
      <p className="mt-2 border-t border-border pt-2 text-[10px] text-text-tertiary">
        Scores use your raise profile and source-attributed firm data.
      </p>
    </div>
  );
}

function OutreachPreview() {
  return (
    <div className="mt-6 space-y-2 rounded-lg border border-border bg-surface-muted p-3 text-[11px] leading-relaxed text-text-secondary">
      <p className="text-text-tertiary">To: partner@firm.com</p>
      <p className="text-text-primary">Re: Your company — stage, sector</p>
      <p className="line-clamp-3">
        Personalized copy references portfolio and thesis from source data…
      </p>
    </div>
  );
}

function PipelinePreview() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {[
        { label: "Matched", value: "—" },
        { label: "Contacted", value: "—" },
        { label: "Meetings", value: "—" },
      ].map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-surface-muted p-3 text-center">
          <p className="font-mono text-lg tabular-nums font-semibold text-text-tertiary">{item.value}</p>
          <p className="text-[10px] text-text-tertiary">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

function DataRoomPreview() {
  const docs = ["Pitch deck", "Financial model", "Cap table"];

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface-muted p-3">
      {docs.map((doc) => (
        <div key={doc} className="flex items-center justify-between py-2 text-xs first:pt-0 last:pb-0">
          <span className="text-text-secondary">{doc}</span>
          <span className="font-mono tabular-nums text-text-tertiary">— views</span>
        </div>
      ))}
    </div>
  );
}

const previews = {
  matching: MatchingPreview,
  outreach: OutreachPreview,
  pipeline: PipelinePreview,
  dataroom: DataRoomPreview,
};

export function Capabilities() {
  return (
    <section id="product" className="border-t border-border bg-surface-elevated py-(--spacing-section)">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
            Everything you need to get investors
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Matching, outreach, CRM, and data room work together—so you reach
            the right investors and convert replies into meetings.
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
