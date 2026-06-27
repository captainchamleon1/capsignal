export type MatchPreviewInvestor = {
  firm: string;
  partner: string | null;
  score: number;
  reason: string;
  blurred: boolean;
  fundSize?: string;
  checkSize?: string;
  investments?: string[];
};

export type MatchPreview = {
  /** Profile-specific pool size shown in copy (not the preview row count). */
  estimatedMatches: number;
  databaseSize?: number;
  topInvestors: MatchPreviewInvestor[];
  emptyMessage?: string;
};

export type MatchSearchParams = {
  stage: string;
  sector: string;
  query?: string;
};
