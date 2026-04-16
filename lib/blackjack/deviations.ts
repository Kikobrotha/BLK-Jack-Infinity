import { evaluateHand, isPair } from './handEvaluator';
import { CardRank, CountState, PlayerAction } from './types';

interface DeviationRule {
  label: string;
  minTrueCount: number;
  targetAction: PlayerAction;
  matches: (playerCards: CardRank[], dealerUpcard: CardRank, baseAction: PlayerAction) => boolean;
}

export interface DeviationDecision {
  finalAction: PlayerAction;
  deviationApplied: boolean;
  explanation: string;
}

function countValue(rank: CardRank): number {
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) return -1;
  return 0;
}

export function calculateCountState(exposedCards: CardRank[], deckCount: number): CountState {
  const runningCount = exposedCards.reduce((count, rank) => count + countValue(rank), 0);
  const decksSeen = exposedCards.length / 52;
  const decksRemainingRaw = deckCount - decksSeen;
  const decksRemaining = Math.max(0.25, Number(decksRemainingRaw.toFixed(2)));
  const trueCount = Number((runningCount / decksRemaining).toFixed(2));

  return {
    runningCount,
    trueCount,
    decksRemaining,
  };
}

const DEVIATION_RULES: DeviationRule[] = [
  {
    label: 'Hard 16 vs 10',
    minTrueCount: 0,
    targetAction: 'Stand',
    matches: (playerCards, dealerUpcard, baseAction) => {
      if (baseAction !== 'Hit') return false;
      if (dealerUpcard !== '10' && dealerUpcard !== 'J' && dealerUpcard !== 'Q' && dealerUpcard !== 'K') return false;
      const hand = evaluateHand(playerCards);
      return !hand.isSoft && !isPair(playerCards) && hand.total === 16;
    },
  },
  {
    label: 'Hard 15 vs 10',
    minTrueCount: 4,
    targetAction: 'Stand',
    matches: (playerCards, dealerUpcard, baseAction) => {
      if (baseAction !== 'Hit') return false;
      if (dealerUpcard !== '10' && dealerUpcard !== 'J' && dealerUpcard !== 'Q' && dealerUpcard !== 'K') return false;
      const hand = evaluateHand(playerCards);
      return !hand.isSoft && !isPair(playerCards) && hand.total === 15;
    },
  },
  {
    label: 'Hard 10 vs dealer 10',
    minTrueCount: 4,
    targetAction: 'Double',
    matches: (playerCards, dealerUpcard, baseAction) => {
      if (baseAction !== 'Hit') return false;
      if (dealerUpcard !== '10' && dealerUpcard !== 'J' && dealerUpcard !== 'Q' && dealerUpcard !== 'K') return false;
      const hand = evaluateHand(playerCards);
      return !hand.isSoft && !isPair(playerCards) && hand.total === 10;
    },
  },
  {
    label: 'Hard 12 vs 3',
    minTrueCount: 2,
    targetAction: 'Stand',
    matches: (playerCards, dealerUpcard, baseAction) => {
      if (baseAction !== 'Hit' || dealerUpcard !== '3') return false;
      const hand = evaluateHand(playerCards);
      return !hand.isSoft && !isPair(playerCards) && hand.total === 12;
    },
  },
  {
    label: 'Hard 12 vs 2',
    minTrueCount: 3,
    targetAction: 'Stand',
    matches: (playerCards, dealerUpcard, baseAction) => {
      if (baseAction !== 'Hit' || dealerUpcard !== '2') return false;
      const hand = evaluateHand(playerCards);
      return !hand.isSoft && !isPair(playerCards) && hand.total === 12;
    },
  },
];

export function applyCountDeviations(
  playerCards: CardRank[],
  dealerUpcard: CardRank,
  baseAction: PlayerAction,
  countState: CountState,
): DeviationDecision {
  const matchingRule = DEVIATION_RULES.find(rule => rule.matches(playerCards, dealerUpcard, baseAction));

  if (!matchingRule) {
    return {
      finalAction: baseAction,
      deviationApplied: false,
      explanation: 'No count-based deviation rule matched this hand, so baseline basic strategy stands.',
    };
  }

  if (countState.trueCount < matchingRule.minTrueCount) {
    return {
      finalAction: baseAction,
      deviationApplied: false,
      explanation: `${matchingRule.label} only deviates at true count ${matchingRule.minTrueCount} or higher; current true count is ${countState.trueCount}.`,
    };
  }

  return {
    finalAction: matchingRule.targetAction,
    deviationApplied: true,
    explanation: `${matchingRule.label} deviation triggered at true count ${countState.trueCount} (threshold ${matchingRule.minTrueCount}), so switch to ${matchingRule.targetAction}.`,
  };
}
