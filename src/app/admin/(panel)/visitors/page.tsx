import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Visitors · Admin",
  robots: { index: false, follow: false },
};

function formatDuration(ms: number) {
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

function formatWhen(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminVisitorsPage() {
  const sessions = await db.visitorSession.findMany({
    orderBy: { endedAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Visitor sessions</h1>
        <p className="mt-1 text-sm text-text-secondary">{sessions.length} recent sessions</p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-text-tertiary">
          No sessions stored yet. They are saved when visitors leave a page after deploy.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface-elevated">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-surface-muted text-xs text-text-tertiary">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Summary</th>
                <th className="px-4 py-3 font-medium">Landing</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s) => (
                <tr key={s.id} className="text-text-secondary">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-text-tertiary">
                    {formatWhen(s.endedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/visitors/${s.sessionId}`}
                      className="font-medium text-text-primary hover:underline"
                    >
                      {s.summary}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{s.landingPath}</td>
                  <td className="px-4 py-3 font-mono text-xs">{formatDuration(s.durationMs)}</td>
                  <td className="px-4 py-3 text-xs">
                    {s.leadEmail ? (
                      <a href={`mailto:${s.leadEmail}`} className="hover:text-text-primary">
                        {s.leadName ?? s.leadEmail}
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {s.isGoogleAds ? "Google Ads" : "Organic"}
                    {s.utmSource ? ` · ${s.utmSource}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
