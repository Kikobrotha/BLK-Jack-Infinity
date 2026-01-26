import { Shoe } from './shoe';

export function calculateEV(shoe: Shoe) {
  let bankerBias = 0;
  let playerBias = 0;

  for (const [card, count] of Object.entries(shoe)) {
    if (['A','2','3','4'].includes(card)) bankerBias += count;
    if (['6','7','8','9'].includes(card)) playerBias += count;
  }

  const edge = (playerBias - bankerBias) / 1000;
  const playerEV = edge;
  const bankerEV = edge - 0.01;

  return {
    best:
      bankerEV > playerEV
        ? { side: 'BANKER' as const, ev: bankerEV }
        : { side: 'PLAYER' as const, ev: playerEV },
  };
}
