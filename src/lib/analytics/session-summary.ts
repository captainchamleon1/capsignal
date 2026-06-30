import type { SessionReport } from "./session-log";

export function maxFunnelStep(events: SessionReport["events"]): number {
  return events
    .filter((e) => e.name === "funnel_step_view")
    .reduce((max, e) => Math.max(max, Number(e.params?.step) || 0), 0);
}

export function sessionSummaryFromEvents(events: SessionReport["events"]): string {
  const milestones = events
    .filter((e) => e.name === "funnel_milestone" || e.name === "generate_lead")
    .map((e) => String(e.params?.milestone ?? e.name));

  const maxStep = maxFunnelStep(events);

  if (milestones.includes("trial_start")) return "Started trial";
  if (milestones.includes("checkout_success")) return "Completed checkout";
  if (milestones.includes("checkout_start")) return "Started checkout";
  if (milestones.includes("checkout_view")) return "Viewed checkout";
  if (milestones.includes("plan_view")) return "Viewed plan";
  if (milestones.includes("match_preview_open")) return "Saw investor matches";
  if (milestones.includes("generate_lead")) return "Submitted lead";
  if (maxStep >= 1) return `Onboarding step ${maxStep}/6`;
  return "Browsing only";
}

export function sessionSummary(report: SessionReport): string {
  return sessionSummaryFromEvents(report.events);
}
