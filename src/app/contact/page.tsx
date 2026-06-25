import type { Metadata } from "next";
import { siteConfig } from "@/lib/content/site";
import { PageHeader } from "@/components/ui/page-header";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { RequestAccessForm } from "@/components/forms/request-access-form";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CapSignal team.",
};

const contacts = [
  { label: "General", email: siteConfig.email },
  { label: "Partnerships", email: "partners@capsignal.com" },
  { label: "Support", email: siteConfig.supportEmail },
  { label: "Security", email: "security@capsignal.com" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Talk to our team"
        description="Questions about fit, pricing, or partnerships—we respond within one business day."
      />

      <PageSection>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading label="Email" title="Direct lines" />
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {contacts.map((c) => (
                <div key={c.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    {c.label}
                  </dt>
                  <dd>
                    <TextLink href={`mailto:${c.email}`} className="text-text-primary">
                      {c.email}
                    </TextLink>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <SectionHeading label="Access" title="Request access" />
            <div className="mt-8">
              <RequestAccessForm />
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
