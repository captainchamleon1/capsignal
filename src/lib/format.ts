export function formatFundSize(usd?: number | null): string {
  if (!usd) return "Fund size undisclosed";
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B AUM`;
  if (usd >= 1_000_000) return `$${Math.round(usd / 1_000_000)}M fund`;
  return `$${Math.round(usd / 1_000)}K fund`;
}

export function formatCheckSize(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Check size varies";
  const lo = min ? `$${min >= 1_000_000 ? `${(min / 1_000_000).toFixed(1)}M` : `${Math.round(min / 1_000)}K`}` : "?";
  const hi = max ? `$${max >= 1_000_000 ? `${(max / 1_000_000).toFixed(1)}M` : `${Math.round(max / 1_000)}K`}` : "?";
  return `${lo}–${hi} checks`;
}
