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

const INFINITY_MODE_CONFIG: BlackjackModeConfig = {
  id: 'infinity',
  label: 'Infinity Blackjack',
  shortDescription: 'Infinity blackjack rules profile with placeholder defaults for future engine wiring.',
  rulesConfig: {
    deckCount: 8,
    dealerHitsSoft17: true,
    doubleAfterSplit: true,
    surrenderAllowed: false,
  },
};

export const BLACKJACK_MODES: readonly BlackjackModeConfig[] = [REGULAR_MODE_CONFIG, INFINITY_MODE_CONFIG] as const;

export const BLACKJACK_MODE_MAP: Record<GameMode, BlackjackModeConfig> = {
  regular: REGULAR_MODE_CONFIG,
  infinity: INFINITY_MODE_CONFIG,
};
