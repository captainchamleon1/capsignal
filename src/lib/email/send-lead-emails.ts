import { buildEarlyLeadAlertEmail } from "./early-lead-email";
import { buildLeadFollowUpEmail } from "./lead-follow-up-email";
import { buildLeadNotificationEmail, type LeadNotification } from "./lead-notification-email";
import { leadFromEmail, leadNotifyRecipients, leadReplyToEmail, sendResendEmail } from "./resend-send";
import type { EarlyLeadAlert } from "./early-lead-email";

export async function sendLeadNotificationEmail(lead: LeadNotification, apiKey: string) {
  const { subject, text, html } = buildLeadNotificationEmail(lead);

  return sendResendEmail(apiKey, {
    from: leadFromEmail(),
    to: leadNotifyRecipients(),
    reply_to: lead.email,
    subject,
    text,
    html,
  });
}

export async function sendEarlyLeadAlertEmail(lead: EarlyLeadAlert, apiKey: string) {
  const { subject, text, html } = buildEarlyLeadAlertEmail(lead);

  return sendResendEmail(apiKey, {
    from: leadFromEmail(),
    to: leadNotifyRecipients(),
    reply_to: lead.email,
    subject,
    text,
    html,
  });
}

export async function sendLeadFollowUpEmail(
  lead: Pick<LeadNotification, "name" | "email" | "company" | "stage" | "sector" | "raise">,
  apiKey: string,
) {
  const { subject, text, html } = buildLeadFollowUpEmail(lead);

  return sendResendEmail(apiKey, {
    from: leadFromEmail(),
    to: [lead.email],
    reply_to: leadReplyToEmail(),
    subject,
    text,
    html,
  });
}
