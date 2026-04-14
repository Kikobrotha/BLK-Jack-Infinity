import { cardLabel, evaluateHand } from './handEvaluator';
import { getRuleset } from './rules';
import { recommendAction } from './strategy';
import { AdviceResult, BlackjackMode, CardRank } from './types';

function fallbackFor(action: AdviceResult['primaryAction']): AdviceResult['fallbackAction'] {
  if (action === 'Double' || action === 'Split' || action === 'Surrender') {
    return 'Hit';
  }

  return undefined;
}

export function getBlackjackAdvice(mode: BlackjackMode, playerCards: CardRank[], dealerUpcard: CardRank): AdviceResult {
  const ruleset = getRuleset(mode);
  const handValue = evaluateHand(playerCards);
  const primaryAction = recommendAction(playerCards, dealerUpcard, ruleset);
  const fallbackAction = fallbackFor(primaryAction);

  const softness = handValue.isSoft ? 'soft' : 'hard';
  const rationale = `In ${ruleset.label}, with a ${softness} ${handValue.total} versus dealer ${cardLabel(
    dealerUpcard,
  )}, the baseline play is ${primaryAction}${fallbackAction ? ` (fallback: ${fallbackAction})` : ''}.`;

  return {
    primaryAction,
    fallbackAction,
    rationale,
    handValue,
  };
}
