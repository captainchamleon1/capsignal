import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";

export const metadata: Metadata = { title: "Investors" };

function parseJson(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export default async function InvestorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sector?: string }>;
}) {
  const { q, sector } = await searchParams;
  const total = await db.investorFirm.count();

  const firms = await db.investorFirm.findMany({
    where: q ? { name: { contains: q } } : undefined,
    include: {
      people: { where: { isPartner: true }, take: 1 },
      investments: { orderBy: { announcedAt: "desc" }, take: 2 },
    },
    orderBy: { dataQuality: "desc" },
    take: 100,
  });

  const filtered = sector
    ? firms.filter((f) => parseJson(f.sectors).includes(sector))
    : firms;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Investor database</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {total.toLocaleString()} firms indexed · scored on deployment, thesis, and check size
        </p>
      </div>

      <form className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search firms…"
          className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm"
        />
        <select
          name="sector"
          defaultValue={sector ?? ""}
          className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm"
        >
          <option value="">All sectors</option>
          <option value="b2b_saas">B2B SaaS</option>
          <option value="fintech">Fintech</option>
          <option value="healthtech">Healthtech</option>
          <option value="climate">Climate</option>
          <option value="deep_tech">Deep tech</option>
        </select>
        <button type="submit" className="rounded-md bg-text-primary px-4 py-2 text-sm text-surface-page">
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-muted text-left text-xs text-text-tertiary">
            <tr>
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Check size</th>
              <th className="px-4 py-3 font-medium">Stages</th>
              <th className="px-4 py-3 font-medium">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-elevated">
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-surface-muted">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/investors/${f.id}`} className="font-medium text-text-primary hover:underline">
                    {f.name}
                  </Link>
                  <p className="text-xs text-text-tertiary">
                    {f.people[0]?.name ?? "—"} · {f.hqCity ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                  {f.checkMinUsd && f.checkMaxUsd
                    ? `$${(f.checkMinUsd / 1e6).toFixed(1)}–${(f.checkMaxUsd / 1e6).toFixed(1)}M`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">
                  {parseJson(f.stages).join(", ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{f.dataQuality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
