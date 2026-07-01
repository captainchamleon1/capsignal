import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { Panel } from "@/components/ui/panel";
import { RequestAccessForm } from "@/components/forms/request-access-form";

export const metadata: Metadata = {
  title: "Request access",
  description: "Submit your raise profile for CapSignal.",
};

export default function RequestAccessPage() {
  return (
    <>
      <PageHeader
        label="Request access"
        title="See your investor matches"
        description="Complete your raise profile — we'll show AI-matched investors, then unlock the full pool within one business day."
      />

      <PageSection size="sm" narrow>
        <Panel className="max-w-xl">
          <RequestAccessForm />
        </Panel>
      </PageSection>
    </>
  );
}
