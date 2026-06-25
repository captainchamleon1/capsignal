import type { Metadata } from "next";
import Link from "next/link";
import { getSession, getUserOrganization } from "@/lib/auth-server";
import { getOrgStats } from "@/lib/org";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const org = await getUserOrganization(session.user.id);
  if (!org) return null;

  const stats = await getOrgStats(org.id);
  const recentCampaigns = await db.campaign.findMany({
    where: { organizationId: org.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      _count: { select: { investors: true } },
    },
  });

  const topInvestors = await db.campaignInvestor.findMany({
    where: { campaign: { organizationId: org.id } },
    orderBy: { matchScore: "desc" },
    take: 5,
    include: { firm: true },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Overview</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Welcome back, {session.user.name.split(" ")[0]}
          </p>
        </div>
        <Button variant="primary" href="/dashboard/campaigns/new">
          New campaign
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Investor database", value: stats.firmCount.toLocaleString() },
          { label: "Campaigns", value: stats.campaigns },
          { label: "Pipeline investors", value: stats.pipelineInvestors },
          { label: "Upcoming meetings", value: stats.upcomingMeetings },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface-elevated p-5">
            <p className="font-mono text-2xl font-medium tabular-nums text-text-primary">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Campaigns</h2>
          <Link href="/dashboard/campaigns" className="text-sm text-text-secondary hover:text-text-primary">
            View all →
          </Link>
        </div>
        {recentCampaigns.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-text-secondary">No campaigns yet.</p>
            <Button variant="primary" href="/dashboard/campaigns/new" className="mt-4">
              Start your first campaign
            </Button>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface-elevated">
            {recentCampaigns.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/campaigns/${c.id}`}
                  className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface-muted"
                >
                  <div>
                    <p className="font-medium text-text-primary">{c.name}</p>
                    <p className="text-xs text-text-tertiary capitalize">{c.status}</p>
                  </div>
                  <span className="font-mono text-sm text-text-secondary">
                    {c._count.investors} investors
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {topInvestors.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary">Top matches</h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface-elevated">
            {topInvestors.map((ci) => (
              <li key={ci.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-text-primary">{ci.firm.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-text-tertiary">{ci.rationale}</p>
                </div>
                <span className="font-mono text-sm font-medium tabular-nums text-text-primary">
                  {ci.matchScore?.toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
