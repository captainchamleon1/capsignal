import type { SessionReport } from "./session-log";
import type { SessionWizardSnapshot } from "./wizard-snapshot";

export type DropOffKind = "partial" | "submitted";

export type DropOffLead = {
  kind: DropOffKind;
  name: string;
  email: string;
  company: string;
  step: number;
  stage?: string;
  sector?: string;
  raise?: string;
  city?: string;
  resumeToken?: string;
};

function hasEvent(report: SessionReport, name: string) {
  return report.events.some((e) => e.name === name);
}

function maxFunnelStep(report: SessionReport): number {
  return report.events
    .filter((e) => e.name === "funnel_step_view")
    .reduce((max, e) => Math.max(max, Number(e.params?.step) || 0), 0);
}

function lastPagePath(report: SessionReport): string | undefined {
  const views = report.events.filter((e) => e.name === "page_view");
  const last = views[views.length - 1];
  return last?.params?.page_path ? String(last.params.page_path) : undefined;
}

function secondsSinceLastEvent(report: SessionReport, eventName: string): number | null {
  const event = [...report.events].reverse().find((e) => e.name === eventName);
  if (!event) return null;
  const ended = new Date(report.endedAt).getTime();
  const ts = new Date(event.ts).getTime();
  return Math.max(0, (ended - ts) / 1000);
}

function displayNameFromSnapshot(snapshot: SessionWizardSnapshot): string {
  const name = snapshot.name?.trim();
  if (name) return name;
  const local = snapshot.email.trim().split("@")[0]?.replace(/[._+-]/g, " ").trim();
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "Founder";
}

function leadFromSnapshot(snapshot: SessionWizardSnapshot | null | undefined): DropOffLead | null {
  if (!snapshot?.email?.trim()) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email.trim())) return null;

  return {
    kind: "partial",
    name: displayNameFromSnapshot(snapshot),
    email: snapshot.email.trim().toLowerCase(),
    company: snapshot.company?.trim() || "your company",
    step: snapshot.step,
    stage: snapshot.stage,
    sector: snapshot.sector,
    raise: snapshot.raise,
    city: snapshot.city,
    resumeToken: snapshot.resumeToken,
  };
}

function leadFromGenerateEvent(report: SessionReport): DropOffLead | null {
  const event = report.events.find((e) => e.name === "generate_lead");
  if (!event?.params) return null;

  const name = String(event.params.lead_name ?? "").trim();
  const email = String(event.params.lead_email ?? "").trim().toLowerCase();
  const company = String(event.params.lead_company ?? "").trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  return {
    kind: "submitted",
    name,
    email,
    company: company || "your company",
    step: 6,
    stage: String(event.params.lead_stage ?? ""),
    sector: String(event.params.lead_sector ?? ""),
  };
}

function hasPaid(report: SessionReport): boolean {
  return hasEvent(report, "checkout_success") || hasEvent(report, "trial_start");
}

export function detectDropOffLead(
  report: SessionReport,
  snapshot?: SessionWizardSnapshot | null,
): DropOffLead | null {
  if (hasPaid(report)) return null;

  const submitted = hasEvent(report, "generate_lead");

  if (submitted) {
    const sinceLead = secondsSinceLastEvent(report, "generate_lead");
    // Ignore the /start → /start/plan redirect flush right after submit.
    if (sinceLead != null && sinceLead < 20 && lastPagePath(report) === "/start") {
      return null;
    }

    const lead = leadFromGenerateEvent(report) ?? leadFromSnapshot(snapshot);
    if (!lead) return null;

    return { ...lead, kind: "submitted", resumeToken: snapshot?.resumeToken ?? lead.resumeToken };
  }

  const step = Math.max(maxFunnelStep(report), snapshot?.step ?? 0);
  if (step < 1) return null;

  const partial = leadFromSnapshot(snapshot);
  if (!partial) return null;

  const completedStep1 =
    report.events.some(
      (e) => e.name === "funnel_step_complete" && Number(e.params?.step) >= 1,
    ) || step >= 2;

  const emailCaptured =
    Boolean(snapshot?.email?.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email.trim());

  if (!completedStep1 && !emailCaptured) return null;

  return { ...partial, kind: "partial", step: Math.max(step, 1) };
}
