import { type ActionType, type DealerUpcard, type GameMode, type PlayerHand, type RecommendationType } from '@/lib/types';

export function getPlaceholderAction(mode: GameMode, playerHand: PlayerHand, dealerUpcard: DealerUpcard): ActionType {
  void mode;
  void playerHand;
  void dealerUpcard;
  return 'stand';
}

export function getPlaceholderRecommendation(
  mode: GameMode,
  playerHand: PlayerHand,
  dealerUpcard: DealerUpcard,
): RecommendationType {
  const primaryAction = getPlaceholderAction(mode, playerHand, dealerUpcard);

  return {
    primaryAction,
    reason: 'Strategy engine not implemented yet.',
  };
}
