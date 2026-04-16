export type CardSuit = 'clubs' | 'diamonds' | 'hearts' | 'spades';

export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
  rank: CardRank;
  suit?: CardSuit;
};

export type GameMode = 'regular' | 'infinity';

export type PlayerAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender';

export type Hand = {
  cards: Card[];
  total: number;
  isSoft: boolean;
};

export type Recommendation = {
  primaryAction: PlayerAction;
  reason: string;
};
