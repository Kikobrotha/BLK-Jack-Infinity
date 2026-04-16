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

const REGULAR_MODE_CONFIG: BlackjackModeConfig = {
  id: 'regular',
  label: 'Regular Blackjack',
  shortDescription: 'Standard blackjack rules profile.',
  rulesConfig: {
    deckCount: 6,
    dealerHitsSoft17: false,
    doubleAfterSplit: true,
    surrenderAllowed: true,
  },
};

const INFINITY_MODE_ASSUMPTIONS: BlackjackModeConfig['rulesConfig'] = {
  deckCount: 8,
  dealerHitsSoft17: true,
  doubleAfterSplit: true,
  surrenderAllowed: false,
};

export const BLACKJACK_MODES: readonly BlackjackModeConfig[] = [
  REGULAR_MODE_CONFIG,
  {
    ...REGULAR_MODE_CONFIG,
    id: 'infinity',
    label: 'Infinity Blackjack',
    shortDescription: 'Infinity blackjack profile built from regular rules plus Infinity-only assumptions.',
    rulesConfig: INFINITY_MODE_ASSUMPTIONS,
  },
] as const;

export const BLACKJACK_MODE_MAP: Record<GameMode, BlackjackModeConfig> = {
  regular: BLACKJACK_MODES[0],
  infinity: BLACKJACK_MODES[1],
};
