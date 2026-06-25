import { signalLayers, workflow } from "@/lib/constants";
import { Container } from "@/components/ui/container";

export function Platform() {
  return (
    <section id="platform" className="py-(--spacing-section)">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
              Signal layers behind every score
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Investor rankings combine four data layers refreshed daily. Each
              match includes a written rationale—not a black-box percentage.
            </p>

            <div className="mt-10 space-y-0">
              {workflow.map((step, i) => (
                <div key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < workflow.length - 1 && (
                    <span className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-border" />
                  )}
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated font-mono text-xs text-text-secondary">
                    {step.step}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-sm font-semibold text-text-primary">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {signalLayers.map((layer) => (
              <div
                key={layer.title}
                className="rounded-xl border border-border bg-surface-elevated p-5"
              >
                <h3 className="text-sm font-semibold text-text-primary">{layer.title}</h3>
                <ul className="mt-3 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="text-sm text-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
