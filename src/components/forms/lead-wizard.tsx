"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/leads/submit";
import { getStoredUtm } from "@/lib/analytics/utm";
import { trackLeadConversion } from "@/lib/analytics";
import { generateMatchPreview } from "@/lib/leads/match-preview";
import type { MatchPreview } from "@/lib/leads/match-preview";
import type { LeadPayload } from "@/lib/leads/types";
import { MatchPreviewModal } from "@/components/forms/match-preview-modal";

const stages = ["Pre-seed", "Seed", "Series A", "Series B"] as const;
const sectors = ["B2B SaaS", "Fintech", "Healthtech", "Climate", "Deep tech", "Other"] as const;
const tractionOptions = [
  "Pre-revenue, strong design partners",
  "$10K–50K MRR",
  "$50K–200K MRR",
  "$200K+ MRR",
  "Profitable / bootstrapped",
] as const;
const timelineOptions = ["ASAP — round open now", "Next 30 days", "1–3 months", "Exploring options"] as const;
const raiseOptions = ["$500K–$1.5M", "$1.5M–$3M", "$3M–$6M", "$6M–$15M", "$15M+"] as const;

const steps = [
  { id: 1, label: "You" },
  { id: 2, label: "Company" },
  { id: 3, label: "Raise" },
] as const;

type WizardData = {
  name: string;
  email: string;
  company: string;
  website: string;
  sector: string;
  stage: string;
  raise: string;
  traction: string;
  timeline: string;
  priorOutreach: string;
  message: string;
};

const emptyData: WizardData = {
  name: "",
  email: "",
  company: "",
  website: "",
  sector: "",
  stage: "",
  raise: "",
  traction: "",
  timeline: "",
  priorOutreach: "",
  message: "",
};

type LeadWizardProps = {
  source?: string;
  id?: string;
  hidePricing?: boolean;
};

export function LeadWizard({ source = "lp-start", id, hidePricing = false }: LeadWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(emptyData);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<MatchPreview | null>(null);

  function update(field: keyof WizardData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
    setError(null);
  }

  function validateStep(): boolean {
    if (step === 1) {
      if (!data.name.trim() || !data.email.trim()) {
        setError("Name and work email are required.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setError("Enter a valid work email.");
        return false;
      }
    }
    if (step === 2) {
      if (!data.company.trim() || !data.sector) {
        setError("Company name and sector are required.");
        return false;
      }
    }
    if (step === 3) {
      if (!data.stage || !data.raise || !data.traction || !data.timeline) {
        setError("Complete all raise details to see your matches.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    openPreview();
  }

  function openPreview() {
    const result = generateMatchPreview({
      company: data.company,
      sector: data.sector,
      stage: data.stage,
      raise: data.raise,
    });
    setPreview(result);
    setModalOpen(true);
    setModalLoading(true);
    window.setTimeout(() => setModalLoading(false), 2200);
  }

  function buildPayload(): LeadPayload {
    const parts = [
      data.traction && `Traction: ${data.traction}`,
      data.timeline && `Timeline: ${data.timeline}`,
      data.priorOutreach && `Prior outreach: ${data.priorOutreach}`,
      data.website && `Website: ${data.website}`,
      data.message,
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
    try {
      await submitLead(buildPayload());
      trackLeadConversion({ source, ...getStoredUtm() });
      setModalOpen(false);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Panel muted className="text-center">
        <p className="text-lg font-medium text-text-primary">You&apos;re on the list</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {hidePricing
            ? `We'll send your full ${preview?.totalMatches ?? ""} investor shortlist within one business day — with fit scores and rationale for every match.`
            : `We'll send your full ${preview?.totalMatches ?? ""} investor shortlist within one business day — with fit scores, rationale, and recommended pricing.`}
        </p>
        <p className="mt-4 font-mono text-xs text-text-tertiary">Check {data.email} for next steps.</p>
      </Panel>
    );
  }

  const labelClass = "mb-2 block text-sm font-medium text-text-primary";
  const hintClass = "mt-1.5 text-xs text-text-tertiary";

  return (
    <>
      <div id={id}>
        <div className="mb-6 flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center font-mono text-[11px] transition-colors",
                    step >= s.id
                      ? "bg-brand text-white"
                      : "border border-border bg-surface-muted text-text-tertiary",
                  )}
                >
                  {s.id}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider",
                    step >= s.id ? "text-text-primary" : "text-text-tertiary",
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-px flex-1 transition-colors",
                    step > s.id ? "bg-brand" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="wiz-name" className={labelClass}>
                Full name
              </label>
              <input
                id="wiz-name"
                value={data.name}
                onChange={(e) => update("name", e.target.value)}
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
                className="field-input"
                placeholder="jane@company.com"
                autoComplete="email"
              />
              <p className={hintClass}>We&apos;ll send your shortlist here — no mailing lists.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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
              <label htmlFor="wiz-website" className={labelClass}>
                Website <span className="font-normal text-text-tertiary">(optional)</span>
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
              <label className={labelClass}>Sector</label>
              <div className="flex flex-wrap gap-2">
                {sectors.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update("sector", s)}
                    className={cn(
                      "border px-3 py-2 text-xs font-medium transition-colors",
                      data.sector === s
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {stages.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update("stage", s)}
                    className={cn(
                      "border px-3 py-2.5 text-left text-sm transition-colors",
                      data.stage === s
                        ? "border-brand bg-brand-tint font-medium text-brand"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Target raise</label>
              <div className="flex flex-wrap gap-2">
                {raiseOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => update("raise", r)}
                    className={cn(
                      "border px-3 py-2 text-xs font-medium transition-colors",
                      data.raise === r
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Current traction</label>
              <div className="space-y-1.5">
                {tractionOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("traction", t)}
                    className={cn(
                      "flex w-full border px-3 py-2.5 text-left text-sm transition-colors",
                      data.traction === t
                        ? "border-brand bg-brand-tint text-text-primary"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>When do you need to be in market?</label>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {timelineOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("timeline", t)}
                    className={cn(
                      "border px-3 py-2.5 text-left text-xs transition-colors",
                      data.timeline === t
                        ? "border-brand bg-brand-tint text-text-primary"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Have you already started outreach?</label>
              <div className="grid grid-cols-3 gap-2">
                {["Not yet", "Some manual", "Ran a campaign"].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => update("priorOutreach", o)}
                    className={cn(
                      "border px-2 py-2 text-center text-xs transition-colors",
                      data.priorOutreach === o
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-border text-text-secondary hover:border-border-strong",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button type="button" variant="primary" className="flex-1" onClick={goNext}>
            {step === 3 ? "See my matches" : "Continue"}
          </Button>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-text-tertiary">
          {step === 3
            ? "We'll score investors in your space — takes about 5 seconds."
            : `Step ${step} of 3 · No credit card required`}
        </p>
      </div>

      {preview && (
        <MatchPreviewModal
          open={modalOpen}
          preview={preview}
          company={data.company}
          sector={data.sector}
          stage={data.stage}
          loading={modalLoading}
          submitting={submitting}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
