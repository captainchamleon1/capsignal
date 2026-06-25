import type { Metadata } from "next";
import { team, principles, milestones } from "@/lib/content/about";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "About",
  description: "CapSignal builds fundraising infrastructure for Seed through Series B raises.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title="Fundraising should run on systems, not heroics"
        description="CapSignal was built by people who've run raises and seen the same problem repeatedly: great founders losing months to manual outreach and stale investor lists."
      />

      <PageSection border="bottom">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {principles.map((p) => (
            <Panel key={p.title} className="border-0">
              <h3 className="text-lg font-semibold text-text-primary">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{p.body}</p>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading label="Team" title="People behind the platform" />
        <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
          {team.map((member) => (
            <Panel key={member.name} padding="default" className="border-0">
              <div className="flex h-11 w-11 items-center justify-center bg-surface-muted font-mono text-xs text-text-secondary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="mt-5 text-base font-semibold text-text-primary">{member.name}</h3>
              <p className="text-sm text-text-tertiary">{member.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{member.bio}</p>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection variant="muted" border="top">
        <SectionHeading label="History" title="Timeline" />
        <div className="mt-8 divide-y divide-border border-y border-border">
          {milestones.map((m) => (
            <div key={m.year} className="flex gap-8 py-4">
              <span className="w-14 shrink-0 font-mono text-sm tabular-nums text-text-tertiary">
                {m.year}
              </span>
              <p className="text-sm leading-relaxed text-text-secondary">{m.event}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </>
  );
}
