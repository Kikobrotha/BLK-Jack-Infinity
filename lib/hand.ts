import { type Card, type PlayerHand } from '@/lib/types';

export function createEmptyHand(): PlayerHand {
  return {
    cards: [],
    total: 0,
    isSoft: false,
  };
}

export function buildHand(cards: Card[]): PlayerHand {
  return {
    cards,
    total: 0,
    isSoft: false,
  };
}
