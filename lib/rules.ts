import { type GameMode } from '@/lib/types';

const MODE_DESCRIPTIONS: Record<GameMode, string> = {
  regular: 'Standard blackjack rules placeholder.',
  infinity: 'Infinity blackjack-style table rules placeholder.',
};

export function getModeDescription(mode: GameMode): string {
  return MODE_DESCRIPTIONS[mode];
}
