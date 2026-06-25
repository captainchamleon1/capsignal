import type { Metadata } from "next";
import { changelog } from "@/lib/content/changelog";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";

export const metadata: Metadata = {
  title: "Changelog",
  description: "CapSignal product updates and releases.",
};

const typeStyles = {
  feature: "bg-surface-dark text-text-on-dark",
  improvement: "bg-surface-muted text-text-secondary",
  fix: "border border-border bg-surface-elevated text-text-tertiary",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        label="Changelog"
        title="Product updates"
        description="New features, improvements, and fixes to the CapSignal platform."
      />

      <PageSection>
        <div className="mx-auto max-w-2xl divide-y divide-border border-y border-border">
          {changelog.map((entry) => (
            <article key={entry.date + entry.title} className="py-8 first:pt-8 last:pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <time className="font-mono text-sm tabular-nums text-text-tertiary">{entry.date}</time>
                <span
                  className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${typeStyles[entry.type]}`}
                >
                  {entry.type}
                </span>
              </div>
              <h2 className="display-serif mt-3 text-lg font-semibold text-text-primary">{entry.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{entry.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
