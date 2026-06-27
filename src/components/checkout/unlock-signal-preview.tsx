"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Lock,
  Mail,
  Link2,
  Sparkles,
  FileText,
  Eye,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UnlockSignalPreviewProps = {
  company?: string;
  stage?: string;
  sector?: string;
  className?: string;
};

type ViewId = "contacts" | "outreach" | "dataroom" | "crm";

const views: { id: ViewId; label: string }[] = [
  { id: "contacts", label: "Contacts" },
  { id: "outreach", label: "Outreach" },
  { id: "dataroom", label: "Data room" },
  { id: "crm", label: "CRM" },
];

const sampleRows = [
  { firm: "Point Nine Capital", partner: "Pawel Chudzinski", score: 94 },
  { firm: "First Round Capital", partner: "Josh Kopelman", score: 89 },
  { firm: "Index Ventures", partner: "Danny Rimer", score: 86 },
];

const sequenceSteps = [
  { day: 0, label: "Thesis-aware intro", tag: "AI drafted" },
  { day: 3, label: "Portfolio overlap follow-up", tag: "Automated" },
  { day: 7, label: "Meeting ask", tag: "Scheduled" },
];

const dataRoomFiles = [
  { name: "Pitch deck v3.pdf", views: 12, investors: 4 },
  { name: "Financial model.xlsx", views: 3, investors: 2 },
  { name: "Cap table.pdf", views: 0, investors: 0, locked: true },
];

const crmStages = [
  { stage: "Shortlisted", count: 48, active: false },
  { stage: "Contacted", count: 0, active: true },
  { stage: "Replied", count: 0, active: false },
  { stage: "Meeting", count: 0, active: false },
];

