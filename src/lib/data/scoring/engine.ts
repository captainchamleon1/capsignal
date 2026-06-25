import type { MatchResult, RaiseContext } from "@/lib/data/types";
import { db } from "@/lib/db";

const STAGE_ORDER = ["pre_seed", "seed", "series_a", "series_b"];

function parseJsonArray(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function stageFit(firmStages: string[], targetStage: string): number | null {
  if (firmStages.length === 0) return null;
  if (firmStages.includes(targetStage)) return 100;
  const fi = STAGE_ORDER.indexOf(targetStage);
  if (fi < 0) return 50;
  let best = 0;
  for (const s of firmStages) {
    const si = STAGE_ORDER.indexOf(s);
    if (si < 0) continue;
    const dist = Math.abs(si - fi);
    best = Math.max(best, 100 - dist * 30);
  }
  return best;
}

function sectorFit(firmSectors: string[], targetSector: string): number | null {
  if (firmSectors.length === 0) return null;
  if (firmSectors.includes(targetSector)) return 100;
  const related: Record<string, string[]> = {
    b2b_saas: ["fintech", "deep_tech"],
    fintech: ["b2b_saas"],
    healthtech: ["deep_tech"],
    climate: ["deep_tech", "b2b_saas"],
    deep_tech: ["b2b_saas", "healthtech"],
    consumer: ["b2b_saas"],
  };
  const rel = related[targetSector] ?? [];
  if (firmSectors.some((s) => rel.includes(s))) return 65;
  return 20;
}

function checkSizeFit(
  checkMin?: number | null,
  checkMax?: number | null,
  targetMin?: number,
  targetMax?: number,
): number | null {
  if (!checkMin || !checkMax) return null;
  const raiseMin = targetMin ?? 500_000;
  const raiseMax = targetMax ?? 5_000_000;
  const overlap = Math.min(checkMax, raiseMax) - Math.max(checkMin, raiseMin);
  if (overlap > 0) return 100;
  const gap =
    checkMin > raiseMax
      ? checkMin - raiseMax
      : raiseMin > checkMax
        ? raiseMin - checkMax
        : 0;
  return Math.max(0, 100 - (gap / raiseMax) * 100);
}

function weightedScore(parts: { score: number; weight: number }[]): number {
  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  if (totalWeight === 0) return 0;
  return Math.round(parts.reduce((sum, p) => sum + p.score * p.weight, 0) / totalWeight);
}

export async function scoreInvestorsForRaise(
  context: RaiseContext,
  limit = 50,
): Promise<MatchResult[]> {
  const firms = await db.investorFirm.findMany({
    include: {
      signals: { orderBy: { observedAt: "desc" }, take: 8 },
      people: { where: { isPartner: true, isActive: true }, take: 1 },
      investments: {
        where: context.sector ? { companySector: context.sector } : undefined,
        orderBy: { announcedAt: "desc" },
        take: 3,
      },
    },
    orderBy: { dataQuality: "desc" },
    take: 5000,
  });

  const results: MatchResult[] = [];

  for (const firm of firms) {
    const stages = parseJsonArray(firm.stages);
    const sectors = parseJsonArray(firm.sectors);

    const stageScore = stageFit(stages, context.stage);
    const sectorScore = sectorFit(sectors, context.sector);
    const checkScore = checkSizeFit(
      firm.checkMinUsd,
      firm.checkMaxUsd,
      context.checkSizeMin,
      context.checkSizeMax,
    );

    const signalMap = new Map(firm.signals.map((s) => [s.signalType, s]));
    const deploySignal = signalMap.get("deployment_velocity");
    const partnerSignal = signalMap.get("partner_activity");
    const fundSignal = signalMap.get("fund_timing");

    const scoreParts: { score: number; weight: number }[] = [];
    if (stageScore !== null) scoreParts.push({ score: stageScore, weight: 0.3 });
    if (sectorScore !== null) scoreParts.push({ score: sectorScore, weight: 0.3 });
    if (checkScore !== null) scoreParts.push({ score: checkScore, weight: 0.15 });
    if (deploySignal) scoreParts.push({ score: deploySignal.score, weight: 0.15 });
    if (partnerSignal) scoreParts.push({ score: partnerSignal.score, weight: 0.05 });
    if (fundSignal) scoreParts.push({ score: fundSignal.score, weight: 0.05 });

    if (scoreParts.length === 0) continue;

    const matchScore = weightedScore(scoreParts);

    const rationaleParts: string[] = [];
    if (stageScore !== null && stageScore >= 80) {
      rationaleParts.push(`Source data lists ${context.stage.replace("_", "-")} stage`);
    }
    if (sectorScore !== null && sectorScore >= 80) {
      rationaleParts.push(`Source data lists ${context.sector.replace("_", " ")} focus`);
    } else if (sectorScore !== null && sectorScore >= 60) {
      rationaleParts.push("Adjacent sector in source data");
    }
    if (checkScore !== null && checkScore >= 80) {
      rationaleParts.push("Check size fits your raise (from source data)");
    }
    if (deploySignal && deploySignal.score >= 60) rationaleParts.push(deploySignal.rationale);
    if (firm.investments.length > 0) {
      rationaleParts.push(
        `Recorded investments: ${firm.investments.map((i) => i.companyName).join(", ")}`,
      );
    }
    if (rationaleParts.length === 0) {
      rationaleParts.push("Limited public thesis data — verify fit before outreach");
    }

    const signals: MatchResult["signals"] = [];
    if (stageScore !== null) {
      signals.push({ type: "stage", score: stageScore, rationale: `Stage fit ${stageScore}%` });
    }
    if (sectorScore !== null) {
      signals.push({ type: "sector", score: sectorScore, rationale: `Sector fit ${sectorScore}%` });
    }
    if (checkScore !== null) {
      signals.push({
        type: "check_size",
        score: checkScore,
        rationale: `Check size fit ${checkScore}%`,
      });
    }
    if (deploySignal) {
      signals.push({
        type: "deployment",
        score: deploySignal.score,
        rationale: deploySignal.rationale,
      });
    }

    results.push({
      firmId: firm.id,
      firmName: firm.name,
      matchScore,
      rationale: rationaleParts.join(". ") + ".",
      signals,
      topPartner: firm.people[0]?.name,
    });
  }

  return results
    .filter((r) => r.matchScore >= 35)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export async function buildCampaignShortlist(
  campaignId: string,
  context: RaiseContext,
  limit = 100,
) {
  const matches = await scoreInvestorsForRaise(context, limit);

  for (const match of matches) {
    await db.campaignInvestor.upsert({
      where: {
        campaignId_firmId: { campaignId, firmId: match.firmId },
      },
      create: {
        campaignId,
        firmId: match.firmId,
        matchScore: match.matchScore,
        rationale: match.rationale,
        status: "shortlisted",
      },
      update: {
        matchScore: match.matchScore,
        rationale: match.rationale,
      },
    });
  }

  return matches;
}
