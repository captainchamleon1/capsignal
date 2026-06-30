import type { LeadPayload } from "@/lib/leads/types";

export type LeadForEmail = Pick<LeadPayload, "name" | "email" | "company" | "stage" | "sector" | "raise">;

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com";
}

export function buildLeadFollowUpEmail(lead: LeadForEmail) {
  const greeting = firstName(lead.name);
  const planUrl = `${siteUrl()}/start/plan`;
  const roundParts = [lead.stage, lead.sector].filter(Boolean).join(" · ");
  const roundLine = roundParts
    ? ` Based on ${lead.company}'s ${roundParts} profile${lead.raise ? ` (${lead.raise})` : ""}, your matches are ready.`
    : ` Your investor matches for ${lead.company} are ready.`;

  const subject = `Your investor shortlist for ${lead.company}`;

  const text = [
    `Hi ${greeting},`,
    "",
    `Thanks for building your raise profile with CapSignal.${roundLine}`,
    "",
    "Unlock your shortlist and start outreach:",
    planUrl,
    "",
    "CapSignal gives you scored investor matches, intro-ready outreach, and a pipeline to run your round without cold-blasting hundreds of firms.",
    "",
    "Questions? Reply to this email. We read every message.",
    "",
    "The CapSignal team",
    "hello@getcapsignal.com",
  ].join("\n");

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px;line-height:1.5">
<p>Hi ${escapeHtml(greeting)},</p>
<p>Thanks for building your raise profile with CapSignal.${escapeHtml(roundLine)}</p>
<p><strong>Unlock your shortlist and start outreach:</strong></p>
<p><a href="${escapeHtml(planUrl)}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">View your plan →</a></p>
<p style="color:#555">CapSignal gives you scored investor matches, intro-ready outreach, and a pipeline to run your round without cold-blasting hundreds of firms.</p>
<p style="color:#555">Questions? Reply to this email. We read every message.</p>
<p>The CapSignal team<br><a href="mailto:hello@getcapsignal.com">hello@getcapsignal.com</a></p>
</body></html>`;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
