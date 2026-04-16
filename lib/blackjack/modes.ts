import { type GameMode } from '@/lib/types';

export type BlackjackModeConfig = {
  id: GameMode;
  label: string;
  shortDescription: string;
  rulesConfig: {
    deckCount: number;
    dealerHitsSoft17: boolean;
    doubleAfterSplit: boolean;
    surrenderAllowed: boolean;
  };
};

export const BLACKJACK_MODES: readonly BlackjackModeConfig[] = [
  {
    id: 'regular',
    label: 'Regular Blackjack',
    shortDescription: 'Standard blackjack table profile placeholder.',
    rulesConfig: {
      deckCount: 6,
      dealerHitsSoft17: false,
      doubleAfterSplit: true,
      surrenderAllowed: true,
    },
  },
  {
    id: 'infinity',
    label: 'Infinity Blackjack',
    shortDescription: 'Infinity blackjack table profile placeholder.',
    rulesConfig: {
      deckCount: 8,
      dealerHitsSoft17: true,
      doubleAfterSplit: true,
      surrenderAllowed: false,
    },
  },
] as const;

export const BLACKJACK_MODE_MAP: Record<GameMode, BlackjackModeConfig> = {
  regular: BLACKJACK_MODES[0],
  infinity: BLACKJACK_MODES[1],
};
