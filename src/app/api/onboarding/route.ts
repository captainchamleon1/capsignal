import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-server";
import { ensureUserOrganization } from "@/lib/org";
import { db } from "@/lib/db";
import { buildCampaignShortlist } from "@/lib/data/scoring/engine";

const schema = z.object({
  company: z.string().min(1),
  stage: z.enum(["pre_seed", "seed", "series_a", "series_b"]),
  sector: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { company, stage, sector } = body.data;
  const org = await ensureUserOrganization(session.user.id, company);

  const raiseProfile = await db.raiseProfile.create({
    data: {
      organizationId: org.id,
      stage,
      sector,
      isActive: true,
    },
  });

  const campaign = await db.campaign.create({
    data: {
      organizationId: org.id,
      raiseProfileId: raiseProfile.id,
      name: `${company} — ${stage.replace("_", " ")} raise`,
      status: "draft",
    },
  });

  await buildCampaignShortlist(campaign.id, { stage, sector });

  return NextResponse.json({ organizationId: org.id, campaignId: campaign.id });
}
