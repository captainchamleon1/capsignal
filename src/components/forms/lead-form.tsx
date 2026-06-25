"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/leads/submit";
import { getStoredUtm } from "@/lib/analytics/utm";
import { trackLeadConversion } from "@/lib/analytics";
import type { LeadPayload } from "@/lib/leads/types";

const stages = ["Pre-seed", "Seed", "Series A", "Series B"] as const;
const sectors = ["B2B SaaS", "Fintech", "Healthtech", "Climate", "Deep tech", "Other"] as const;

type LeadFormProps = {
  variant?: "full" | "compact";
  source?: string;
  id?: string;
};

export function LeadForm({ variant = "full", source = "request-access", id }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload: LeadPayload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      stage: String(form.get("stage") ?? "") || undefined,
      sector: String(form.get("sector") ?? "") || undefined,
      raise: String(form.get("raise") ?? "") || undefined,
      message: String(form.get("message") ?? "") || undefined,
      source,
      ...getStoredUtm(),
    };

    try {
      await submitLead(payload);
      trackLeadConversion({ source, ...getStoredUtm() });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Panel muted className="text-center">
        <p className="text-lg font-medium text-text-primary">Request received</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          We review every submission and respond within one business day with fit assessment,
          pricing, and next steps.
        </p>
      </Panel>
    );
  }

  const labelClass = "mb-2 block text-sm font-medium text-text-primary";
  const isCompact = variant === "compact";

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-5">
      <div className={cn("grid gap-5", !isCompact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${id ?? "lead"}-name`} className={labelClass}>
            Full name
          </label>
          <input
            id={`${id ?? "lead"}-name`}
            name="name"
            required
            className="field-input"
            placeholder="Jane Founder"
          />
        </div>
        <div>
          <label htmlFor={`${id ?? "lead"}-email`} className={labelClass}>
            Work email
          </label>
          <input
            id={`${id ?? "lead"}-email`}
            name="email"
            type="email"
            required
            className="field-input"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className={cn("grid gap-5", !isCompact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${id ?? "lead"}-company`} className={labelClass}>
            Company
          </label>
          <input
            id={`${id ?? "lead"}-company`}
            name="company"
            required
            className="field-input"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label htmlFor={`${id ?? "lead"}-stage`} className={labelClass}>
            Stage
          </label>
          <select id={`${id ?? "lead"}-stage`} name="stage" required className="field-input">
            <option value="">Select stage</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isCompact && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id ?? "lead"}-raise`} className={labelClass}>
                Target raise
              </label>
              <input id={`${id ?? "lead"}-raise`} name="raise" className="field-input" placeholder="$2.5M Seed" />
            </div>
            <div>
              <label htmlFor={`${id ?? "lead"}-sector`} className={labelClass}>
                Sector
              </label>
              <select id={`${id ?? "lead"}-sector`} name="sector" required className="field-input">
                <option value="">Select sector</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${id ?? "lead"}-message`} className={labelClass}>
              Anything else we should know
            </label>
            <textarea
              id={`${id ?? "lead"}-message`}
              name="message"
              rows={4}
              className={cn("field-input resize-none")}
              placeholder="Traction, timeline, prior outreach attempts..."
            />
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" variant="primary" className={cn("w-full", loading && "opacity-70")}>
        {loading ? "Submitting..." : "Request access"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-text-tertiary">
        No spam. We respond within one business day.
      </p>
    </form>
  );
}
