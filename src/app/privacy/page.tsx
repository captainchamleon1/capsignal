import type { Metadata } from "next";
import { privacyPolicy } from "@/lib/content/legal";
import { LegalDocument } from "@/components/legal/legal-document";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyPolicy.description,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader label="Legal" title={privacyPolicy.title} description={privacyPolicy.description} />
      <PageSection size="sm">
        <LegalDocument document={privacyPolicy} />
      </PageSection>
    </>
  );
}
