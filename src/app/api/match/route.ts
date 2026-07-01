import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreInvestorsForRaise } from "@/lib/data/scoring/engine";
import { getDemoMatches } from "@/lib/data/demo-investors";
import { buildMatchRationale } from "@/lib/data/scoring/match-rationale";
import { industryKeyToLabel } from "@/lib/content/industries";
import { formatCheckSize, formatFundSize } from "@/lib/format";
import {
  INVESTOR_DATABASE_SIZE,
  PREVIEW_TOP_COUNT,
  resolveDisplayMatchCount,
} from "@/lib/match-display";
import { db } from "@/lib/db";

const schema = z.object({
  stage: z.enum(["pre_seed", "seed", "series_a", "series_b"]),
  sector: z.string().min(1),
  company: z.string().optional(),
  city: z.string().optional(),
  raise: z.string().optional(),
  sectorLabel: z.string().optional(),
  query: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

function sectorLabel(sector: string): string {
  return sector.replace(/_/g, " ");
}

function stageLabel(stage: string): string {
  return stage.replace(/_/g, "-");
}

function raiseContextFromBody(body: z.infer<typeof schema>) {
  return {
    stage: body.stage,
    sector: body.sector,
    company: body.company,
    city: body.city,
    raise: body.raise,
    sectorLabel: body.sectorLabel ?? industryKeyToLabel(body.sector),
  };
}

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { stage, sector, company, city, limit = PREVIEW_TOP_COUNT } = body.data;
  const ctx = raiseContextFromBody(body.data);
  const firmCount = await db.investorFirm.count();

  if (firmCount === 0) {
    const demo = getDemoMatches(stage, sector, limit, city);
    const estimatedMatches = resolveDisplayMatchCount(stage, sector, company, undefined, city);
    return NextResponse.json({
      source: "demo",
      databaseSize: INVESTOR_DATABASE_SIZE,
      estimatedMatches,
      previewCount: demo.length,
      topInvestors: demo.map((inv) => ({
        firm: inv.firm,
        partner: inv.partner,
        score: inv.score,
        rationale: buildMatchRationale({
          ...ctx,
          firmName: inv.firm,
          partner: inv.partner,
          hqCity: inv.hqCity,
          checkSizeLabel: inv.checkSize,
          portfolioCompanies: inv.investments,
          variantSeed: inv.firm,
        }),
        fundSize: inv.fundSize,
        checkSize: inv.checkSize,
        investments: inv.investments,
      })),
      searchLabel: `${sectorLabel(sector)} ${stageLabel(stage)} investor`,
    });
  }

  const { matches, qualifiedCount, databaseSize } = await scoreInvestorsForRaise(ctx, limit);
  const estimatedMatches = resolveDisplayMatchCount(stage, sector, company, qualifiedCount, city);

  const firmIds = matches.map((m) => m.firmId);
  const firms = await db.investorFirm.findMany({
    where: { id: { in: firmIds } },
    include: {
      investments: { orderBy: { announcedAt: "desc" }, take: 3 },
    },
  });
  const firmMap = new Map(firms.map((f) => [f.id, f]));

  return NextResponse.json({
    source: "database",
    databaseSize: databaseSize || INVESTOR_DATABASE_SIZE,
    estimatedMatches,
    previewCount: matches.length,
    topInvestors: matches.map((m) => {
      const firm = firmMap.get(m.firmId);
      return {
        firm: m.firmName,
        partner: m.topPartner ?? null,
        score: m.matchScore,
        rationale: m.rationale,
        fundSize: formatFundSize(firm?.aumUsd),
        checkSize: formatCheckSize(firm?.checkMinUsd, firm?.checkMaxUsd),
        investments: firm?.investments.map((i) => i.companyName) ?? [],
      };
    }),
    searchLabel: `${sectorLabel(sector)} ${stageLabel(stage)} investor`,
  });
}
