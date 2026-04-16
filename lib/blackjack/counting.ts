import type { CardRank, CountState } from '@/lib/blackjack/types';

const CARDS_PER_DECK = 52;
const MIN_DECKS_REMAINING = 0.25;

const HI_LO_VALUES: Record<CardRank, number> = {
  A: -1,
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  J: -1,
  Q: -1,
  K: -1,
};

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateRunningCount(exposedCards: CardRank[]): number {
  return exposedCards.reduce((total, rank) => total + HI_LO_VALUES[rank], 0);
}

export function estimateDecksRemaining(exposedCards: CardRank[], totalDecks: number): number {
  const decksDealt = exposedCards.length / CARDS_PER_DECK;
  const remaining = totalDecks - decksDealt;

  return roundToTwoDecimals(Math.max(MIN_DECKS_REMAINING, remaining));
}

export function calculateCountState(exposedCards: CardRank[], totalDecks: number): CountState {
  const runningCount = calculateRunningCount(exposedCards);
  const decksRemaining = estimateDecksRemaining(exposedCards, totalDecks);
  const trueCount = roundToTwoDecimals(runningCount / decksRemaining);

  return {
    runningCount,
    decksRemaining,
    trueCount,
  };
}
