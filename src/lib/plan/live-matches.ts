import type { MatchPreviewInvestor } from "@/lib/leads/match-types";
import type { RaiseProfileDraft } from "@/lib/raise-profile";
import { industryLabelToKey, stageToKey } from "@/lib/raise-profile";
import { PREVIEW_TOP_COUNT } from "@/lib/match-display";

type ApiInvestor = {
  firm: string;
  partner: string | null;
  score: number;
  rationale: string;
  fundSize?: string;
  checkSize?: string;
  investments?: string[];
};

export function mapApiInvestorsToPreview(
  investors: ApiInvestor[],
  unblurredCount = 1,
): MatchPreviewInvestor[] {
  return investors.map((inv, i) => ({
    firm: inv.firm,
    partner: inv.partner,
    score: inv.score,
    reason: inv.rationale,
    fundSize: inv.fundSize,
    checkSize: inv.checkSize,
    investments: inv.investments,
    blurred: i >= unblurredCount,
  }));
}

export async function fetchLiveMatchesForProfile(profile: RaiseProfileDraft) {
  const stage = profile.stageKey ?? stageToKey[profile.stage] ?? "seed";
  const sector = profile.sectorKey ?? industryLabelToKey(profile.sector);

  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stage,
      sector,
      company: profile.company,
      city: profile.city?.trim(),
      raise: profile.raise?.trim(),
      sectorLabel: profile.sector,
      limit: PREVIEW_TOP_COUNT,
    }),
  });

  if (!res.ok) return null;

  const api = (await res.json()) as {
    estimatedMatches?: number;
    topInvestors?: ApiInvestor[];
  };

  if (!api.topInvestors?.length) return null;

  return {
    matchCount: api.estimatedMatches ?? api.topInvestors.length,
    topInvestors: mapApiInvestorsToPreview(api.topInvestors, 1),
  };
}
