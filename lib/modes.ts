import { BLACKJACK_MODES } from '@/lib/blackjack/modes';
import { type GameMode } from '@/lib/types';

export const MODES = BLACKJACK_MODES.map(mode => mode.id) as readonly GameMode[];

export const DEFAULT_MODE: GameMode = 'regular';
