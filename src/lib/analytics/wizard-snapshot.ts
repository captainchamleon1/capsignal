import type { WizardProgressData } from "@/lib/wizard/types";

export type WizardSnapshot = {
  step: number;
  resumeToken?: string;
  data: WizardProgressData;
  updatedAt: string;
};

const KEY = "cs_wizard_snapshot";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function saveWizardSnapshot(snapshot: {
  step: number;
  resumeToken?: string;
  data: WizardProgressData;
}) {
  if (typeof window === "undefined") return;
  if (!snapshot.data.email.trim()) return;

  localStorage.setItem(
    KEY,
    JSON.stringify({
      step: snapshot.step,
      resumeToken: snapshot.resumeToken,
      data: snapshot.data,
      updatedAt: new Date().toISOString(),
    } satisfies WizardSnapshot),
  );
}

export function readWizardSnapshot(): WizardSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardSnapshot;
    if (!parsed.data?.email?.trim()) return null;

    const age = Date.now() - new Date(parsed.updatedAt).getTime();
    if (age > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearWizardSnapshot() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/** Compact shape attached to session-end reports for server drop-off detection. */
export type SessionWizardSnapshot = {
  step: number;
  name: string;
  email: string;
  company?: string;
  city?: string;
  sector?: string;
  segment?: string;
  stage?: string;
  raise?: string;
  traction?: string;
  timeline?: string;
  resumeToken?: string;
  updatedAt: string;
};

/** Compact shape for session-end analytics (server drop-off detection). */
export function snapshotForSession(snapshot: WizardSnapshot | null): SessionWizardSnapshot | null {
  if (!snapshot) return null;
  const { data, step } = snapshot;
  return {
    step,
    name: data.name,
    email: data.email,
    company: data.company || undefined,
    city: data.city || undefined,
    sector: data.sector || undefined,
    segment: data.segment || undefined,
    stage: data.stage || undefined,
    raise: data.raise || undefined,
    traction: data.traction || undefined,
    timeline: data.timeline || undefined,
    resumeToken: snapshot.resumeToken,
    updatedAt: snapshot.updatedAt,
  };
}
