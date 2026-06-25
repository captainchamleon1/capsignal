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

/** Case studies are added only from verified customer outcomes. */
export const caseStudies: CaseStudy[] = [];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
