import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string; investorId: string }> };

const schema = z.object({
  status: z.enum([
    "shortlisted",
    "excluded",
    "contacted",
    "replied",
    "meeting",
    "diligence",
    "passed",
    "committed",
  ]),
  notes: z.string().optional(),
});

export async function PATCH(request: Request, { params }: Props) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrganization(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const { id: campaignId, investorId } = await params;
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const campaign = await db.campaign.findFirst({
    where: { id: campaignId, organizationId: org.id },
  });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const investor = await db.campaignInvestor.findFirst({
    where: { id: investorId, campaignId },
  });
  if (!investor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.campaignInvestor.update({
    where: { id: investorId },
    data: {
      status: body.data.status,
      notes: body.data.notes,
      excludedAt: body.data.status === "excluded" ? new Date() : null,
    },
  });

  return NextResponse.json({ investor: updated });
}
