import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Investor" };

type Props = { params: Promise<{ id: string }> };

function parseJson(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export default async function InvestorDetailPage({ params }: Props) {
  const { id } = await params;
  const firm = await db.investorFirm.findUnique({
    where: { id },
    include: {
      people: true,
      investments: { orderBy: { announcedAt: "desc" } },
      signals: { orderBy: { observedAt: "desc" }, take: 8 },
      funds: true,
    },
  });

  if (!firm) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/dashboard/investors" className="text-sm text-text-tertiary hover:text-text-secondary">
          ← Investors
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-text-primary">{firm.name}</h1>
        <p className="mt-2 text-sm text-text-secondary">{firm.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-text-tertiary">Check size</p>
          <p className="mt-1 font-mono text-sm">
            {firm.checkMinUsd && firm.checkMaxUsd
              ? `$${firm.checkMinUsd.toLocaleString()} – $${firm.checkMaxUsd.toLocaleString()}`
              : "Unknown"}
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-text-tertiary">Stages</p>
          <p className="mt-1 text-sm">{parseJson(firm.stages).join(", ")}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-text-tertiary">Data quality</p>
          <p className="mt-1 font-mono text-sm">{firm.dataQuality}/100</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Signals</h2>
        <ul className="mt-3 space-y-2">
          {firm.signals.map((s) => (
            <li key={s.id} className="rounded-lg border border-border px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{s.signalType.replace(/_/g, " ")}</span>
                <span className="font-mono">{s.score.toFixed(0)}</span>
              </div>
              <p className="mt-1 text-text-secondary">{s.rationale}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Partners</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
          {firm.people.map((p) => (
            <li key={p.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{p.name}</span>
              <span className="text-text-tertiary">{p.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent investments</h2>
        <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
          {firm.investments.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-text-tertiary">No investments on record</li>
          ) : (
            firm.investments.map((inv) => (
              <li key={inv.id} className="flex justify-between px-4 py-3 text-sm">
                <span>{inv.companyName}</span>
                <span className="text-text-tertiary">
                  {inv.companySector} · {inv.companyStage}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
