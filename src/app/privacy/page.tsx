import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader label="Legal" title="Privacy Policy" />
      <PageSection size="sm">
        <article className="prose-content mx-auto max-w-(--width-reading)">
          <p className="font-mono text-[11px] text-text-tertiary">Last updated: June 2026</p>
          <p>
            CapSignal collects information you provide when requesting access,
            including name, email, company details, and raise information. We use
            this to evaluate fit and deliver our services.
          </p>
          <p>
            Campaign data—including investor contacts, messaging, and analytics—is
            stored encrypted and is not sold to third parties. You may request
            deletion within 30 days of campaign completion.
          </p>
          <p>
            For privacy inquiries, contact{" "}
            <a href="mailto:hello@capsignal.com">hello@capsignal.com</a>.
          </p>
        </article>
      </PageSection>
    </>
  );
}
