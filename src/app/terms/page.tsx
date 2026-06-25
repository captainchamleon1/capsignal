import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader label="Legal" title="Terms of Service" />
      <PageSection size="sm">
        <article className="prose-content mx-auto max-w-(--width-reading)">
          <p className="font-mono text-[11px] text-text-tertiary">Last updated: June 2026</p>
          <p>
            By using CapSignal, you agree to these terms. Our service provides
            fundraising infrastructure including investor targeting, outreach sequences,
            and campaign analytics.
          </p>
          <p>
            You retain ownership of your data. CapSignal processes campaign information
            solely to deliver the service. Monthly subscriptions renew automatically
            until cancelled from your account settings.
          </p>
          <p>
            CapSignal does not guarantee fundraising outcomes. Reply rates and meeting
            volumes vary by sector, stage, and market conditions.
          </p>
          <p>
            For questions about these terms, contact{" "}
            <a href="mailto:hello@capsignal.com">hello@capsignal.com</a>.
          </p>
        </article>
      </PageSection>
    </>
  );
}
