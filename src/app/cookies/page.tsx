import type { Metadata } from "next";
import { cookiePolicy } from "@/lib/content/legal";
import { LegalDocument } from "@/components/legal/legal-document";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: cookiePolicy.description,
};

export default function CookiesPage() {
  return (
    <>
      <PageHeader label="Legal" title={cookiePolicy.title} description={cookiePolicy.description} />
      <PageSection size="sm">
        <LegalDocument document={cookiePolicy} />
      </PageSection>
    </>
  );
}
