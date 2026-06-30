import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseSessionEvents } from "@/lib/visitor-sessions/store";

export const metadata: Metadata = {
  title: "Session · Admin",
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
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function AdminVisitorDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await db.visitorSession.findUnique({ where: { sessionId } });
  if (!session) notFound();

  const events = parseSessionEvents(session.events);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link href="/admin/visitors" className="text-sm text-text-secondary hover:text-text-primary">
          ← All visitors
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-text-primary">{session.summary}</h1>
        <p className="mt-1 font-mono text-xs text-text-tertiary">{session.sessionId}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Ended", formatWhen(session.endedAt)],
          ["Duration", formatDuration(session.durationMs)],
          ["Landing", session.landingPath],
          ["Referrer", session.referrer ?? "Direct"],
          ["Google Ads", session.isGoogleAds ? "Yes" : "No"],
          ["Step reached", session.maxStep > 0 ? `${session.maxStep}/6` : "None"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface-elevated p-4">
            <p className="text-xs text-text-tertiary">{label}</p>
            <p className="mt-1 text-sm text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {(session.leadEmail || session.leadCompany) && (
        <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">Contact captured</p>
          <p className="mt-2 text-sm text-text-primary">
            {session.leadName}
            {session.leadCompany ? ` · ${session.leadCompany}` : ""}
          </p>
          {session.leadEmail ? (
            <a href={`mailto:${session.leadEmail}`} className="mt-1 block text-sm text-text-secondary hover:text-text-primary">
              {session.leadEmail}
            </a>
          ) : null}
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-text-primary">Event timeline</h2>
        <ol className="mt-4 space-y-2 rounded-lg border border-border bg-surface-elevated p-4">
          {events.map((event, i) => (
            <li key={`${event.ts}-${i}`} className="border-b border-border pb-2 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-xs text-text-tertiary">
                  {new Date(event.ts).toLocaleTimeString("en-US", { hour12: false })}
                </span>
                <span className="text-sm font-medium text-text-primary">{event.name}</span>
              </div>
              {event.params && Object.keys(event.params).length > 0 ? (
                <pre className="mt-1 overflow-x-auto text-xs text-text-tertiary">
                  {JSON.stringify(event.params, null, 2)}
                </pre>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {session.userAgent ? (
        <p className="text-xs text-text-tertiary">{session.userAgent}</p>
      ) : null}
    </div>
  );
}
