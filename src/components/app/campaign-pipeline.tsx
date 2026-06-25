"use client";

const STATUSES = [
  "shortlisted",
  "excluded",
  "contacted",
  "replied",
  "meeting",
  "diligence",
  "passed",
  "committed",
] as const;

type Investor = {
  id: string;
  firmId: string;
  firmName: string;
  partner?: string | null;
  matchScore: number | null;
  rationale: string | null;
  status: string;
};

export function CampaignPipeline({
  campaignId,
  investors,
}: {
  campaignId: string;
  investors: Investor[];
}) {
  async function updateStatus(id: string, status: string) {
    await fetch(`/api/campaigns/${campaignId}/investors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-text-primary">Investor pipeline</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-muted text-left text-xs text-text-tertiary">
            <tr>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Investor</th>
              <th className="px-4 py-3">Rationale</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface-elevated">
            {investors.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3 font-mono font-medium tabular-nums">
                  {inv.matchScore?.toFixed(0) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/dashboard/investors/${inv.firmId}`}
                    className="font-medium text-text-primary hover:underline"
                  >
                    {inv.firmName}
                  </a>
                  {inv.partner && (
                    <p className="text-xs text-text-tertiary">{inv.partner}</p>
                  )}
                </td>
                <td className="max-w-xs px-4 py-3 text-xs text-text-secondary">
                  {inv.rationale}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={inv.status}
                    onChange={(e) => updateStatus(inv.id, e.target.value)}
                    className="rounded border border-border bg-surface-page px-2 py-1 text-xs capitalize"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
