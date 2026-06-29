export type CaseStudy = {
  slug: string;
  company: string;
  founder: string;
  role: string;
  stage: string;
  sector: string;
  raiseAmount: string;
  headline: string;
  summary: string;
  challenge: string;
  approach: string;
  results: { label: string; value: string }[];
  quote: string;
  timeline: string;
};

import { additionalCaseStudies } from "./customers-additional";

/** Representative case studies for marketing. Metrics are illustrative composites. */
export const caseStudies: CaseStudy[] = [...additionalCaseStudies];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
