"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [stage, setStage] = useState("seed");
  const [sector, setSector] = useState("b2b_saas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, stage, sector }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Failed to create campaign");
      return;
    }

    const data = await res.json();
    router.push(`/dashboard/campaigns/${data.campaign.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">New campaign</h1>
        <p className="mt-1 text-sm text-text-secondary">
          We&apos;ll score investors deploying in your space with AI matching
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface-elevated p-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-xs font-medium text-text-secondary">Campaign name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Q2 Seed raise"
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
          {loading ? "Scoring matches…" : "Create & score investors"}
        </Button>
      </form>
    </div>
  );
}
