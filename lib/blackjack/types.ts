export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type BlackjackMode = 'regular' | 'infinity';

export interface Card {
  rank: CardRank;
}

export interface PlayerHand {
  cards: CardRank[];
}

export interface DealerState {
  upcard: CardRank;
  hand?: CardRank[];
}

export type ActionType = 'Hit' | 'Stand' | 'Double' | 'Split' | 'Surrender';

export interface HandValue {
  total: number;
  isSoft: boolean;
  isBlackjack: boolean;
  isBust: boolean;
  canSplit: boolean;
}

export interface Recommendation {
  primaryAction: ActionType;
  fallbackAction?: ActionType;
  rationale: string;
  handValue: HandValue;
}

export interface CountState {
  runningCount: number;
  trueCount?: number;
  decksRemaining?: number;
}

// Backward-compatible aliases for existing blackjack code paths.
export type PlayerAction = ActionType;
export type AdviceResult = Recommendation;

export interface Ruleset {
  mode: BlackjackMode;
  label: string;
  decks: number;
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  surrender: boolean;
  blackjackPayout: string;
}
