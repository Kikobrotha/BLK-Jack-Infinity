export function roadAgreementScore(roads: {
  big: 'Player' | 'Banker' | 'Neutral';
  eye: 'Player' | 'Banker' | 'Neutral';
  small: 'Player' | 'Banker' | 'Neutral';
  cockroach: 'Player' | 'Banker' | 'Neutral';
}) {
  const values = Object.values(roads).filter(r => r !== 'Neutral');

  if (values.length < 2) return 0;

  const counts = values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {});

  const max = Math.max(...Object.values(counts));
  return max / 4; // 0 → 1
}
