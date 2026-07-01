"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/leads/submit";
import { getStoredUtm } from "@/lib/analytics/utm";
import {
  trackFunnelMilestone,
  trackFunnelStepComplete,
  trackFunnelStepView,
  trackLeadConversion,
} from "@/lib/analytics";
import { getAnalyticsSessionId } from "@/lib/analytics/session";
import { isPaidClickSession } from "@/lib/analytics/paid-click";
import { logServerMilestone } from "@/lib/analytics/log-server-milestone";
import { clearWizardSnapshot } from "@/lib/analytics/wizard-snapshot";
import { FUNNELS, onboardingStepKey } from "@/lib/analytics/funnel";
import type { MatchPreview } from "@/lib/leads/match-types";
import type { LeadPayload } from "@/lib/leads/types";
import { MatchPreviewModal } from "@/components/forms/match-preview-modal";
import { IndustryPicker } from "@/components/onboarding/industry-picker";
import {
  MobileProfileStrip,
  ProfilePreviewPanel,
  SelectableCard,
  WizardProgress,
  WizardStepHeader,
  WizardStickyActions,
  WizardTrustFooter,
} from "@/components/onboarding/wizard-primitives";
import {
  PREVIEW_TOP_COUNT,
  PREVIEW_VISIBLE_COUNT,
} from "@/lib/match-display";
import {
  businessDescriptionExample,
  onboardingMeta,
  MATCH_SCAN_MIN_MS,
  roleOptions,
  segmentOptions,
} from "@/lib/content/onboarding";
import { selfServePricing } from "@/lib/content/guarantee";
import {
  industryLabelToKey,
  keyToSectorLabel,
  keyToStageLabel,
  saveRaiseProfile,
  stageToKey,
} from "@/lib/raise-profile";
import { loadWizardProgress, syncWizardProgress } from "@/lib/wizard/sync-progress";
import type { WizardProgressData } from "@/lib/wizard/types";
import { authClient } from "@/lib/auth-client";

const stages = ["Pre-seed", "Seed", "Series A", "Series B"] as const;
const tractionOptions = [
  "Pre-revenue, strong design partners",
  "$10K–50K MRR",
  "$50K–200K MRR",
  "$200K+ MRR",
  "Profitable / bootstrapped",
] as const;
const timelineOptions = ["ASAP: round open now", "Next 30 days", "1–3 months", "Exploring options"] as const;
const raiseOptions = ["$500K–$1.5M", "$1.5M–$3M", "$3M–$6M", "$6M–$15M", "$15M+"] as const;
const priorFundingOptions = [
  "None (first institutional raise)",
  "Friends & family / angels (< $500K)",
  "$500K–$2M raised",
  "$2M–$10M raised",
  "$10M+ raised",
] as const;
const exitOptions = [
  "No prior exit",
  "Yes: acquired",
  "Yes: IPO",
  "Yes: other liquidity event",
] as const;

const TOTAL_STEPS = onboardingMeta.stepsCount;

type WizardData = WizardProgressData;

const emptyData: WizardData = {
  name: "",
  email: "",
  role: "",
  company: "",
  city: "",
  website: "",
  sector: "",
  segment: "",
  businessDescription: "",
  priorFunding: "",
  hadExit: "",
  stage: "",
  raise: "",
  traction: "",
  timeline: "",
  priorOutreach: "",
};

const EMPTY_PREVIEW: MatchPreview = {
  estimatedMatches: 0,
  topInvestors: [],
};

type LeadWizardProps = {
  source?: string;
  id?: string;
};

