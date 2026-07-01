"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { authClient } from "@/lib/auth-client";
import { loadRaiseProfile } from "@/lib/raise-profile";
import { industryLabelToKey, stageToKey } from "@/lib/raise-profile";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [company, setCompany] = useState("");
  const [stage, setStage] = useState("seed");
  const [sector, setSector] = useState("b2b_saas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const profile = loadRaiseProfile();
    if (profile?.company) setCompany(profile.company);
    if (profile?.stageKey) setStage(profile.stageKey);
    if (profile?.sectorKey) setSector(profile.sectorKey);
    if (profile?.sector && !profile.sectorKey) {
      const key = industryLabelToKey(profile.sector);
      if (key) setSector(key);
    }
    if (profile?.stage && !profile?.stageKey) {
      const key = stageToKey[profile.stage];
      if (key) setStage(key);
    }

    const saved = sessionStorage.getItem("capsignal_onboarding_company");
    if (saved && !profile?.company) setCompany(saved);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login?next=/onboarding");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, stage, sector }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Setup failed");
      return;
    }

    sessionStorage.removeItem("capsignal_onboarding_company");
    router.push("/dashboard/campaigns/new");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Container className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo href="/" className="justify-center" />
          <h1 className="mt-8 text-xl font-semibold text-text-primary">Set up your workspace</h1>
          <p className="mt-2 text-sm text-text-secondary">
            One last step to unlock your investor pipeline
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface-elevated p-6">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div>
            <label className="text-xs font-medium text-text-secondary">Company</label>
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            >
              <option value="pre_seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series_a">Series A</option>
              <option value="series_b">Series B</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            >
              <option value="b2b_saas">B2B SaaS</option>
              <option value="fintech">Fintech</option>
              <option value="healthtech">Healthtech</option>
              <option value="climate">Climate</option>
              <option value="deep_tech">Deep tech</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Scoring matches…" : "Continue to dashboard"}
          </Button>
        </form>
      </Container>
    </div>
  );
}
