import { raiseMovement } from "@/lib/content/raise-movement";
import { Container } from "@/components/ui/container";
import { BookCallForm } from "@/components/book-call/book-call-form";
import { TextLink } from "@/components/ui/text-link";

export default function BookACallView() {
  return (
    <section className="py-(--spacing-section)">
      <Container narrow>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
          {raiseMovement.bookCall.duration}
        </p>
        <h1 className="display-serif mt-4 text-balance text-3xl font-semibold text-text-primary md:text-4xl">
          {raiseMovement.bookCall.title}
        </h1>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-text-secondary">
          {raiseMovement.bookCall.subtitle}
        </p>

        <div className="mt-10 border border-border bg-surface-elevated p-6 md:p-8">
          <BookCallForm />
        </div>

        <p className="mt-8 text-center text-sm text-text-tertiary">
          Prefer self-serve?{" "}
          <TextLink href="/start#apply" className="text-text-secondary">
            Build your raise profile
          </TextLink>
        </p>
      </Container>
    </section>
  );
}