export function LeadWizard({ source = "lp-start", id }: LeadWizardProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(emptyData);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<MatchPreview | null>(null);
  const [animating, setAnimating] = useState(false);
  const [restoredSession, setRestoredSession] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: authSession } = authClient.useSession();

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const resumeToken = searchParams.get("resume");
      const saved = await loadWizardProgress(resumeToken);
      if (cancelled) return;

      if (saved) {
        setData(saved.data);
        setStep(saved.step);
        setRestoredSession(true);
      } else if (isPaidClickSession()) {
        setData((d) => ({ ...d, role: d.role || roleOptions[0] }));
      }

      setHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const persistLocally = useCallback(
    (nextStep: number, nextData: WizardData) => {
      if (!nextData.email.trim()) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        void syncWizardProgress({ step: nextStep, data: nextData, source });
      }, 400);
    },
    [source],
  );

  useEffect(() => {
    if (!hydrated) return;
    persistLocally(step, data);
  }, [hydrated, step, data, persistLocally]);

  useEffect(() => {
    const stepKey = onboardingStepKey(step);
    if (stepKey) {
      trackFunnelStepView(FUNNELS.onboarding, step, stepKey);
    }
  }, [step]);

  useEffect(() => {
    const sectorKey = searchParams.get("sector");
    const stageKey = searchParams.get("stage");
    if (sectorKey && keyToSectorLabel[sectorKey]) {
      setData((d) => ({ ...d, sector: keyToSectorLabel[sectorKey] }));
    }
    if (stageKey && keyToStageLabel[stageKey]) {
      setData((d) => ({ ...d, stage: keyToStageLabel[stageKey] }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated || !authSession?.user) return;
    setData((d) => ({
      ...d,
      name: d.name.trim() || authSession.user.name || "",
      email: d.email.trim() || authSession.user.email || "",
    }));
  }, [hydrated, authSession?.user]);

  function update(field: keyof WizardData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    setError(null);
  }

  function goToStep(target: number) {
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
    }, 150);
  }

  const captureContactInfo = useCallback(
    (nextData: WizardData = data) => {
      const email = nextData.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      void syncWizardProgress({
        step,
        data: nextData,
        source,
        earlyCapture: true,
        triggerEarlyAlert: Boolean(nextData.name.trim()),
      });
    },
    [step, data, source],
  );

  function resolveStepData(wizardData: WizardData): WizardData {
    if (step === 1 && !wizardData.role.trim()) {
      return { ...wizardData, role: roleOptions[0] };
    }
    return wizardData;
  }

  function validateStep(wizardData: WizardData = data): boolean {
    if (step === 1) {
      if (!wizardData.name.trim() || !wizardData.email.trim()) {
        setError("Name and work email are required.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wizardData.email)) {
        setError("Enter a valid work email.");
        return false;
      }
    }
    if (step === 2) {
      if (!wizardData.company.trim() || !wizardData.sector) {
        setError("Company name and industry are required.");
        return false;
      }
    }
    if (step === 3) {
      if (!wizardData.segment) {
        setError("Select a customer segment to continue.");
        return false;
      }
    }
    if (step === 4) {
      if (!wizardData.priorFunding || !wizardData.hadExit) {
        setError("Tell us about your funding history and any prior exits.");
        return false;
      }
    }
    if (step === 5) {
      if (!wizardData.stage || !wizardData.raise || !wizardData.traction || !wizardData.timeline) {
        setError("Complete all raise details to continue.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    const resolved = resolveStepData(data);
    if (resolved !== data) setData(resolved);
    if (!validateStep(resolved)) return;

    const stepKey = onboardingStepKey(step);
    if (stepKey) {
      trackFunnelStepComplete(FUNNELS.onboarding, step, stepKey, {
        skipped_description: step === 3 && !resolved.businessDescription.trim() ? true : undefined,
      });
    }

    const nextStep = step < TOTAL_STEPS ? step + 1 : step;
    void syncWizardProgress({
      step: nextStep,
      data: resolved,
      source,
      triggerEarlyAlert: step === 1,
    });

    if (step < TOTAL_STEPS) {
      goToStep(step + 1);
      return;
    }
    openPreview();
  }

  function skipBusinessDescription() {
    if (!data.segment) {
      setError("Select a customer segment to continue.");
      return;
    }
    setError(null);
    trackFunnelStepComplete(FUNNELS.onboarding, 3, "business", { skipped_description: true });
    void syncWizardProgress({ step: 4, data, source });
    goToStep(4);
  }

  async function openPreview() {
    setModalOpen(true);
    setModalLoading(true);
    setPreview(null);
    trackFunnelMilestone("match_scan_start", {
      company: data.company,
      sector: data.sector,
      stage: data.stage,
    });

    const stage = stageToKey[data.stage] ?? "seed";
    const sector = industryLabelToKey(data.sector);
    const scanStarted = Date.now();

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          sector,
          company: data.company,
          city: data.city.trim(),
          raise: data.raise?.trim(),
          sectorLabel: data.sector,
          limit: PREVIEW_TOP_COUNT,
        }),
      });

      const elapsed = Date.now() - scanStarted;
      if (elapsed < MATCH_SCAN_MIN_MS) {
        await new Promise((resolve) => window.setTimeout(resolve, MATCH_SCAN_MIN_MS - elapsed));
      }

      if (res.ok) {
        const api = await res.json();
        if ((api.source === "database" || api.source === "demo") && api.topInvestors?.length > 0) {
          setPreview({
            estimatedMatches: api.estimatedMatches ?? api.totalMatches ?? 0,
            databaseSize: api.databaseSize,
            topInvestors: api.topInvestors.map(
              (
                inv: {
                  firm: string;
                  partner: string | null;
                  score: number;
                  rationale: string;
                  fundSize?: string;
                  checkSize?: string;
                  investments?: string[];
                },
                i: number,
              ) => ({
                firm: inv.firm,
                partner: inv.partner,
                score: inv.score,
                reason: inv.rationale,
                fundSize: inv.fundSize,
                checkSize: inv.checkSize,
                investments: inv.investments,
                blurred: i >= PREVIEW_VISIBLE_COUNT,
              }),
            ),
          });
          trackFunnelMilestone("match_preview_open", {
            matchCount: api.estimatedMatches ?? api.totalMatches ?? 0,
          });
          setModalLoading(false);
          return;
        }

        setPreview({
          estimatedMatches: 0,
          topInvestors: [],
          emptyMessage:
            api.source === "empty"
              ? "Investor database is loading. We'll score matches from your profile manually."
              : "No strong automated matches yet. Our team will review your profile and finish your match set.",
        });
        trackFunnelMilestone("match_preview_open", { matchCount: 0, empty: true });
        setModalLoading(false);
        return;
      }
    } catch {
      const elapsed = Date.now() - scanStarted;
      if (elapsed < MATCH_SCAN_MIN_MS) {
        await new Promise((resolve) => window.setTimeout(resolve, MATCH_SCAN_MIN_MS - elapsed));
      }
      setPreview({
        estimatedMatches: 0,
        topInvestors: [],
        emptyMessage: "Could not score matches right now. Your profile is saved. We'll follow up within one business day.",
      });
      setModalLoading(false);
      return;
    }

    setPreview({
      estimatedMatches: 0,
      topInvestors: [],
      emptyMessage: "We'll score your matches from your profile.",
    });
    setModalLoading(false);
  }

  function buildPayload(): LeadPayload {
    const parts = [
      data.role && `Role: ${data.role}`,
      data.city && `City: ${data.city.trim()}`,
      data.segment && `Segment: ${data.segment}`,
      data.businessDescription && `Business: ${data.businessDescription.trim()}`,
      data.priorFunding && `Prior funding: ${data.priorFunding}`,
      data.hadExit && `Prior exit: ${data.hadExit}`,
      data.traction && `Traction: ${data.traction}`,
      data.timeline && `Timeline: ${data.timeline}`,
      data.priorOutreach && `Prior outreach: ${data.priorOutreach}`,
      data.website && `Website: ${data.website}`,
    ].filter(Boolean);

    return {
      name: data.name.trim(),
      email: data.email.trim(),
      company: data.company.trim(),
      stage: data.stage,
      sector: data.sector,
      raise: data.raise,
      message: parts.join("\n"),
      source,
      ...getStoredUtm(),
    };
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);

    const stageKey = stageToKey[data.stage] ?? "seed";
    const sectorKey = industryLabelToKey(data.sector);

    try {
      await submitLead({ ...buildPayload(), sessionId: getAnalyticsSessionId() });
      trackLeadConversion({
        source,
        lead_name: data.name.trim(),
        lead_email: data.email.trim().toLowerCase(),
        lead_company: data.company.trim(),
        lead_stage: data.stage,
        lead_sector: data.sector,
        ...getStoredUtm(),
      });

      saveRaiseProfile({
        ...data,
        matchCount: preview?.estimatedMatches,
        topInvestors: preview?.topInvestors?.slice(0, 6),
        stageKey,
        sectorKey,
        source,
      });

      clearWizardSnapshot();
      setModalOpen(false);
      logServerMilestone("generate_lead", {
        pagePath: "/start",
        leadEmail: data.email.trim().toLowerCase(),
        leadName: data.name.trim(),
        leadCompany: data.company.trim(),
        params: { source, lead_stage: data.stage, lead_sector: data.sector },
      });
      window.location.href = "/start/plan";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const labelClass = "mb-2 block text-sm font-medium text-text-primary";
  const hintClass = "mt-1.5 text-xs text-text-tertiary";
  const descLen = data.businessDescription.trim().length;
  const descQuality =
    descLen >= 120 ? "strong" : descLen >= 40 ? "good" : descLen > 0 ? "weak" : "empty";

  const reviewSections = [
    { label: "About you", step: 1, rows: [[data.name, data.email], [data.role].filter(Boolean)] },
    {
      label: "Company",
      step: 2,
      rows: [[data.company, data.city, data.website].filter(Boolean), [data.sector].filter(Boolean)],
    },
    {
      label: "Business",
      step: 3,
      rows: [
        [data.segment],
        data.businessDescription.trim()
          ? [data.businessDescription.slice(0, 120) + (data.businessDescription.length > 120 ? "…" : "")]
          : ["Skipped. Add later in your profile"],
      ],
    },
    {
      label: "Track record",
      step: 4,
      rows: [[data.priorFunding], [data.hadExit]],
    },
    {
      label: "This round",
      step: 5,
      rows: [
        [data.stage, data.raise].filter(Boolean),
        [data.traction].filter(Boolean),
        [data.timeline, data.priorOutreach].filter(Boolean),
      ],
    },
  ];

  return (
    <>
      <div id={id} className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
        <div className="min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {restoredSession ? (
            <p className="mb-4 rounded-md border border-brand/20 bg-brand/5 px-3 py-2 text-sm text-text-secondary">
              Welcome back. We saved your progress. Pick up where you left off.
            </p>
          ) : null}
          <WizardProgress step={step} />
          <MobileProfileStrip
            step={step}
            data={{
              name: data.name,
              company: data.company,
              city: data.city,
              sector: data.sector,
              stage: data.stage,
            }}
          />

          <div
            className={cn(
              "mt-8 transition-opacity duration-150",
              animating ? "opacity-0" : "opacity-100",
            )}
          >
            <WizardStepHeader step={step} />

            <div className="mt-8 space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="wiz-name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="wiz-name"
                      value={data.name}
                      onChange={(e) => update("name", e.target.value)}
                      onBlur={() => captureContactInfo()}
                      className="field-input"
                      placeholder="Jane Founder"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="wiz-email" className={labelClass}>
                      Work email
                    </label>
                    <input
                      id="wiz-email"
                      type="email"
                      value={data.email}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => captureContactInfo()}
                      className="field-input"
                      placeholder="jane@company.com"
                      autoComplete="email"
                    />
                    <p className={hintClass}>Where we send your matches and account invite.</p>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Your role{" "}
                      <span className="font-normal text-text-tertiary">(defaults to Founder & CEO)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((r) => (
                        <SelectableCard
                          key={r}
                          compact
                          selected={data.role === r}
                          onClick={() => update("role", r)}
                          title={r}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="rounded-md border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">Great start.</span> We score
                    12,000+ investor records — prioritizing firms near you, then expanding nationally.
                  </div>
                  <div>
                    <label htmlFor="wiz-company" className={labelClass}>
                      Company name
                    </label>
                    <input
                      id="wiz-company"
                      value={data.company}
                      onChange={(e) => update("company", e.target.value)}
                      className="field-input"
                      placeholder="Acme Inc."
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="wiz-city" className={labelClass}>
                      City{" "}
                      <span className="font-normal text-text-tertiary">(optional — sharper local matches)</span>
                    </label>
                    <input
                      id="wiz-city"
                      value={data.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="field-input"
                      placeholder="San Francisco"
                      autoComplete="address-level2"
                    />
                    <p className={hintClass}>
                      We look for investors in your area first. Local warm paths close faster.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="wiz-website" className={labelClass}>
                      Website
                    </label>
                    <input
                      id="wiz-website"
                      value={data.website}
                      onChange={(e) => update("website", e.target.value)}
                      className="field-input"
                      placeholder="acme.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Industry</label>
                    <IndustryPicker value={data.sector} onChange={(v) => update("sector", v)} />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className={labelClass}>Customer segment</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {segmentOptions.map((s) => (
                        <SelectableCard
                          key={s.value}
                          selected={data.segment === s.value}
                          onClick={() => update("segment", s.value)}
                          title={s.value}
                          description={s.description}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <label htmlFor="wiz-desc" className={labelClass}>
                        Describe your business{" "}
                        <span className="font-normal text-text-tertiary">(optional)</span>
                      </label>
                      {descLen > 0 && (
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-wider",
                            descQuality === "strong"
                              ? "text-brand"
                              : descQuality === "good"
                                ? "text-text-secondary"
                                : "text-text-tertiary",
                          )}
                        >
                          {descLen} chars ·{" "}
                          {descQuality === "strong"
                            ? "Strong"
                            : descQuality === "good"
                              ? "Good"
                              : "Add detail"}
                        </span>
                      )}
                    </div>
                    <textarea
                      id="wiz-desc"
                      value={data.businessDescription}
                      onChange={(e) => update("businessDescription", e.target.value)}
                      className="field-input min-h-[140px] resize-y"
                      placeholder={businessDescriptionExample}
                      rows={6}
                    />
                    <p className={hintClass}>
                      Include what you sell, who buys, traction metrics, and why now, or skip and
                      add this later in your profile.
                    </p>
                    <button
                      type="button"
                      onClick={skipBusinessDescription}
                      className="mt-3 text-sm text-text-secondary underline-offset-2 hover:text-text-primary hover:underline"
                    >
                      Skip for now. I&apos;ll add this later
                    </button>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <label className={labelClass}>Funding raised to date</label>
                    <div className="space-y-2">
                      {priorFundingOptions.map((option) => (
                        <SelectableCard
                          key={option}
                          compact
                          selected={data.priorFunding === option}
                          onClick={() => update("priorFunding", option)}
                          title={option}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Have you had a prior exit?</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {exitOptions.map((option) => (
                        <SelectableCard
                          key={option}
                          compact
                          selected={data.hadExit === option}
                          onClick={() => update("hadExit", option)}
                          title={option}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div>
                    <label className={labelClass}>Current stage</label>
                    <div className="grid grid-cols-2 gap-2">
                      {stages.map((s) => (
                        <SelectableCard
                          key={s}
                          compact
                          selected={data.stage === s}
                          onClick={() => update("stage", s)}
                          title={s}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Target raise</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {raiseOptions.map((r) => (
                        <SelectableCard
                          key={r}
                          compact
                          selected={data.raise === r}
                          onClick={() => update("raise", r)}
                          title={r}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Current traction</label>
                    <div className="space-y-2">
                      {tractionOptions.map((t) => (
                        <SelectableCard
                          key={t}
                          compact
                          selected={data.traction === t}
                          onClick={() => update("traction", t)}
                          title={t}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>When do you need to be in market?</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {timelineOptions.map((t) => (
                        <SelectableCard
                          key={t}
                          compact
                          selected={data.timeline === t}
                          onClick={() => update("timeline", t)}
                          title={t}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Prior outreach this round?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Not yet", "Some manual", "Ran a campaign"].map((o) => (
                        <SelectableCard
                          key={o}
                          compact
                          selected={data.priorOutreach === o}
                          onClick={() => update("priorOutreach", o)}
                          title={o}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  {reviewSections.map((section) => (
                    <div
                      key={section.label}
                      className="border border-border bg-surface-muted p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                          {section.label}
                        </p>
                        <button
                          type="button"
                          onClick={() => goToStep(section.step)}
                          className="flex items-center gap-1 text-[11px] text-brand hover:underline"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                      </div>
                      <div className="mt-3 space-y-1.5">
                        {section.rows.map((row, i) => (
                          <p key={i} className="text-sm text-text-primary">
                            {row.join(" · ")}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs leading-relaxed text-text-tertiary">
                    By continuing, you confirm this information is accurate. We use it to score
                    investors and draft outreach. Inaccurate profiles produce weaker matches.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 hidden lg:block">
              <WizardStickyActions
                step={step}
                totalSteps={TOTAL_STEPS}
                onBack={() => goToStep(step - 1)}
                onNext={goNext}
                nextLabel={step === TOTAL_STEPS ? "Score my investor matches" : "Continue"}
                error={error}
              />
              <WizardTrustFooter />
            </div>
          </div>
        </div>

        <ProfilePreviewPanel
          step={step}
          data={{
            name: data.name,
            email: data.email,
            company: data.company,
            city: data.city,
            sector: data.sector,
            segment: data.segment,
            stage: data.stage,
            raise: data.raise,
            priorFunding: data.priorFunding,
          }}
        />
      </div>

      {/* Mobile sticky footer */}
      <div className="wizard-sticky-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-elevated/95 px-4 py-3 backdrop-blur-md lg:hidden pb-safe">
        <WizardStickyActions
          step={step}
          totalSteps={TOTAL_STEPS}
          onBack={() => goToStep(step - 1)}
          onNext={goNext}
          nextLabel={step === TOTAL_STEPS ? "Score matches" : "Continue"}
          error={error}
        />
      </div>

      {modalOpen && (
        <MatchPreviewModal
          open={modalOpen}
          preview={preview ?? EMPTY_PREVIEW}
          company={data.company}
          city={data.city}
          sector={data.sector}
          stage={data.stage}
          loading={modalLoading}
          submitting={submitting}
          onClose={() => {
            setModalOpen(false);
            setModalLoading(false);
          }}
          onConfirm={handleConfirm}
          confirmLabel={selfServePricing.cta}
          profileSummary={{
            name: data.name,
            company: data.company,
            city: data.city,
            sector: data.sector,
            stage: data.stage,
            raise: data.raise,
          }}
        />
      )}
    </>
  );
}
