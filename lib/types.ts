export type CardSuit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  rank: CardRank;
  suit?: CardSuit;
};

export type GameMode = 'regular' | 'infinity';

export type PlayerHand = {
  cards: Card[];
  total: number;
  isSoft: boolean;
};

export type DealerUpcard = CardRank | null;

export type ActionType = 'hit' | 'stand' | 'double' | 'split' | 'surrender';

export type RecommendationType = {
  primaryAction: ActionType;
  reason: string;
};

export type CountState = {
  runningCount: number;
  trueCount: number;
  decksRemaining?: number;
};

// Backward-compatible aliases for existing imports.
export type Hand = PlayerHand;
export type PlayerAction = ActionType;
export type Recommendation = RecommendationType;
