import type { Metadata } from "next";
import { db } from "@/lib/db";
import { DataIngestForm } from "@/components/app/data-ingest-form";

export const metadata: Metadata = { title: "Data pipeline" };

export default async function DataPipelinePage() {
  const sources = await db.dataSource.findMany({ orderBy: { priority: "desc" } });
  const recentJobs = await db.ingestJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { source: true },
  });

  const [firms, investments, signals] = await Promise.all([
    db.investorFirm.count(),
    db.investment.count(),
    db.signal.count(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Data pipeline</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ingest → enrich → score → feedback. Your investor graph is the moat.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-5">
          <p className="font-mono text-2xl">{firms}</p>
          <p className="text-xs text-text-tertiary">Investor firms</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="font-mono text-2xl">{investments}</p>
          <p className="text-xs text-text-tertiary">Portfolio investments</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="font-mono text-2xl">{signals}</p>
          <p className="text-xs text-text-tertiary">Active signals</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Data sources</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
          {sources.map((s) => (
            <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-text-tertiary">{s.description}</p>
              </div>
              <div className="text-right text-xs text-text-tertiary">
                <p>Priority {s.priority}</p>
                <p>{s.lastSyncAt ? `Last sync ${s.lastSyncAt.toLocaleDateString()}` : "Never synced"}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <DataIngestForm />

      <section>
        <h2 className="text-lg font-semibold">Recent ingest jobs</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border text-sm">
          {recentJobs.length === 0 ? (
            <li className="px-4 py-6 text-center text-text-tertiary">No jobs yet — run seed or ingest</li>
          ) : (
            recentJobs.map((j) => (
              <li key={j.id} className="flex justify-between px-4 py-3">
                <span>{j.source.name}</span>
                <span className="text-text-tertiary">
                  {j.status} · {j.recordsNew} new · {j.recordsUpdated} updated
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