function ContactsView() {
  return (
    <div className="space-y-2.5 p-3">
      {sampleRows.map((row, i) => (
        <div
          key={row.firm}
          className="relative overflow-hidden border border-surface-dark-border bg-surface-dark-raised/40"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-text-on-dark">{row.firm}</p>
              <p className="truncate text-[10px] text-text-on-dark-muted">{row.partner}</p>
            </div>
            <span className="font-mono text-sm tabular-nums text-brand-gold">{row.score}</span>
          </div>
          <div className="flex border-t border-surface-dark-border/80">
            <div className="relative flex flex-1 items-center gap-1.5 border-r border-surface-dark-border/80 px-3 py-2">
              <Mail className="h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
              <span
                className={cn(
                  "text-[10px]",
                  i === 0 ? "text-text-on-dark-muted" : "select-none blur-[3px] text-text-on-dark",
                )}
              >
                {i === 0 ? "partner@fund.com" : "████████████"}
              </span>
              {i !== 0 && (
                <Lock className="ml-auto h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
              )}
            </div>
            <div className="relative flex flex-1 items-center gap-1.5 px-3 py-2">
              <Link2 className="h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
              <span className="select-none blur-[3px] text-[10px] text-text-on-dark">████████</span>
              <Lock className="ml-auto h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
            </div>
          </div>
          {i !== 0 && (
            <div className="pointer-events-none absolute inset-0 bg-surface-dark/20" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function OutreachView() {
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center gap-2 border border-brand-gold/30 bg-brand-gold/10 px-3 py-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
        <p className="text-[10px] leading-snug text-text-on-dark-muted">
          Sequences draft from your raise profile + investor thesis — sent from your domain
        </p>
      </div>
      {sequenceSteps.map((step) => (
        <div
          key={step.day}
          className="flex items-center gap-3 border border-surface-dark-border bg-surface-dark-raised/40 px-3 py-2.5"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white/5 font-mono text-[10px] text-brand-gold">
            {step.day}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-text-on-dark">{step.label}</p>
            <p className="text-[10px] text-text-on-dark-muted">Day {step.day}</p>
          </div>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-brand-gold">
            {step.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function DataRoomView() {
  return (
    <div className="space-y-2 p-3">
      {dataRoomFiles.map((file) => (
        <div
          key={file.name}
          className={cn(
            "relative flex items-center gap-3 border border-surface-dark-border bg-surface-dark-raised/40 px-3 py-2.5",
            file.locked && "overflow-hidden",
          )}
        >
          <FileText className="h-4 w-4 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-xs font-medium text-text-on-dark",
                file.locked && "select-none blur-[2px]",
              )}
            >
              {file.name}
            </p>
            {!file.locked && (
              <p className="flex items-center gap-1 text-[10px] text-text-on-dark-muted">
                <Eye className="h-2.5 w-2.5" aria-hidden="true" />
                {file.views} views · {file.investors} investors
              </p>
            )}
          </div>
          {file.locked && (
            <Lock className="h-3 w-3 shrink-0 text-text-on-dark-muted" aria-hidden="true" />
          )}
          {file.locked && (
            <div className="pointer-events-none absolute inset-0 bg-surface-dark/25" aria-hidden="true" />
          )}
        </div>
      ))}
      <p className="px-1 text-[10px] text-text-on-dark-muted">
        Per-slide tracking · permission controls per investor
      </p>
    </div>
  );
}

function CrmView() {
  return (
    <div className="p-3">
      <div className="grid grid-cols-4 gap-1.5">
        {crmStages.map((col) => (
          <div
            key={col.stage}
            className={cn(
              "border px-1.5 py-2 text-center",
              col.active
                ? "border-brand-gold/40 bg-brand-gold/10"
                : "border-surface-dark-border bg-surface-dark-raised/30",
            )}
          >
            <p className="font-mono text-sm tabular-nums text-text-on-dark">{col.count}</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-wide text-text-on-dark-muted">
              {col.stage}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {["Point Nine Capital", "First Round Capital"].map((firm, i) => (
          <div
            key={firm}
            className="flex items-center justify-between border border-surface-dark-border px-3 py-2"
          >
            <span className="truncate text-[11px] text-text-on-dark">{firm}</span>
            <span className="flex items-center gap-1 font-mono text-[9px] text-text-on-dark-muted">
              {i === 0 ? "Queued" : "—"}
              <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const viewPanels: Record<ViewId, typeof ContactsView> = {
  contacts: ContactsView,
  outreach: OutreachView,
  dataroom: DataRoomView,
  crm: CrmView,
};

export function UnlockSignalPreview({
  company,
  stage,
  sector,
  className,
}: UnlockSignalPreviewProps) {
  const [active, setActive] = useState<ViewId>("contacts");
  const profileLabel = [company, sector, stage].filter(Boolean).join(" · ");
  const Panel = viewPanels[active];

  const cycle = useCallback(() => {
    setActive((current) => {
      const idx = views.findIndex((v) => v.id === current);
      return views[(idx + 1) % views.length].id;
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(cycle, 4500);
    return () => clearInterval(timer);
  }, [cycle]);

  return (
    <div className={cn("overflow-hidden border border-border bg-surface-dark", className)}>
      <div className="flex items-center justify-between border-b border-surface-dark-border px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-brand-gold">
          Signal
        </span>
        {profileLabel && (
          <span className="truncate font-mono text-[10px] text-text-on-dark-muted">
            {profileLabel}
          </span>
        )}
      </div>

      <div className="min-h-[220px]">
        <Panel />
      </div>

      <div
        className="grid grid-cols-4 gap-0 border-t border-surface-dark-border"
        role="tablist"
        aria-label="Included product areas"
      >
        {views.map((view) => (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={active === view.id}
            onClick={() => setActive(view.id)}
            className={cn(
              "py-2.5 font-mono text-[9px] uppercase tracking-wider transition-colors",
              active === view.id
                ? "bg-brand/20 text-brand-gold"
                : "bg-transparent text-text-on-dark-muted hover:bg-white/5 hover:text-text-on-dark",
            )}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
