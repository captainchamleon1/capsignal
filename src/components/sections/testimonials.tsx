import { testimonials } from "@/lib/content/home";
import { Container } from "@/components/ui/container";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-border bg-surface-muted py-(--spacing-section)">
      <Container>
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
          From recent raises
        </h2>
      </Container>
    </section>
  );
}
