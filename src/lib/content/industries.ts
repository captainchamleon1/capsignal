/** Display label → scoring key used in investor matching engine */
export type IndustryOption = {
  value: string;
  key: string;
  description: string;
  category: string;
};

export const industryCategories = [
  "Software & AI",
  "Financial services",
  "Health & life sciences",
  "Climate & industrial",
  "Consumer & commerce",
  "Media & entertainment",
  "Other",
] as const;

export const industryOptions: IndustryOption[] = [
  { value: "B2B SaaS", key: "b2b_saas", description: "Software sold to businesses", category: "Software & AI" },
  { value: "AI / Machine learning", key: "deep_tech", description: "Foundation models, ML apps, AI infra", category: "Software & AI" },
  { value: "Developer tools", key: "b2b_saas", description: "APIs, dev platforms, infrastructure", category: "Software & AI" },
  { value: "Cybersecurity", key: "b2b_saas", description: "Security, identity, compliance software", category: "Software & AI" },
  { value: "HR / Future of work", key: "b2b_saas", description: "Recruiting, payroll, workforce tools", category: "Software & AI" },
  { value: "Legaltech", key: "b2b_saas", description: "Legal workflow, contract, compliance", category: "Software & AI" },
  { value: "Fintech", key: "fintech", description: "Payments, banking, lending, wealth", category: "Financial services" },
  { value: "Insurtech", key: "fintech", description: "Insurance distribution, underwriting, claims", category: "Financial services" },
  { value: "Web3 / Crypto", key: "fintech", description: "Blockchain, DeFi, digital assets", category: "Financial services" },
  { value: "Proptech", key: "fintech", description: "Real estate, construction, property mgmt", category: "Financial services" },
  { value: "Healthtech", key: "healthtech", description: "Digital health, care delivery, wellness", category: "Health & life sciences" },
  { value: "Biotech / Life sciences", key: "healthtech", description: "Therapeutics, diagnostics, research tools", category: "Health & life sciences" },
  { value: "Medtech / Devices", key: "healthtech", description: "Medical devices, diagnostics hardware", category: "Health & life sciences" },
  { value: "Climate / CleanTech", key: "climate", description: "Energy, carbon, sustainability", category: "Climate & industrial" },
  { value: "Agtech / Food tech", key: "climate", description: "Agriculture, food supply, alt proteins", category: "Climate & industrial" },
  { value: "Deep tech", key: "deep_tech", description: "Novel science, materials, quantum", category: "Climate & industrial" },
  { value: "Hardware / IoT", key: "deep_tech", description: "Connected devices, sensors, robotics", category: "Climate & industrial" },
  { value: "Aerospace / Defense", key: "deep_tech", description: "Aviation, space, defense systems", category: "Climate & industrial" },
  { value: "Logistics / Supply chain", key: "b2b_saas", description: "Freight, warehousing, fulfillment", category: "Climate & industrial" },
  { value: "Manufacturing / Industrial", key: "deep_tech", description: "Factory automation, industrial software", category: "Climate & industrial" },
  { value: "Consumer / DTC", key: "consumer", description: "Direct-to-consumer brands and apps", category: "Consumer & commerce" },
  { value: "Marketplace", key: "consumer", description: "Two-sided platforms and networks", category: "Consumer & commerce" },
  { value: "E-commerce / Retail tech", key: "consumer", description: "Online retail, commerce enablement", category: "Consumer & commerce" },
  { value: "Edtech", key: "b2b_saas", description: "Learning platforms, education software", category: "Consumer & commerce" },
  { value: "Travel / Hospitality", key: "consumer", description: "Hotels, booking, travel experiences", category: "Consumer & commerce" },
  { value: "Sports / Fitness", key: "consumer", description: "Athletics, wellness, fitness apps", category: "Consumer & commerce" },
  { value: "Beauty / Personal care", key: "consumer", description: "Skincare, cosmetics, personal wellness", category: "Consumer & commerce" },
  { value: "Food & Beverage", key: "consumer", description: "Restaurants, CPG brands, beverage", category: "Consumer & commerce" },
  { value: "Parenting / Family", key: "consumer", description: "Family apps, childcare, parenting tools", category: "Consumer & commerce" },
  { value: "Cannabis", key: "consumer", description: "Dispensaries, cannabis tech, compliance", category: "Consumer & commerce" },
  { value: "Gaming / Media", key: "consumer", description: "Games, streaming, interactive media", category: "Media & entertainment" },
  { value: "Creator economy", key: "consumer", description: "Creator tools, UGC platforms, monetization", category: "Media & entertainment" },
  { value: "Adtech / Martech", key: "b2b_saas", description: "Advertising, marketing automation, attribution", category: "Software & AI" },
  { value: "Sales / RevOps", key: "b2b_saas", description: "CRM, sales enablement, revenue ops", category: "Software & AI" },
  { value: "Data / Analytics", key: "b2b_saas", description: "BI, data warehouses, analytics platforms", category: "Software & AI" },
  { value: "RegTech", key: "fintech", description: "Regulatory reporting, compliance automation", category: "Financial services" },
  { value: "Wealthtech", key: "fintech", description: "Robo-advisors, wealth management, trading", category: "Financial services" },
  { value: "Payments infrastructure", key: "fintech", description: "Payment rails, billing, merchant services", category: "Financial services" },
  { value: "Mental health", key: "healthtech", description: "Therapy, behavioral health, psychiatry", category: "Health & life sciences" },
  { value: "Genomics", key: "healthtech", description: "Sequencing, bioinformatics, precision medicine", category: "Health & life sciences" },
  { value: "Pharmaceuticals", key: "healthtech", description: "Drug discovery, pharma software, R&D", category: "Health & life sciences" },
  { value: "EV / Mobility", key: "climate", description: "Electric vehicles, charging, micro-mobility", category: "Climate & industrial" },
  { value: "Renewable energy", key: "climate", description: "Solar, wind, grid, energy storage", category: "Climate & industrial" },
  { value: "Semiconductors", key: "deep_tech", description: "Chips, fabs, semiconductor design", category: "Climate & industrial" },
  { value: "Telecom / Connectivity", key: "deep_tech", description: "5G, satellite, network infrastructure", category: "Climate & industrial" },
  { value: "Construction tech", key: "fintech", description: "Construction mgmt, estimating, field ops", category: "Climate & industrial" },
  { value: "Automotive", key: "deep_tech", description: "Auto software, OEM supply chain, aftermarket", category: "Climate & industrial" },
  { value: "Social impact", key: "b2b_saas", description: "Nonprofit, civic tech, ESG platforms", category: "Other" },
  { value: "GovTech", key: "b2b_saas", description: "Government and public-sector software", category: "Other" },
  { value: "Other", key: "b2b_saas", description: "Doesn't fit the categories above", category: "Other" },
];

export function industryLabelToKey(label: string): string {
  return industryOptions.find((i) => i.value === label)?.key ?? "b2b_saas";
}

export function industryKeyToLabel(key: string): string {
  return industryOptions.find((i) => i.key === key)?.value ?? key.replace(/_/g, " ");
}

export const sectorToKey: Record<string, string> = Object.fromEntries(
  industryOptions.map((i) => [i.value, i.key]),
);

export const keyToSectorLabel: Record<string, string> = {
  b2b_saas: "B2B SaaS",
  fintech: "Fintech",
  healthtech: "Healthtech",
  climate: "Climate / CleanTech",
  deep_tech: "Deep tech",
  consumer: "Consumer",
};
