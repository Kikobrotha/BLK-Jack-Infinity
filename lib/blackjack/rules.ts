import { BlackjackMode, Ruleset } from './types';

const REGULAR_RULESET: Ruleset = {
  mode: 'regular',
  label: 'Regular Blackjack',
  decks: 6,
  dealerHitsSoft17: false,
  doubleAfterSplit: true,
  surrender: true,
  blackjackPayout: '3:2',
};

const RULES: Record<BlackjackMode, Ruleset> = {
  regular: REGULAR_RULESET,
  infinity: {
    ...REGULAR_RULESET,
    mode: 'infinity',
    label: 'Infinity Blackjack',
  },
};

export function getRuleset(mode: BlackjackMode): Ruleset {
  return RULES[mode];
}

export const blackjackModes: { value: BlackjackMode; label: string }[] = [
  { value: 'regular', label: RULES.regular.label },
  { value: 'infinity', label: RULES.infinity.label },
];
