import type { Metadata } from "next";
import { PlanGateView } from "@/components/checkout/plan-gate-view";
import { previewRaiseProfile } from "@/lib/preview/raise-profile-sample";

export const metadata: Metadata = {
  title: "Plan page preview",
  description: "Internal preview of the post-onboarding plan offer page.",
  robots: { index: false, follow: false },
};

export default function PreviewPlanPage() {
  return (
    <PlanGateView
      profile={previewRaiseProfile}
      preview
      checkoutHref="/preview/checkout"
    />
  );
}
