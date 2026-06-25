import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TextLink } from "@/components/ui/text-link";

const dataSources = [
  {
    name: "SEC IAPD (Form ADV)",
    detail: "Nightly bulk feed of SEC-registered investment advisers and private-fund flags.",
    license: "Public domain (SEC)",
  },
  {
    name: "PE/VC Atlas",
    detail: "Global PE and VC firm directory with websites and descriptions.",
    license: "CC BY 4.0 (Imergea)",
  },
  {
    name: "Startup investor dataset",
    detail: "VCs, angels, and accelerators with sector and stage fields where provided.",
    license: "MIT (Hugging Face)",
  },
];

export function Proof() {
  return (
    <section className="bg-surface-dark py-(--spacing-section) text-text-on-dark">
      <Container>
        <Reveal direction="up">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-on-dark-muted">
              Data foundation
            </p>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
              Real investor records from public and open datasets
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-on-dark-muted">
              Every firm in the database is attributed to a source. We do not fabricate partners,
              portfolio companies, check sizes, or reply-rate benchmarks. Case studies and
              performance metrics are published only from verified customer campaigns.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border border-surface-dark-border bg-surface-dark-border md:grid-cols-3">
          {dataSources.map((source) => (
            <div key={source.name} className="bg-surface-dark p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-wider text-brand-gold">
                {source.license}
              </p>
              <h3 className="mt-3 text-lg font-medium text-text-on-dark">{source.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-on-dark-muted">{source.detail}</p>
            </div>
          ))}
        </div>

        <Reveal delay={120} className="mt-10 flex flex-wrap items-center gap-4">
          <TextLink href="/platform" className="text-text-on-dark-muted hover:text-text-on-dark">
            How the data pipeline works →
          </TextLink>
          <TextLink href="/dashboard" className="text-text-on-dark-muted hover:text-text-on-dark">
            View in dashboard →
          </TextLink>
        </Reveal>
      </Container>
    </section>
  );
}
