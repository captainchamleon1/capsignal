export type RaiseProfileDraft = {
  name: string;
  email: string;
  role?: string;
  company: string;
  city: string;
  website: string;
  sector: string;
  segment: string;
  businessDescription: string;
  priorFunding: string;
  hadExit: string;
  stage: string;
  raise: string;
  traction: string;
  timeline: string;
  priorOutreach: string;
  matchCount?: number; /** Estimated profile match pool shown in funnel copy */
  stageKey?: string;
  sectorKey?: string;
  source?: string;
};

const STORAGE_KEY = "capsignal-raise-profile";

export function saveRaiseProfile(profile: RaiseProfileDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function loadRaiseProfile(): RaiseProfileDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RaiseProfileDraft;
  } catch {
    return null;
  }
}

export function clearRaiseProfile() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export {
  industryLabelToKey,
  industryKeyToLabel,
  sectorToKey,
  keyToSectorLabel,
} from "@/lib/content/industries";

export const stageToKey: Record<string, string> = {
  "Pre-seed": "pre_seed",
  Seed: "seed",
  "Series A": "series_a",
  "Series B": "series_b",
};

export const keyToStageLabel: Record<string, string> = {
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
};
