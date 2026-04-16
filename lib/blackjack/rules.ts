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

// Infinity Blackjack starts from the same basic-strategy baseline as regular blackjack,
// then applies only the assumptions listed here.
const INFINITY_RULE_ASSUMPTIONS: Pick<Ruleset, 'decks' | 'dealerHitsSoft17' | 'surrender'> = {
  decks: 8,
  dealerHitsSoft17: true,
  surrender: false,
};

function buildInfinityRuleset(baseRuleset: Ruleset): Ruleset {
  return {
    ...baseRuleset,
    mode: 'infinity',
    label: 'Infinity Blackjack',
    ...INFINITY_RULE_ASSUMPTIONS,
  };
}

const RULES: Record<BlackjackMode, Ruleset> = {
  regular: REGULAR_RULESET,
  infinity: buildInfinityRuleset(REGULAR_RULESET),
};

export function getRuleset(mode: BlackjackMode): Ruleset {
  return RULES[mode];
}

export const blackjackModes: { value: BlackjackMode; label: string }[] = [
  { value: 'regular', label: RULES.regular.label },
  { value: 'infinity', label: RULES.infinity.label },
];
