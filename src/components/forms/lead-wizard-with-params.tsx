"use client";

import { Suspense } from "react";
import { LeadWizard } from "@/components/forms/lead-wizard";

type Props = {
  source?: string;
  id?: string;
};

export function LeadWizardWithParams(props: Props) {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-text-tertiary">Loading form…</div>}>
      <LeadWizard {...props} />
    </Suspense>
  );
}
