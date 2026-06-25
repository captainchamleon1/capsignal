import { db } from "@/lib/db";

export async function computeFirmSignals(firmId: string) {
  const firm = await db.investorFirm.findUnique({
    where: { id: firmId },
    include: {
      investments: { orderBy: { announcedAt: "desc" }, take: 10 },
      funds: true,
      people: { where: { isPartner: true, isActive: true } },
    },
  });

  if (!firm) return;

  const now = Date.now();
  const signals: { signalType: string; score: number; rationale: string; metadata?: object }[] = [];

  // Deployment velocity — recent investments in last 12 months
  const recentInv = firm.investments.filter((inv) => {
    if (!inv.announcedAt) return false;
    return now - inv.announcedAt.getTime() < 365 * 24 * 60 * 60 * 1000;
  });
  const deployScore = Math.min(100, recentInv.length * 25);
  signals.push({
    signalType: "deployment_velocity",
    score: deployScore,
    rationale:
      recentInv.length > 0
        ? `${recentInv.length} portfolio investment(s) in the last 12 months`
        : "No recent portfolio activity on record",
    metadata: { recentCount: recentInv.length },
  });

  // Partner activity
  const partnerScore = Math.min(100, firm.people.length * 35);
  signals.push({
    signalType: "partner_activity",
    score: partnerScore,
    rationale:
      firm.people.length > 0
        ? `${firm.people.length} active partner(s) on record`
        : "Partner roster not yet enriched",
    metadata: { partnerCount: firm.people.length },
  });

  // Fund timing — active fund status
  const activeFund = firm.funds.find((f) => f.status === "active" || f.status === "raising");
  signals.push({
    signalType: "fund_timing",
    score: activeFund ? 85 : firm.funds.length ? 50 : 40,
    rationale: activeFund
      ? `Active fund: ${activeFund.name}`
      : firm.funds.length
        ? "Fund on record; deployment status unclear"
        : "Fund vintage data pending enrichment",
  });

  // Data quality as confidence signal
  signals.push({
    signalType: "data_confidence",
    score: firm.dataQuality,
    rationale: `Profile ${firm.dataQuality}% complete across check size, partners, and investments`,
  });

  // Replace stale signals (keep last 7 days per type)
  const cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
  await db.signal.deleteMany({
    where: { firmId, observedAt: { lt: cutoff } },
  });

  for (const s of signals) {
    await db.signal.create({
      data: {
        firmId,
        signalType: s.signalType,
        score: s.score,
        rationale: s.rationale,
        metadata: s.metadata ? JSON.stringify(s.metadata) : null,
      },
    });
  }
}
