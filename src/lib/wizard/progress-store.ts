import { db } from "@/lib/db";
import type { WizardProgressData, WizardProgressPayload } from "./types";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function parseWizardData(raw: string): WizardProgressData | null {
  try {
    return JSON.parse(raw) as WizardProgressData;
  } catch {
    return null;
  }
}

export async function getWizardProgressByToken(token: string) {
  return db.wizardProgress.findUnique({ where: { resumeToken: token } });
}

export async function getWizardProgressByEmail(email: string) {
  return db.wizardProgress.findUnique({ where: { email: normalizeEmail(email) } });
}

export async function upsertWizardProgress(payload: WizardProgressPayload) {
  const email = normalizeEmail(payload.data.email);
  const dataJson = JSON.stringify(payload.data);

  return db.wizardProgress.upsert({
    where: { email },
    create: {
      email,
      step: payload.step,
      data: dataJson,
      source: payload.source,
      utmSource: payload.utm_source,
      utmMedium: payload.utm_medium,
      utmCampaign: payload.utm_campaign,
      utmTerm: payload.utm_term,
      utmContent: payload.utm_content,
    },
    update: {
      step: payload.step,
      data: dataJson,
      source: payload.source ?? undefined,
      utmSource: payload.utm_source,
      utmMedium: payload.utm_medium,
      utmCampaign: payload.utm_campaign,
      utmTerm: payload.utm_term,
      utmContent: payload.utm_content,
    },
  });
}

export async function markEarlyAlertSent(email: string) {
  return db.wizardProgress.update({
    where: { email: normalizeEmail(email) },
    data: { earlyAlertSentAt: new Date() },
  });
}

export async function markDropoffEmailSent(email: string) {
  return db.wizardProgress.update({
    where: { email: normalizeEmail(email) },
    data: { dropoffEmailSentAt: new Date() },
  });
}

export async function markWizardSubmitted(email: string) {
  return db.wizardProgress.updateMany({
    where: { email: normalizeEmail(email) },
    data: { submittedAt: new Date() },
  });
}

export function wizardProgressToSnapshot(
  record: { step: number; data: string; resumeToken: string },
): { step: number; data: WizardProgressData; resumeToken: string } | null {
  const data = parseWizardData(record.data);
  if (!data) return null;
  return { step: record.step, data, resumeToken: record.resumeToken };
}
