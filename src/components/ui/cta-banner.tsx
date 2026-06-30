import { siteConfig } from "@/lib/content/site";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";

type CtaBannerProps = {
  title?: string;
  description?: string;
};

export function CtaBanner({
  title = "Your raise, simplified",
  description = "Build a raise profile in minutes — or book 15 minutes and we'll walk you through it.",
}: CtaBannerProps) {
  return (
    <section className="hairline-y bg-surface-page py-(--spacing-section-sm)">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
              Get started
            </p>
            <h2 className="display-serif mt-4 text-2xl font-semibold text-text-primary md:text-[1.75rem]">
              {title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{description}</p>
          </div>
          <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-4">
            <Button variant="primary" href="/start#apply">
              Get started
            </Button>
            <Button variant="secondary" href="/book-a-call">
              Book a call
            </Button>
            <TextLink href={`mailto:${siteConfig.email}`} className="break-safe text-text-tertiary">
              {siteConfig.email}
            </TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
