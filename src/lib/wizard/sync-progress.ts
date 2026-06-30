import { getStoredUtm } from "@/lib/analytics/utm";
import {
  readWizardSnapshot,
  saveWizardSnapshot,
  type WizardSnapshot,
} from "@/lib/analytics/wizard-snapshot";
import type { WizardProgressData, WizardProgressResponse } from "@/lib/wizard/types";

type SyncOptions = {
  step: number;
  data: WizardProgressData;
  source?: string;
  triggerEarlyAlert?: boolean;
  /** Save valid email immediately (before step 1 complete) for drop-off recovery. */
  earlyCapture?: boolean;
};

export async function loadWizardProgress(resumeToken?: string | null): Promise<{
  step: number;
  data: WizardProgressData;
  resumeToken?: string;
  restored: boolean;
} | null> {
  if (resumeToken) {
    try {
      const res = await fetch(`/api/wizard/progress?resume=${encodeURIComponent(resumeToken)}`);
      if (res.ok) {
        const json = (await res.json()) as WizardProgressResponse;
        saveWizardSnapshot({
          step: json.step,
          resumeToken: json.resumeToken,
          data: json.data,
        });
        return {
          step: json.step,
          data: json.data,
          resumeToken: json.resumeToken,
          restored: true,
        };
      }
    } catch {
      // fall through to local snapshot
    }
  }

  const local = readWizardSnapshot();
  if (!local) return null;

  return {
    step: local.step,
    data: local.data,
    resumeToken: local.resumeToken,
    restored: true,
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function syncWizardProgress(options: SyncOptions): Promise<string | undefined> {
  const { step, data, source, triggerEarlyAlert, earlyCapture } = options;

  if (!isValidEmail(data.email)) return readWizardSnapshot()?.resumeToken;

  saveWizardSnapshot({
    step,
    data,
    resumeToken: readWizardSnapshot()?.resumeToken,
  });

  try {
    const res = await fetch("/api/wizard/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        step,
        data,
        source,
        triggerEarlyAlert: triggerEarlyAlert ?? (earlyCapture && Boolean(data.name.trim())),
        earlyCapture,
        ...getStoredUtm(),
      }),
    });

    if (!res.ok) return readWizardSnapshot()?.resumeToken;

    const json = (await res.json()) as WizardProgressResponse & { resumeToken?: string };
    if (json.resumeToken) {
      saveWizardSnapshot({ step, data, resumeToken: json.resumeToken });
      return json.resumeToken;
    }
  } catch {
    // local snapshot already saved
  }

  return readWizardSnapshot()?.resumeToken;
}

export function localWizardSnapshot(): WizardSnapshot | null {
  return readWizardSnapshot();
}
