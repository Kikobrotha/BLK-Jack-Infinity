import { CardRank, HandValue } from './types';

const TEN_VALUE_RANKS: CardRank[] = ['10', 'J', 'Q', 'K'];

export function rankValue(rank: CardRank): number {
  if (rank === 'A') return 11;
  if (TEN_VALUE_RANKS.includes(rank)) return 10;
  return Number(rank);
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
  let aces = cards.filter(card => card === 'A').length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const isSoft = cards.includes('A') && total <= 21 && aces > 0;
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
