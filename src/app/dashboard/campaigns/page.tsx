import type { Metadata } from "next";
import Link from "next/link";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Campaigns" };

export default async function CampaignsPage() {
  const session = await getSession();
  if (!session) return null;
  const org = await getUserOrganization(session.user.id);
  if (!org) return null;

  const campaigns = await db.campaign.findMany({
    where: { organizationId: org.id },
    orderBy: { updatedAt: "desc" },
    include: {
      raiseProfile: true,
      _count: { select: { investors: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Campaigns</h1>
          <p className="mt-1 text-sm text-text-secondary">Outreach campaigns and investor pipelines</p>
        </div>
        <Button variant="primary" href="/dashboard/campaigns/new">
          New campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-text-secondary">No campaigns yet</p>
          <Button variant="primary" href="/dashboard/campaigns/new" className="mt-4">
            Create your first campaign
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface-elevated">
          {campaigns.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/campaigns/${c.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-surface-muted"
              >
                <div>
                  <p className="font-medium text-text-primary">{c.name}</p>
                  <p className="text-xs text-text-tertiary capitalize">
                    {c.raiseProfile?.stage?.replace("_", " ")} · {c.raiseProfile?.sector?.replace("_", " ")} · {c.status}
                  </p>
                </div>
                <span className="font-mono text-sm text-text-secondary">{c._count.investors} investors</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
