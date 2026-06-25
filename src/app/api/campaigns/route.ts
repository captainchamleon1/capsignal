import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { buildCampaignShortlist } from "@/lib/data/scoring/engine";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrganization(session.user.id);
  if (!org) return NextResponse.json({ campaigns: [] });

  const campaigns = await db.campaign.findMany({
    where: { organizationId: org.id },
    orderBy: { updatedAt: "desc" },
    include: {
      raiseProfile: true,
      _count: { select: { investors: true } },
    },
  });

  return NextResponse.json({ campaigns });
}

const createSchema = z.object({
  name: z.string().min(1),
  stage: z.enum(["pre_seed", "seed", "series_a", "series_b"]),
  sector: z.string().min(1),
  targetRaiseUsd: z.number().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrganization(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = createSchema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { name, stage, sector, targetRaiseUsd } = body.data;

  const raiseProfile = await db.raiseProfile.create({
    data: { organizationId: org.id, stage, sector, targetRaiseUsd, isActive: true },
  });

  const campaign = await db.campaign.create({
    data: {
      organizationId: org.id,
      raiseProfileId: raiseProfile.id,
      name,
      status: "draft",
    },
  });

  const matches = await buildCampaignShortlist(campaign.id, { stage, sector });

  return NextResponse.json({ campaign, matchCount: matches.length });
}
