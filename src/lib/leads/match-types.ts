export type MatchPreviewInvestor = {
  firm: string;
  partner: string | null;
  score: number;
  reason: string;
  blurred: boolean;
};

export type MatchPreview = {
  totalMatches: number;
  topInvestors: MatchPreviewInvestor[];
  emptyMessage?: string;
};
