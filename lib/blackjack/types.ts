export type BlackjackMode = 'regular' | 'infinity';

export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type PlayerAction = 'Hit' | 'Stand' | 'Double' | 'Split' | 'Surrender';

export interface Ruleset {
  mode: BlackjackMode;
  label: string;
  decks: number;
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  surrender: boolean;
  blackjackPayout: string;
}

export interface HandValue {
  total: number;
  isSoft: boolean;
  isBlackjack: boolean;
  isBust: boolean;
}

export interface AdviceResult {
  primaryAction: PlayerAction;
  fallbackAction?: PlayerAction;
  rationale: string;
  handValue: HandValue;
}
