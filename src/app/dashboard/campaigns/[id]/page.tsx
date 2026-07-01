import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { CampaignPipeline } from "@/components/app/campaign-pipeline";

export const metadata: Metadata = { title: "Campaign" };

type Props = { params: Promise<{ id: string }> };

export default async function CampaignDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) return null;
  const org = await getUserOrganization(session.user.id);
  if (!org) return null;

  const { id } = await params;
  const campaign = await db.campaign.findFirst({
    where: { id, organizationId: org.id },
    include: {
      raiseProfile: true,
      investors: {
        orderBy: { matchScore: "desc" },
        include: {
          firm: true,
          person: true,
        },
      },
    },
  });

  if (!campaign) notFound();

  const statusCounts = campaign.investors.reduce(
    (acc, ci) => {
      acc[ci.status] = (acc[ci.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <Link href="/dashboard/campaigns" className="text-sm text-text-tertiary hover:text-text-secondary">
          ← Campaigns
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-text-primary">{campaign.name}</h1>
        <p className="mt-1 text-sm capitalize text-text-secondary">
          {campaign.raiseProfile?.stage?.replace("_", " ")} · {campaign.raiseProfile?.sector?.replace("_", " ")} · {campaign.status}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Matched", key: "shortlisted" },
          { label: "Contacted", key: "contacted" },
          { label: "Replied", key: "replied" },
          { label: "Meetings", key: "meeting" },
        ].map((s) => (
          <div key={s.key} className="rounded-lg border border-border p-4">
            <p className="font-mono text-xl">{statusCounts[s.key] ?? 0}</p>
            <p className="text-xs text-text-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      <CampaignPipeline
        campaignId={campaign.id}
        investors={campaign.investors.map((ci) => ({
          id: ci.id,
          firmId: ci.firmId,
          firmName: ci.firm.name,
          partner: ci.person?.name,
          matchScore: ci.matchScore,
          rationale: ci.rationale,
          status: ci.status,
        }))}
      />
    </div>
  );
}
