import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreInvestorsForRaise } from "@/lib/data/scoring/engine";
import { db } from "@/lib/db";

const schema = z.object({
  stage: z.enum(["pre_seed", "seed", "series_a", "series_b"]),
  sector: z.string().min(1),
  company: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const firmCount = await db.investorFirm.count();
  if (firmCount === 0) {
    return NextResponse.json({
      source: "empty",
      totalMatches: 0,
      topInvestors: [],
    });
  }

  const { stage, sector, limit = 25 } = body.data;
  const matches = await scoreInvestorsForRaise({ stage, sector }, limit);

  return NextResponse.json({
    source: "database",
    totalMatches: matches.length,
    topInvestors: matches.map((m) => ({
      firm: m.firmName,
      partner: m.topPartner ?? null,
      score: m.matchScore,
      rationale: m.rationale,
    })),
  });
}
