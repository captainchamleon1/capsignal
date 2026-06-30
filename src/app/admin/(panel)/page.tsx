import type { Metadata } from "next";
import Link from "next/link";
import { TestLeadBadge } from "@/components/admin/test-lead-badge";
import { isLikelyTestLead } from "@/lib/admin";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function formatWhen(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminOverviewPage() {
  const [leads, partials, sessions, sessionCount, googleAdsSessions] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.wizardProgress.findMany({
      where: { submittedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    db.visitorSession.findMany({ orderBy: { endedAt: "desc" }, take: 10 }),
    db.visitorSession.count(),
    db.visitorSession.count({ where: { isGoogleAds: true } }),
  ]);

  const realLeads = leads.filter((l) => !isLikelyTestLead(l.email, l.company));
  const realPartials = partials.filter((p) => !isLikelyTestLead(p.email));
  const testLeadCount = leads.length - realLeads.length;
  const testPartialCount = partials.length - realPartials.length;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Admin overview</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Leads, partial onboarding, and visitor sessions
          {testLeadCount + testPartialCount > 0 ? (
            <span className="text-text-tertiary">
              {" "}
              · {testLeadCount + testPartialCount} test record
              {testLeadCount + testPartialCount === 1 ? "" : "s"} hidden
            </span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Submitted leads", value: realLeads.length },
          { label: "Partial profiles", value: realPartials.length },
          { label: "Visitor sessions", value: sessionCount },
          { label: "Google Ads sessions", value: googleAdsSessions },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface-elevated p-5">
            <p className="font-mono text-2xl font-medium tabular-nums text-text-primary">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm text-text-secondary hover:text-text-primary">
              View all →
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-text-tertiary">
              No leads in the database yet. Run{" "}
              <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">npm run admin:import-resend</code>{" "}
              to backfill from Resend, or submit a raise profile on /start.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface-elevated">
              {leads.slice(0, 8).map((lead) => {
                const isTest = isLikelyTestLead(lead.email, lead.company);
                return (
                <li key={lead.id} className={`px-5 py-4 ${isTest ? "opacity-60" : ""}`}>
                  <p className="font-medium text-text-primary">
                    {lead.name}
                    {isTest ? <TestLeadBadge /> : null}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {lead.company}
                    {lead.stage ? ` · ${lead.stage}` : ""}
                    {lead.sector ? ` · ${lead.sector}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-text-tertiary">
                    <a href={`mailto:${lead.email}`} className="hover:text-text-secondary">
                      {lead.email}
                    </a>
                    {" · "}
                    {formatWhen(lead.createdAt)}
                  </p>
                </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent visitors</h2>
            <Link href="/admin/visitors" className="text-sm text-text-secondary hover:text-text-primary">
              View all →
            </Link>
          </div>
          {sessions.length === 0 ? (
            <p className="mt-4 text-sm text-text-tertiary">
              No visitor sessions yet. Run{" "}
              <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">npm run admin:import-resend</code>{" "}
              to backfill from Resend, or browse the site locally and leave a page.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface-elevated">
              {sessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/admin/visitors/${s.sessionId}`}
                    className="block px-5 py-4 transition-colors hover:bg-surface-muted"
                  >
                    <p className="font-medium text-text-primary">{s.summary}</p>
                    <p className="text-sm text-text-secondary">
                      {s.landingPath}
                      {s.leadEmail ? ` · ${s.leadEmail}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {formatWhen(s.endedAt)}
                      {s.isGoogleAds ? " · Google Ads" : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
