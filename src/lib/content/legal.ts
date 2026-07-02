import { siteConfig } from "@/lib/content/site";
import { selfServePricing } from "@/lib/content/guarantee";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  afterList?: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  contactNote?: string;
};

const email = siteConfig.email;
const support = siteConfig.supportEmail;
const url = siteConfig.url;

export const legalHub = {
  title: "Legal",
  description: "Privacy, terms, cookies, and how CapSignal handles your data.",
  links: [
    {
      label: "Privacy Policy",
      href: "/privacy",
      description: "What we collect, how we use it, and your rights.",
    },
    {
      label: "Terms of Service",
      href: "/terms",
      description: "Subscription, acceptable use, and service limits.",
    },
    {
      label: "Cookie Policy",
      href: "/cookies",
      description: "Cookies, analytics, and how to manage preferences.",
    },
    {
      label: "Security",
      href: "/security",
      description: "Encryption, access controls, and compliance posture.",
    },
  ],
} as const;

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  description: "How CapSignal collects, uses, and protects personal information.",
  lastUpdated: "June 28, 2026",
  intro: `This Privacy Policy describes how ${siteConfig.name} ("CapSignal," "we," "us," or "our") handles personal information when you visit ${url}, create an account, start a trial, or use our fundraising platform and related services (collectively, the "Service"). By using the Service, you agree to the practices described here.`,
  sections: [
    {
      id: "scope",
      title: "1. Scope",
      paragraphs: [
        "This policy applies to information we process about visitors, trial users, paying customers, and individuals who contact us through forms, email, or support channels.",
        "If you use CapSignal on behalf of a company, you represent that you have authority to share company and team information with us and to bind that organization to this policy where applicable.",
      ],
    },
    {
      id: "collect",
      title: "2. Information we collect",
      paragraphs: ["We collect information in three broad categories:"],
      list: [
        "Information you provide — name, email address, company name, role, fundraising stage, sector, raise amount, business description, deck or data-room uploads, investor lists, message templates, billing details submitted through our payment provider, and any content you send through onboarding, checkout, or support.",
        "Information collected automatically — IP address, browser type, device identifiers, pages viewed, referral URLs, UTM campaign parameters, session duration, scroll depth, button clicks, form interactions, and similar usage events. We may compile session summaries when you leave a page.",
        "Information from third parties — payment and subscription status from Stripe; email delivery events from our email provider; and, where configured, analytics signals from tools such as Google Tag Manager, Meta Pixel, or Microsoft Clarity.",
      ],
    },
    {
      id: "use",
      title: "3. How we use information",
      paragraphs: ["We use personal information to:"],
      list: [
        "Provide, operate, and improve the Service, including investor matching, outreach workflows, campaign analytics, and data-room features.",
        "Process subscriptions, free trials, refunds, and billing through Stripe.",
        "Respond to access requests and support inquiries.",
        "Send transactional messages (account confirmations, billing receipts, product updates you opt into).",
        "Monitor site performance, diagnose errors, understand marketing effectiveness, and prevent abuse.",
        "Comply with law, enforce our Terms of Service, and protect the rights and safety of CapSignal, our users, and others.",
      ],
    },
    {
      id: "legal-bases",
      title: "4. Legal bases (EEA, UK, and Switzerland)",
      paragraphs: [
        "Where GDPR or similar laws apply, we rely on: (a) performance of a contract when providing the Service you signed up for; (b) legitimate interests for analytics, security, and product improvement, balanced against your rights; (c) consent where required for non-essential cookies or marketing; and (d) legal obligation where we must retain or disclose data.",
      ],
    },
    {
      id: "sharing",
      title: "5. How we share information",
      paragraphs: [
        "We do not sell personal information. We do not share campaign data, investor contacts, or raise materials with third parties for their independent marketing.",
        "We share information with service providers that help us run the Service, subject to contractual confidentiality and security obligations. Current categories include:",
      ],
      list: [
        "Hosting and infrastructure (e.g., Vercel, cloud storage providers)",
        "Payment processing (Stripe)",
        "Email delivery and notifications (e.g., Resend)",
        "Analytics and advertising measurement (e.g., Google Tag Manager, Meta Pixel, Microsoft Clarity — only when enabled in your environment)",
        "Customer support and CRM tools we may use to respond to leads",
      ],
    },
    {
      id: "campaign-data",
      title: "6. Campaign and raise data",
      paragraphs: [
        "Fundraising data — including investor relationships, outreach sequences, reply tracking, and diligence files — is processed solely to deliver the Service on your behalf.",
        "You control which investors receive outreach and which documents are shared. CapSignal team members may access campaign data only as needed for support, deliverability troubleshooting, or security review.",
        "Upon account closure or a verified deletion request, we delete or anonymize campaign data within 30 days unless we must retain a limited subset for billing, legal, or dispute-resolution purposes.",
      ],
    },
    {
      id: "analytics-sessions",
      title: "7. Website analytics and session reports",
      paragraphs: [
        "On our marketing site, we log page views, navigation paths, scroll depth, CTA clicks, and related events in your browser session. When you leave a page, we may send an internal session summary email to our team so we can follow up on interest in the product.",
        "Session reports may include landing page, referrer, UTM tags, pages visited, events triggered, session length, and browser user-agent. They do not include passwords or full payment card numbers.",
        "You can limit some tracking through cookie settings (see our Cookie Policy) or browser controls. Essential cookies required for checkout and authentication may still be used.",
      ],
    },
    {
      id: "retention",
      title: "8. Data retention",
      paragraphs: [
        "We retain account and campaign data while your subscription is active and for a reasonable period afterward to support exports, billing reconciliation, and legal obligations.",
        "Marketing lead data from forms is retained until you ask us to delete it or it is no longer needed for the purpose collected.",
        "Analytics and server logs are typically retained for 12–24 months unless a shorter period is required by law or internal policy.",
      ],
    },
    {
      id: "security",
      title: "9. Security",
      paragraphs: [
        "We use encryption in transit (TLS), encryption at rest for sensitive campaign data, access controls, and monitoring designed to protect your information. No method of transmission or storage is completely secure; please use a strong password and enable team access controls where available.",
        "See our Security page for more detail on our technical and organizational measures.",
      ],
    },
    {
      id: "rights",
      title: "10. Your rights and choices",
      paragraphs: ["Depending on where you live, you may have the right to:"],
      list: [
        "Access, correct, or delete personal information we hold about you",
        "Export data you provided through the Service",
        "Object to or restrict certain processing",
        "Withdraw consent where processing is consent-based",
        "Lodge a complaint with your local data protection authority",
      ],
      afterList: [
        'California residents may have additional rights under the CCPA/CPRA, including the right to know what categories of information we collect and to opt out of "sale" or "sharing" as defined by California law. CapSignal does not sell personal information.',
        `Submit privacy requests to ${email}. We may verify your identity before fulfilling a request.`,
      ],
    },
    {
      id: "international",
      title: "11. International transfers",
      paragraphs: [
        "CapSignal is operated from the United States. If you access the Service from outside the U.S., your information may be transferred to, stored in, and processed in the U.S. and other countries where our providers operate.",
        "Where required, we use appropriate safeguards such as Standard Contractual Clauses for transfers from the EEA or UK.",
      ],
    },
    {
      id: "children",
      title: "12. Children",
      paragraphs: [
        "The Service is intended for founders and business professionals. We do not knowingly collect personal information from anyone under 16. Contact us if you believe a child has provided information and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "13. Changes to this policy",
      paragraphs: [
        'We may update this Privacy Policy from time to time. We will post the revised version on this page and update the "Last updated" date. Material changes may also be communicated by email or in-product notice where appropriate.',
      ],
    },
  ],
  contactNote: `Privacy questions or requests: ${email}. Security concerns: security@getcapsignal.com.`,
};

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  description: "Terms governing use of the CapSignal platform and website.",
  lastUpdated: "June 28, 2026",
  intro: `These Terms of Service ("Terms") are a binding agreement between you and CapSignal governing access to ${url} and our investor matching, outreach, analytics, and related services (the "Service"). If you do not agree, do not use the Service.`,
  sections: [
    {
      id: "eligibility",
      title: "1. Eligibility and account",
      paragraphs: [
        "You must be at least 18 years old and authorized to bind any company you represent. You are responsible for maintaining accurate account information and safeguarding login credentials.",
        "You may not create accounts through automated means, impersonate others, or share access in ways that violate these Terms or applicable law.",
      ],
    },
    {
      id: "service",
      title: "2. The Service",
      paragraphs: [
        "CapSignal provides software and related services to help founders identify relevant investors, run thesis-aware outreach, track campaign performance, and manage raise materials.",
        "Features may change over time. We may add, modify, or discontinue functionality with reasonable notice when the change materially affects paid subscribers.",
        "Certain deliverability, reply-rate, and meeting outcomes depend on your sector, stage, list quality, messaging, and market conditions. CapSignal does not guarantee fundraising success.",
      ],
    },
    {
      id: "trial-billing",
      title: "3. Free trial, subscription, and billing",
      paragraphs: [
        `Self-serve plans include a ${selfServePricing.trialDays}-day free trial when offered at checkout. Unless you cancel before the trial ends, your payment method on file will be charged ${selfServePricing.priceFull} ${selfServePricing.period} (plus applicable taxes) and will renew automatically each billing period until cancelled.`,
        "Payments are processed by Stripe. By subscribing, you authorize us and Stripe to charge your payment method for recurring fees and any applicable taxes.",
        "You may cancel from account settings or by emailing support before the next renewal date. Cancellation stops future charges; access generally continues through the end of the paid period unless otherwise stated.",
        "Fees are non-refundable except where required by law. Failed payments may result in suspension until resolved.",
      ],
    },
    {
      id: "your-data",
      title: "4. Your content and data",
      paragraphs: [
        'You retain ownership of decks, investor lists, messages, metrics, and other materials you upload or create ("Customer Content").',
        "You grant CapSignal a limited license to host, process, transmit, and display Customer Content solely to provide and improve the Service, troubleshoot issues, and comply with law.",
        "You represent that you have all rights needed to use and share Customer Content through CapSignal, including consent or lawful basis to contact investors and comply with anti-spam and privacy laws.",
      ],
    },
    {
      id: "acceptable-use",
      title: "5. Acceptable use",
      paragraphs: ["You agree not to:"],
      list: [
        'Send unlawful, deceptive, or unsolicited bulk email ("spam") or violate CAN-SPAM, GDPR, CASL, or similar regulations',
        "Misrepresent your company, traction, investors, or raise terms",
        "Upload malware, scrape the Service in violation of our robots rules, or attempt unauthorized access",
        "Use the Service to harass individuals or distribute hate, violence, or illegal content",
        "Resell or white-label the Service without written permission",
        "Reverse engineer the Service except where prohibited by law",
      ],
    },
    {
      id: "email-compliance",
      title: "6. Outreach and email compliance",
      paragraphs: [
        "You are responsible for the content of messages sent through or in connection with CapSignal, including accurate sender identification, working unsubscribe mechanisms where required, and honoring opt-out requests promptly.",
        "We may throttle send volume, pause campaigns, or suspend accounts that threaten domain reputation, generate excessive complaints, or appear to violate email or securities laws.",
      ],
    },
    {
      id: "third-party",
      title: "7. Third-party services",
      paragraphs: [
        "The Service integrates with third parties such as Stripe, email providers, and analytics tools. Your use of those services may be subject to their terms. CapSignal is not responsible for third-party outages or policies outside our control.",
      ],
    },
    {
      id: "ip",
      title: "8. CapSignal intellectual property",
      paragraphs: [
        "CapSignal owns the Service, software, branding, documentation, and underlying technology, excluding Customer Content. You may not copy, modify, or create derivative works except as allowed by these Terms or written permission.",
      ],
    },
    {
      id: "confidentiality",
      title: "9. Confidentiality",
      paragraphs: [
        "Each party may receive confidential information from the other. You agree not to disclose non-public CapSignal product details; we treat your non-public raise materials as confidential and use them only as described in our Privacy Policy.",
      ],
    },
    {
      id: "disclaimers",
      title: "10. Disclaimers",
      paragraphs: [
        'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAPSIGNAL DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        "CapSignal does not provide legal, tax, or investment advice. Matching investors or facilitating outreach does not constitute an endorsement of any investor or offering.",
      ],
    },
    {
      id: "liability",
      title: "11. Limitation of liability",
      paragraphs: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAPSIGNAL AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, DATA, OR GOODWILL.",
        "OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICE IS LIMITED TO THE GREATER OF (A) AMOUNTS YOU PAID TO CAPSIGNAL IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100).",
        "Some jurisdictions do not allow certain limitations; in those cases our liability is limited to the fullest extent permitted by law.",
      ],
    },
    {
      id: "indemnity",
      title: "12. Indemnification",
      paragraphs: [
        "You will defend and indemnify CapSignal against claims, damages, and expenses (including reasonable attorneys' fees) arising from Customer Content, your outreach, your violation of these Terms, or your violation of applicable law.",
      ],
    },
    {
      id: "termination",
      title: "13. Termination",
      paragraphs: [
        "You may stop using the Service and cancel your subscription at any time. We may suspend or terminate access if you breach these Terms, create legal or deliverability risk, or fail to pay fees.",
        "Sections that by nature should survive termination — including payment obligations, disclaimers, limitation of liability, indemnity, and governing law — will survive.",
      ],
    },
    {
      id: "disputes",
      title: "14. Governing law and disputes",
      paragraphs: [
        "These Terms are governed by the laws of the State of Delaware, USA, excluding conflict-of-law rules. Except where prohibited, exclusive jurisdiction for disputes will be the state or federal courts located in Delaware, and you consent to personal jurisdiction there.",
        "Before filing a formal claim, please contact us at " + support + " so we can try to resolve the issue informally.",
      ],
    },
    {
      id: "changes-terms",
      title: "15. Changes",
      paragraphs: [
        "We may update these Terms. Continued use after the effective date of revised Terms constitutes acceptance. If you disagree with a material change, cancel your subscription before the change takes effect.",
      ],
    },
  ],
  contactNote: `Questions about these Terms: ${support}. General inquiries: ${email}.`,
};

