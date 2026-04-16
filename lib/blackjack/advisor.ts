import { cardLabel, evaluateHand, isPair } from './handEvaluator';
import { getRuleset } from './rules';
import { recommendAction } from './strategy';
import { AdviceResult, BlackjackMode, CardRank, InsuranceGuidance, StrategyHandType } from './types';

function fallbackFor(action: AdviceResult['primaryAction']): AdviceResult['fallbackAction'] {
  if (action === 'Double' || action === 'Split' || action === 'Surrender') {
    return 'Hit';
  }

  return undefined;
}

function classifyHand(playerCards: CardRank[]): StrategyHandType {
  const hand = evaluateHand(playerCards);

  if (hand.isBlackjack) return 'blackjack';
  if (hand.isBust) return 'bust';
  if (isPair(playerCards)) return 'pair';
  if (hand.isSoft) return 'soft';
  return 'hard';
}

function insuranceGuidance(dealerUpcard: CardRank): InsuranceGuidance {
  if (dealerUpcard === 'A') {
    return {
      shouldOffer: true,
      recommendation: 'NoInsurance',
      rationale:
        'Insurance should be declined in a basic-strategy assistant because it is a side bet with negative expectation without count deviations.',
    };
  }

  return {
    shouldOffer: false,
    recommendation: 'NoInsurance',
    rationale: 'Insurance is not available because the dealer upcard is not an Ace.',
  };
}

export function getBlackjackAdvice(mode: BlackjackMode, playerCards: CardRank[], dealerUpcard: CardRank): AdviceResult {
  const ruleset = getRuleset(mode);
  const handValue = evaluateHand(playerCards);
  const primaryAction = recommendAction(playerCards, dealerUpcard, ruleset);
  const fallbackAction = fallbackFor(primaryAction);
  const handType = classifyHand(playerCards);
  const insurance = insuranceGuidance(dealerUpcard);

  const softness = handValue.isSoft ? 'soft' : 'hard';
  const rationale = `In ${ruleset.label}, with a ${softness} ${handValue.total} versus dealer ${cardLabel(
    dealerUpcard,
  )}, the baseline basic-strategy play is ${primaryAction}${fallbackAction ? ` (fallback: ${fallbackAction})` : ''}.`;

  return {
    primaryAction,
    fallbackAction,
    rationale,
    handValue,
    handType,
    insurance,
  };
}
