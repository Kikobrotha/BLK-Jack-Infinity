import { type GameMode } from '@/lib/types';

export const MODES = ['regular', 'infinity'] as const satisfies readonly GameMode[];

export const DEFAULT_MODE: GameMode = 'regular';
