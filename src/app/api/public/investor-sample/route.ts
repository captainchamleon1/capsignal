import { NextResponse } from "next/server";
import { getDemoInvestorSample } from "@/lib/data/demo-investors";
import { INVESTOR_DATABASE_SIZE } from "@/lib/match-display";
import { db } from "@/lib/db";

/** Public sample of investor firms for marketing UI previews. */
export async function GET() {
  const total = await db.investorFirm.count();
  if (total === 0) {
    return NextResponse.json({
      source: "demo",
      total: INVESTOR_DATABASE_SIZE,
      firms: getDemoInvestorSample(5),
    });
  }

  const firms = await db.investorFirm.findMany({
    where: { website: { not: null } },
    orderBy: { dataQuality: "desc" },
    take: 5,
    include: {
      people: { where: { isPartner: true, isActive: true }, take: 1 },
    },
  });

  return NextResponse.json({
    source: "database",
    total,
    firms: firms.map((f) => {
      let sectors: string[] = [];
      try {
        sectors = JSON.parse(f.sectors) as string[];
      } catch {
        sectors = [];
      }
      return {
        name: f.name,
        partner: f.people[0]?.name ?? null,
        dataQuality: f.dataQuality,
        sectorLabel: sectors[0]?.replace(/_/g, " ") ?? "—",
      };
    }),
  });
}
