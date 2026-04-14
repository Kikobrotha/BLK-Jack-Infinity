import { type Card, type Hand } from '@/lib/types';

export function createEmptyHand(): Hand {
  return {
    cards: [],
    total: 0,
    isSoft: false,
  };
}

export function buildHand(cards: Card[]): Hand {
  return {
    cards,
    total: 0,
    isSoft: false,
  };
}
