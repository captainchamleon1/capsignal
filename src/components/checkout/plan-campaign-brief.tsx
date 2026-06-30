import type { RaiseProfileDraft } from "@/lib/raise-profile";
import type { RaiseBriefInsights } from "@/lib/plan/raise-brief";
import { formatInvestorCount } from "@/lib/match-display";
import { cn } from "@/lib/utils";

type PlanCampaignBriefProps = {
  profile: RaiseProfileDraft;
  brief: RaiseBriefInsights;
  className?: string;
};

export function PlanCampaignBrief({ profile, brief, className }: PlanCampaignBriefProps) {
  const chips = [
    profile.company,
    profile.city,
    profile.stage,
    profile.sector,
    profile.raise,
    profile.timeline,
  ].filter(Boolean);

  const memoLines = [
    `${formatInvestorCount(brief.vcFunds)} VC funds · ${formatInvestorCount(brief.angels)} angels & operators`,
    `${formatInvestorCount(brief.activeDeployers)} with a deployment in the last 90 days`,
    ...(brief.metroMatches > 0
      ? [`${formatInvestorCount(brief.metroMatches)} near ${profile.city}`]
      : []),
    `${formatInvestorCount(brief.highFitMatches)} scored 85+ on stage and thesis fit`,
    profile.timeline?.trim() ? `Target close: ${profile.timeline.trim()}` : null,
  ].filter(Boolean) as string[];

  return (
    <section className={cn("border border-border bg-surface-dark text-text-on-dark", className)}>
      <div className="border-b border-surface-dark-border px-4 py-4 sm:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
          Raise summary
        </p>
        <p className="mt-2 font-mono text-[11px] text-text-on-dark-muted">
          {profile.name} · {profile.company}
        </p>
        <p className="font-mono text-[11px] text-text-on-dark-muted">{brief.memoSubject}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="border border-surface-dark-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
      <ul className="space-y-0 divide-y divide-surface-dark-border/80 px-4 sm:px-5">
        {memoLines.map((line) => (
          <li
            key={line}
            className="flex gap-3 py-3 text-[13px] leading-relaxed text-text-on-dark-muted"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>
      {profile.businessDescription?.trim() ? (
        <div className="border-t border-surface-dark-border px-4 py-4 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-on-dark-muted">
            Company description (on file)
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-on-dark">
            {profile.businessDescription.trim()}
          </p>
        </div>
      ) : null}
    </section>
  );
}
