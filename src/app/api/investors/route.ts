import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const sector = searchParams.get("sector");
  const stage = searchParams.get("stage");
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));

  const firms = await db.investorFirm.findMany({
    where: q
      ? { name: { contains: q } }
      : undefined,
    include: {
      people: { where: { isPartner: true }, take: 2 },
      investments: { orderBy: { announcedAt: "desc" }, take: 3 },
      signals: { orderBy: { observedAt: "desc" }, take: 4 },
      _count: { select: { investments: true } },
    },
    orderBy: { dataQuality: "desc" },
    take: limit,
  });

  const filtered = firms.filter((f) => {
    if (sector) {
      try {
        const sectors = JSON.parse(f.sectors) as string[];
        if (!sectors.includes(sector)) return false;
      } catch {
        return false;
      }
    }
    if (stage) {
      try {
        const stages = JSON.parse(f.stages) as string[];
        if (!stages.includes(stage)) return false;
      } catch {
        return false;
      }
    }
    return true;
  });

  return NextResponse.json({
    total: await db.investorFirm.count(),
    investors: filtered.map((f) => ({
      id: f.id,
      name: f.name,
      firmType: f.firmType,
      hqCity: f.hqCity,
      checkMinUsd: f.checkMinUsd,
      checkMaxUsd: f.checkMaxUsd,
      stages: JSON.parse(f.stages),
      sectors: JSON.parse(f.sectors),
      dataQuality: f.dataQuality,
      partners: f.people,
      recentInvestments: f.investments,
      signals: f.signals,
      investmentCount: f._count.investments,
    })),
  });
}
