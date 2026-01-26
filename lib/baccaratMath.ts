export type BetAction = "PLAYER" | "BANKER" | "SKIP";

export function calculateEdge(
  playerWins: number,
  bankerWins: number
) {
  const total = playerWins + bankerWins;
  if (total === 0) return 0;

  // Simple empirical bias (NOT prediction)
  return (bankerWins - playerWins) / total;
}

export function calculateVolatility(
  recentResults: BetAction[]
) {
  if (recentResults.length < 5) return 0;

  let switches = 0;
  for (let i = 1; i < recentResults.length; i++) {
    if (recentResults[i] !== recentResults[i - 1]) {
      switches++;
    }
  }
  return switches / (recentResults.length - 1);
}