export const cookiePolicy: LegalDocument = {
  title: "Cookie Policy",
  description: "How CapSignal uses cookies and similar technologies.",
  lastUpdated: "June 28, 2026",
  intro: `This Cookie Policy explains how CapSignal uses cookies, local storage, session storage, and similar technologies on ${url}. It should be read together with our Privacy Policy.`,
  sections: [
    {
      id: "what",
      title: "1. What are cookies?",
      paragraphs: [
        "Cookies are small text files stored on your device. Session storage and local storage are similar browser mechanisms that persist data for a browsing session or longer. Pixels and tags are small code snippets that help us measure visits and conversions.",
      ],
    },
    {
      id: "types",
      title: "2. Cookies we use",
      paragraphs: ["We group cookies and similar technologies as follows:"],
      list: [
        "Strictly necessary — required for security, checkout, authentication, load balancing, and remembering cookie preferences. These cannot be disabled through our site without breaking core functionality.",
        "Functional — remember choices such as dismissed banners or onboarding progress within a session.",
        "Analytics — help us understand traffic sources, page performance, scroll depth, and feature interest. We may use first-party session logs and, when configured, Google Tag Manager, Microsoft Clarity, or similar tools.",
        "Advertising — when enabled, Meta Pixel or comparable tags may measure ad effectiveness and build aggregated audiences. We do not use advertising cookies to sell your campaign or investor data.",
      ],
    },
    {
      id: "session-reports",
      title: "3. Session logging",
      paragraphs: [
        "On marketing pages, we store anonymized or pseudonymous session events in sessionStorage (for example: pages viewed, button clicks, scroll milestones). When you close or leave the tab, we may transmit a session summary to our team via email so we can respond to product interest.",
        "This processing is based on our legitimate interest in understanding how visitors use the site and following up on inbound interest, balanced against your privacy rights.",
      ],
    },
    {
      id: "third-party",
      title: "4. Third-party cookies",
      paragraphs: [
        "Stripe may set cookies during checkout. Analytics and advertising partners may set their own cookies when their scripts are loaded. Those providers process data under their own policies.",
      ],
    },
    {
      id: "manage",
      title: "5. Managing preferences",
      paragraphs: [
        "You can block or delete cookies through your browser settings. Blocking all cookies may prevent checkout, login, or saved preferences from working correctly.",
        "Where we present a cookie banner, you can accept or reject non-essential categories. You can change your choice later by clearing site data or contacting us.",
        "To opt out of certain analytics providers: Google Analytics opt-out browser add-on; Microsoft Clarity — adjust browser tracking settings; Meta — visit Meta's ad preferences center.",
      ],
    },
    {
      id: "updates",
      title: "6. Updates",
      paragraphs: [
        'We may update this Cookie Policy when we add or remove tracking tools. Check the "Last updated" date at the top of this page.',
      ],
    },
  ],
  contactNote: `Cookie questions: ${email}.`,
};
