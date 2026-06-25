import { NextResponse } from "next/server";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrganization(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const { id } = await params;

  const campaign = await db.campaign.findFirst({
    where: { id, organizationId: org.id },
    include: {
      raiseProfile: true,
      investors: {
        orderBy: { matchScore: "desc" },
        include: {
          firm: { include: { people: { where: { isPartner: true }, take: 1 } } },
          events: { orderBy: { occurredAt: "desc" }, take: 3 },
          meetings: { orderBy: { scheduledAt: "asc" } },
        },
      },
    },
  });

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ campaign });
}
