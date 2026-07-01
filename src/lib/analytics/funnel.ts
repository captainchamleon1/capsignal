export const FUNNELS = {
  onboarding: "onboarding",
  conversion: "conversion",
} as const;

export type FunnelName = (typeof FUNNELS)[keyof typeof FUNNELS];

export const ONBOARDING_STEPS = [
  "raise_basics",
  "matches_unlock",
  "goals",
  "business",
  "this_round",
  "review",
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number];

export const CONVERSION_MILESTONES = [
  "teaser_matches_view",
  "email_captured",
  "match_scan_start",
  "match_preview_open",
  "match_preview_confirm",
  "plan_view",
  "checkout_view",
  "checkout_start",
  "checkout_success",
  "trial_start",
] as const;

export type ConversionMilestone = (typeof CONVERSION_MILESTONES)[number];

export function onboardingStepKey(step: number): OnboardingStepKey | undefined {
  return ONBOARDING_STEPS[step - 1];
}
