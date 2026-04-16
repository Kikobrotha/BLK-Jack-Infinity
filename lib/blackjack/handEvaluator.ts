import { CardRank, HandValue } from './types';

const RANK_VALUE: Record<CardRank, number> = {
  A: 11,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 10,
  Q: 10,
  K: 10,
};

export function rankValue(rank: CardRank): number {
  return RANK_VALUE[rank];
}

export function evaluateHand(cards: CardRank[]): HandValue {
  if (cards.length === 0) {
    return {
      total: 0,
      isSoft: false,
      isBlackjack: false,
      isBust: false,
      canSplit: false,
    };
  }

  let total = cards.reduce((sum, card) => sum + rankValue(card), 0);
  let acesAsEleven = cards.filter(card => card === 'A').length;

  while (total > 21 && acesAsEleven > 0) {
    total -= 10;
    acesAsEleven -= 1;
  }

  const isSoft = acesAsEleven > 0 && total <= 21;
  const isBlackjack = cards.length === 2 && total === 21;

  return {
    total,
    isSoft,
    isBlackjack,
    isBust: total > 21,
    canSplit: isPair(cards),
  };
}

export function isPair(cards: CardRank[]): boolean {
  return cards.length === 2 && cards[0] === cards[1];
}

export function cardLabel(rank: CardRank): string {
  return rank === 'A' ? 'Ace' : rank;
}
