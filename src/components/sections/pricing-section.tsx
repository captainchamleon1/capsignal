import { Container } from "@/components/ui/container";
import { PricingCards } from "@/components/ui/pricing-cards";
import { FaqList } from "@/components/ui/faq-list";
import { pricingFaqs } from "@/lib/content/pricing";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-(--spacing-section)">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary md:text-3xl">
              Pricing
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              From $49.99/mo. No per-seat fees.
            </p>
          </div>
          <Link href="/pricing" className="shrink-0 text-sm text-text-secondary hover:text-text-primary">
            Full comparison →
          </Link>
        </div>

        <div className="mt-12">
          <PricingCards compact />
        </div>

        <div className="mt-16 max-w-2xl">
          <FaqList items={pricingFaqs.slice(0, 3)} />
        </div>
      </Container>
    </section>
  );
}
