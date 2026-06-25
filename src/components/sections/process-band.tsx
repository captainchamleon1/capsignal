import { workflow } from "@/lib/content/home";
import { SectionLabel } from "@/components/ui/section-label";
import { Container } from "@/components/ui/container";
import { Reveal, RevealStagger, DrawLine } from "@/components/ui/reveal";

export function ProcessBand() {
  return (
    <section className="py-(--spacing-section-sm)">
      <Container>
        <Reveal>
          <SectionLabel index="—" title="Process" />
          <h2 className="display-serif mt-5 max-w-lg text-balance text-2xl font-semibold text-text-primary md:text-3xl">
            From raise profile to weekly iteration
          </h2>
        </Reveal>

        <div className="relative mt-12">
          <DrawLine className="pointer-events-none absolute top-[11px] hidden h-px lg:left-[12.5%] lg:right-[12.5%] lg:block" />

          <RevealStagger
            stagger={110}
            direction="scale"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {workflow.map((step) => (
              <div key={step.step} className="reveal-stagger-item relative">
                <span className="relative z-10 inline-flex h-6 w-6 items-center justify-center border border-border bg-surface-page font-mono text-[10px] tabular-nums text-text-secondary">
                  {step.step.padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[15px] font-medium text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.65] text-text-secondary">{step.body}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </Container>
    </section>
  );
}
