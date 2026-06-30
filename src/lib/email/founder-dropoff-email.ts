import type { DropOffLead } from "@/lib/analytics/dropoff";

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://getcapsignal.com";
}

function founderCallOffer(): string {
  const callUrl = process.env.FOUNDER_CALL_URL?.trim();
  if (callUrl) {
    return `If it's easier, grab time on my calendar here: ${callUrl}`;
  }
  return "If it's easier, I'm happy to hop on a quick call. Just reply with a time that works and we'll find 15 minutes.";
}

function resumeUrl(lead: DropOffLead & { resumeToken?: string }): string {
  if (lead.kind === "submitted") {
    return `${siteUrl()}/start/plan`;
  }
  const base = `${siteUrl()}/start`;
  return lead.resumeToken ? `${base}?resume=${encodeURIComponent(lead.resumeToken)}` : base;
}

function resumeLabel(lead: DropOffLead): string {
  return lead.kind === "submitted" ? "View your plan and matches →" : "Pick up where you left off →";
}

function contextLine(lead: DropOffLead): string {
  if (lead.kind === "submitted") {
    const parts = [lead.sector, lead.stage, lead.raise].filter(Boolean);
    if (lead.company && lead.company !== "your company") {
      return parts.length > 0
        ? ` I saw you built your raise profile for ${lead.company}${lead.city ? ` (${lead.city})` : ""} (${parts.join(" · ")}) and checked out your investor matches, but didn't end up subscribing.`
        : ` I saw you built your raise profile for ${lead.company} and checked out your investor matches, but didn't end up subscribing.`;
    }
    return " I saw you completed your raise profile and checked out your investor matches, but didn't end up subscribing.";
  }

  if (lead.company && lead.company !== "your company") {
    const parts = [lead.sector, lead.stage, lead.raise].filter(Boolean);
    if (parts.length > 0) {
      return ` I noticed you started a profile for ${lead.company}${lead.city ? ` (${lead.city})` : ""} (${parts.join(" · ")}).`;
    }
    return ` I noticed you started a profile for ${lead.company}.`;
  }
  return " I noticed you started building your raise profile on CapSignal.";
}

function dropOffQuestion(lead: DropOffLead): string {
  if (lead.kind === "submitted") {
    return "No pressure at all, but I'd genuinely love to know: what prevented you from moving forward with the platform?";
  }
  return "No pressure at all, but I'd genuinely love to know: what prevented you from moving forward?";
}

export function founderFromEmail(): string {
  return process.env.FOUNDER_FROM_EMAIL ?? "Christian Myers <hello@getcapsignal.com>";
}

export function buildFounderDropOffEmail(lead: DropOffLead & { resumeToken?: string }) {
  const greeting = firstName(lead.name);
  const link = resumeUrl(lead);
  const linkLabel = resumeLabel(lead);
  const callOffer = founderCallOffer();
  const companyLabel =
    lead.company && lead.company !== "your company" ? lead.company : "your raise";

  const subject =
    lead.kind === "submitted"
      ? `Still thinking it over? (${companyLabel})`
      : `What held you back? (${companyLabel})`;

  const text = [
    `Hi ${greeting},`,
    "",
    `I'm Christian, founder of CapSignal.${contextLine(lead)}`,
    "",
    "We're still early and building this with founders like you, so honest feedback really helps us improve.",
    "",
    dropOffQuestion(lead),
    "",
    "Even a one-line reply is hugely helpful.",
    "",
    callOffer,
    "",
    linkLabel.replace(" →", ":"),
    link,
    "",
    "Thanks for taking a look.",
    "",
    "Christian",
    "Founder, CapSignal",
    "hello@getcapsignal.com",
  ].join("\n");

  const callHtml = process.env.FOUNDER_CALL_URL?.trim()
    ? `<p>If it's easier, <a href="${escapeHtml(process.env.FOUNDER_CALL_URL)}" style="color:#111">grab time on my calendar →</a></p>`
    : `<p>If it's easier, I'm happy to hop on a quick call. Just reply with a time that works and we'll find 15 minutes.</p>`;

  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;color:#111;max-width:560px;line-height:1.6">
<p>Hi ${escapeHtml(greeting)},</p>
<p>I'm Christian, founder of CapSignal.${escapeHtml(contextLine(lead))}</p>
<p>We're still early and building this with founders like you, so honest feedback really helps us improve.</p>
<p><strong>No pressure at all</strong>, but I'd genuinely love to know: <em>${escapeHtml(dropOffQuestion(lead).replace("No pressure at all, but I'd genuinely love to know: ", ""))}</em></p>
<p>Even a one-line reply is hugely helpful.</p>
${callHtml}
<p><a href="${escapeHtml(link)}" style="color:#111">${escapeHtml(linkLabel)}</a></p>
<p>Thanks for taking a look.</p>
<p>Christian<br>Founder, CapSignal<br><a href="mailto:hello@getcapsignal.com">hello@getcapsignal.com</a></p>
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
