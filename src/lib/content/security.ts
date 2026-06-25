export const securityFeatures = [
  {
    title: "Encryption",
    items: [
      "TLS 1.3 in transit for all API and dashboard traffic",
      "AES-256 encryption at rest for campaign and contact data",
      "Encrypted backups with 30-day retention",
    ],
  },
  {
    title: "Access control",
    items: [
      "Role-based access for team members",
      "SSO available on Full Service engagements",
      "Audit log for campaign configuration changes",
    ],
  },
  {
    title: "Email infrastructure",
    items: [
      "SPF, DKIM, and DMARC configuration on your domain",
      "Send volume throttling to protect deliverability",
      "Bounce and complaint monitoring",
    ],
  },
  {
    title: "Data handling",
    items: [
      "Campaign data not sold to third parties",
      "Data deletion on request within 30 days of campaign close",
      "US-based infrastructure (AWS us-east-1)",
    ],
  },
] as const;

export const compliance = [
  { label: "SOC 2 Type I", status: "In progress", target: "Q3 2026" },
  { label: "GDPR", status: "Compliant", target: "—" },
  { label: "CAN-SPAM", status: "Compliant", target: "—" },
] as const;
