export type NormalizedFirm = {
  externalId: string;
  name: string;
  website?: string;
  firmType: string;
  hqCity?: string;
  hqCountry?: string;
  checkMinUsd?: number;
  checkMaxUsd?: number;
  stages: string[];
  sectors: string[];
  geos: string[];
  description?: string;
  cik?: string;
  secAdvId?: string;
  investments?: NormalizedInvestment[];
  people?: NormalizedPerson[];
  metadata?: Record<string, unknown>;
};

export type NormalizedInvestment = {
  companyName: string;
  companySector?: string;
  companyStage?: string;
  announcedAt?: Date;
  amountUsd?: number;
  isLead?: boolean;
  sourceUrl?: string;
  sourceType: string;
};

export type NormalizedPerson = {
  name: string;
  title?: string;
  isPartner?: boolean;
  linkedInUrl?: string;
};

export type ConnectorResult = {
  externalId: string;
  raw: unknown;
  normalized: NormalizedFirm;
};

export type DataConnector = {
  key: string;
  name: string;
  description: string;
  priority: number;
  fetch: (options?: { limit?: number; since?: Date }) => Promise<ConnectorResult[]>;
};

export type RaiseContext = {
  stage: string;
  sector: string;
  checkSizeMin?: number;
  checkSizeMax?: number;
  geographies?: string[];
  thesis?: string;
};

export type MatchResult = {
  firmId: string;
  firmName: string;
  matchScore: number;
  rationale: string;
  signals: { type: string; score: number; rationale: string }[];
  topPartner?: string;
};
