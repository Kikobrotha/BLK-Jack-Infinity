import { BlackjackMode, Ruleset } from './types';

const RULES: Record<BlackjackMode, Ruleset> = {
  regular: {
    mode: 'regular',
    label: 'Regular Blackjack',
    decks: 6,
    dealerHitsSoft17: false,
    doubleAfterSplit: true,
    surrender: true,
    blackjackPayout: '3:2',
  },
  infinity: {
    mode: 'infinity',
    label: 'Infinity Blackjack',
    decks: 8,
    dealerHitsSoft17: true,
    doubleAfterSplit: true,
    surrender: false,
    blackjackPayout: '3:2',
  },
};

export function getRuleset(mode: BlackjackMode): Ruleset {
  return RULES[mode];
}

export const blackjackModes: { value: BlackjackMode; label: string }[] = [
  { value: 'regular', label: RULES.regular.label },
  { value: 'infinity', label: RULES.infinity.label },
];
