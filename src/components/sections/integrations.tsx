import { integrations } from "@/lib/content/home";
import { Container } from "@/components/ui/container";

export function Integrations() {
  return (
    <section className="border-t border-border bg-surface-muted py-12">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-wider text-text-tertiary">
          Works with your stack
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {integrations.map((name) => (
            <span key={name} className="text-sm font-medium text-text-secondary">
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
