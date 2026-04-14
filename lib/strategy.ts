import { type GameMode, type Hand, type PlayerAction, type Recommendation } from '@/lib/types';

export function getPlaceholderAction(mode: GameMode, playerHand: Hand, dealerUpcard: string): PlayerAction {
  void mode;
  void playerHand;
  void dealerUpcard;
  return 'stand';
}

export function getPlaceholderRecommendation(mode: GameMode, playerHand: Hand, dealerUpcard: string): Recommendation {
  const primaryAction = getPlaceholderAction(mode, playerHand, dealerUpcard);

  return {
    primaryAction,
    reason: 'Strategy engine not implemented yet.',
  };
}
