import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Public sample of real investor firms for marketing UI previews. */
export async function GET() {
  const total = await db.investorFirm.count();
  if (total === 0) {
    return NextResponse.json({ total: 0, firms: [] });
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
