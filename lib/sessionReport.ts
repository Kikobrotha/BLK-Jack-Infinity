export function generateSessionReport(hands: {
  ev: number;
  played: boolean;
}[]) {
  const avgEV =
    hands.reduce((s, h) => s + h.ev, 0) / hands.length;

  const playable = hands.filter(h => h.ev > 0).length;

  return {
    hands: hands.length,
    avgEV: avgEV.toFixed(3),
    playableRate: Math.round((playable / hands.length) * 100),
  };
}
