import { type GameMode } from '@/lib/types';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatModeLabel(mode: GameMode): string {
  if (mode === 'infinity') return 'Infinity';
  return 'Regular';
}

export function formatModelLabel(mode: GameMode): string {
  return formatModeLabel(mode);
}
