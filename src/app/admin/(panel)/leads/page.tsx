import type { Metadata } from "next";
import { TestLeadBadge } from "@/components/admin/test-lead-badge";
import { isLikelyTestLead } from "@/lib/admin";
import { db } from "@/lib/db";
import { parseWizardData } from "@/lib/wizard/progress-store";

export const metadata: Metadata = {
  title: "Leads · Admin",
  robots: { index: false, follow: false },
};

function formatWhen(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage() {
  const [leads, partials] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    db.wizardProgress.findMany({
      where: { submittedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
  ]);

  const realLeads = leads.filter((l) => !isLikelyTestLead(l.email, l.company));
  const realPartials = partials.filter((p) => !isLikelyTestLead(p.email));

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Leads</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {realLeads.length} submitted · {realPartials.length} partial profiles
          {leads.length > realLeads.length ? ` · ${leads.length - realLeads.length} test hidden from counts` : ""}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">Submitted</h2>
        {leads.length === 0 ? (
          <p className="mt-4 text-sm text-text-tertiary">
            No submitted leads yet. Run{" "}
            <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">npm run admin:import-resend</code>{" "}
            to backfill from Resend.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface-elevated">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-surface-muted text-xs text-text-tertiary">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Sector</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead) => {
                  const isTest = isLikelyTestLead(lead.email, lead.company);
                  return (
                  <tr key={lead.id} className={`text-text-secondary ${isTest ? "opacity-60" : ""}`}>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-text-tertiary">
                      {formatWhen(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {lead.name}
                      {isTest ? <TestLeadBadge /> : null}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="hover:text-text-primary">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">{lead.company}</td>
                    <td className="px-4 py-3">{lead.stage ?? ""}</td>
                    <td className="px-4 py-3">{lead.sector ?? ""}</td>
                    <td className="px-4 py-3 text-xs">{lead.source ?? ""}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">Partial (not submitted)</h2>
        {partials.length === 0 ? (
          <p className="mt-4 text-sm text-text-tertiary">No partial profiles saved yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface-elevated">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-surface-muted text-xs text-text-tertiary">
                <tr>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Step</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {partials.map((row) => {
                  const data = parseWizardData(row.data);
                  const isTest = isLikelyTestLead(row.email);
                  return (
                    <tr key={row.id} className={`text-text-secondary ${isTest ? "opacity-60" : ""}`}>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-text-tertiary">
                        {formatWhen(row.updatedAt)}
                      </td>
                      <td className="px-4 py-3">{row.step}/6</td>
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {data?.name ?? row.email}
                        {isTest ? <TestLeadBadge /> : null}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${row.email}`} className="hover:text-text-primary">
                          {row.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">{data?.company ?? ""}</td>
                      <td className="px-4 py-3 text-xs">
                        {row.earlyAlertSentAt ? "Early alert sent" : ""}
                        {row.earlyAlertSentAt && row.dropoffEmailSentAt ? " · " : ""}
                        {row.dropoffEmailSentAt ? "Drop-off sent" : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
