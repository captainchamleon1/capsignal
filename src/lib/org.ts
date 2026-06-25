import { db } from "@/lib/db";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function ensureUserOrganization(userId: string, companyName: string) {
  const existing = await db.organizationMember.findFirst({
    where: { userId },
    include: { organization: true },
  });
  if (existing) return existing.organization;

  const base = slugify(companyName) || `org-${userId.slice(0, 8)}`;
  let slug = base;
  let i = 1;
  while (await db.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  const org = await db.organization.create({
    data: {
      name: companyName,
      slug,
      members: { create: { userId, role: "owner" } },
      dataRooms: { create: { name: "Diligence" } },
    },
  });

  return org;
}

export async function getOrgStats(organizationId: string) {
  const [campaigns, investors, meetings] = await Promise.all([
    db.campaign.count({ where: { organizationId } }),
    db.campaignInvestor.count({
      where: { campaign: { organizationId } },
    }),
    db.meeting.count({
      where: {
        campaignInvestor: { campaign: { organizationId } },
        status: "scheduled",
      },
    }),
  ]);

  const firmCount = await db.investorFirm.count();

  return { campaigns, pipelineInvestors: investors, upcomingMeetings: meetings, firmCount };
}
