"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trackFunnelMilestone } from "@/lib/analytics";
import { logServerMilestone } from "@/lib/analytics/log-server-milestone";
import { loadRaiseProfile } from "@/lib/raise-profile";
import { PlanGateView } from "@/components/checkout/plan-gate-view";

export function PlanGateClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<ReturnType<typeof loadRaiseProfile>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = loadRaiseProfile();
    if (!saved?.email || !saved?.company) {
      router.replace("/start#apply");
      return;
    }
    setProfile(saved);
    setReady(true);
    trackFunnelMilestone("plan_view", {
      company: saved.company,
      matchCount: saved.matchCount,
    });
    logServerMilestone("plan_view", {
      pagePath: "/start/plan",
      leadEmail: saved.email,
      leadName: saved.name,
      leadCompany: saved.company,
      params: { matchCount: saved.matchCount },
    });
  }, [router]);

  if (!ready || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
        <p className="text-sm text-text-tertiary">Loading your raise profile…</p>
      </div>
    );
  }

  return <PlanGateView profile={profile} />;
}
