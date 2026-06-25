"use client";

import { useState } from "react";

const SOURCES = [
  { key: "sec_iapd", label: "SEC IAPD (~7k VCs)", description: "Nightly Form ADV bulk feed" },
  { key: "pe_vc_atlas", label: "PE/VC Atlas (~4.4k)", description: "Global PE/VC firms" },
  { key: "hf_investors", label: "HF dataset (~2.5k)", description: "VCs, angels, accelerators" },
] as const;

export function DataIngestForm() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function runIngest(source?: string, bulk = false) {
    setLoading(source ?? "all");
    setResult(null);

    const res = await fetch("/api/data/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceKeys: source ? [source] : undefined,
        bulk,
      }),
    });

    setLoading(null);
    if (!res.ok) {
      setResult("Ingest failed — check server logs");
      return;
    }

    const data = await res.json();
    setResult(JSON.stringify(data.summary, null, 2));
    window.location.reload();
  }

  return (
    <section className="rounded-lg border border-border bg-surface-elevated p-5">
      <h2 className="text-lg font-semibold">Run ingest</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Bulk import merges SEC, Atlas, and HF datasets — typically 12,000–15,000 unique VCs after
        deduplication.
      </p>

      <button
        type="button"
        disabled={!!loading}
        onClick={() => runIngest(undefined, true)}
        className="mt-4 rounded-md bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-page disabled:opacity-50"
      >
        {loading === "all" ? "Importing all sources…" : "Bulk import all VCs"}
      </button>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {SOURCES.map((s) => (
          <button
            key={s.key}
            type="button"
            disabled={!!loading}
            onClick={() => runIngest(s.key, true)}
            className="rounded-md border border-border px-4 py-3 text-left text-sm hover:bg-surface-muted disabled:opacity-50"
          >
            <span className="font-medium text-text-primary">{s.label}</span>
            <span className="mt-0.5 block text-xs text-text-tertiary">{s.description}</span>
          </button>
        ))}
      </div>

      {result && (
        <pre className="mt-4 overflow-x-auto rounded bg-surface-muted p-3 text-xs">{result}</pre>
      )}
    </section>
  );
}
