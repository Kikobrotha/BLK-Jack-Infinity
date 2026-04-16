import { BLACKJACK_MODE_MAP } from '@/lib/blackjack/modes';
import { type GameMode } from '@/lib/types';

export function getModeDescription(mode: GameMode): string {
  return BLACKJACK_MODE_MAP[mode].shortDescription;
}
