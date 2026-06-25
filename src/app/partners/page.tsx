import type { Metadata } from "next";
import {
  partnerBenefits,
  partnerServices,
  partnerTypes,
  partnerFaqs,
} from "@/lib/content/partners";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/ui/faq-list";

export const metadata: Metadata = {
  title: "Partners",
  description: "Referral program for VCs, accelerators, and fundraising advisors.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        label="Partners"
        title="Fundraising infrastructure for your portfolio"
        description="Refer founders to CapSignal. We run the raise end-to-end—you earn commission and stay looped in on progress."
      >
        <Button variant="primary" href="mailto:partners@capsignal.com">
          Become a partner
        </Button>
      </PageHeader>

      <PageSection border="bottom">
        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {partnerBenefits.map((b) => (
            <Panel key={b.title} className="border-0">
              <h3 className="text-lg font-semibold text-text-primary">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{b.body}</p>
            </Panel>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading label="Services" title="What we handle" />
            <ul className="mt-8 space-y-3 border-l border-border pl-5">
              {partnerServices.map((s) => (
                <li key={s} className="text-sm leading-relaxed text-text-secondary">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading label="Partners" title="Who works with us" />
            <div className="mt-8 space-y-px border border-border bg-border">
              {partnerTypes.map((p) => (
                <Panel key={p.type} padding="sm" className="border-0">
                  <h3 className="text-sm font-semibold text-text-primary">{p.type}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{p.detail}</p>
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection variant="muted" border="top">
        <SectionHeading label="FAQ" title="Partner questions" />
        <div className="mt-8 max-w-2xl">
          <FaqList items={partnerFaqs} />
        </div>
      </PageSection>
    </>
  );
}
