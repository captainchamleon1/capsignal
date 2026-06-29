import { guarantee, selfServePricing } from "@/lib/content/guarantee";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function GuaranteeBanner() {
  return (
    <section className="border-y border-brand/20 bg-brand-tint">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-2 py-6 text-center md:py-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
              {guarantee.title}
            </p>
            <p className="text-sm font-medium text-text-primary md:text-base">
              {guarantee.body}
            </p>
            <p className="text-xs text-text-tertiary">
              {selfServePricing.trialLabel} · then {selfServePricing.priceFull}/mo · Cancel anytime ·{" "}
              {guarantee.email}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
