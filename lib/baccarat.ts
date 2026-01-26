import { Card } from './shoe';

const value: Record<Card, number> = {
  A: 1,
  '2': 2, '3': 3, '4': 4, '5': 5,
  '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 0, J: 0, Q: 0, K: 0,
};

export function handTotal(cards: Card[]): number {
  return cards.reduce((s, c) => s + value[c], 0) % 10;
}
