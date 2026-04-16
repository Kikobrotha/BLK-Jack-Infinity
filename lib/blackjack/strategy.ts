import { evaluateHand, isPair } from './handEvaluator';
import { CardRank, PlayerAction, Ruleset } from './types';

function upcardValue(rank: CardRank): number {
  if (rank === 'A') return 11;
  if (['10', 'J', 'Q', 'K'].includes(rank)) return 10;
  return Number(rank);
}

function pairAction(player: CardRank[], dealer: CardRank, ruleset: Ruleset): PlayerAction | null {
  if (!isPair(player)) return null;

  const pair = player[0];
  const dealerValue = upcardValue(dealer);

  if (pair === 'A' || pair === '8') return 'Split';
  if (pair === '10' || pair === 'J' || pair === 'Q' || pair === 'K') return 'Stand';
  if (pair === '9') return [2, 3, 4, 5, 6, 8, 9].includes(dealerValue) ? 'Split' : 'Stand';
  if (pair === '7') return dealerValue <= 7 ? 'Split' : 'Hit';
  if (pair === '6') return dealerValue >= 2 && dealerValue <= 6 ? 'Split' : 'Hit';
  if (pair === '5') return dealerValue >= 2 && dealerValue <= 9 ? 'Double' : 'Hit';
  if (pair === '4') return ruleset.doubleAfterSplit && [5, 6].includes(dealerValue) ? 'Split' : 'Hit';
  if (pair === '3' || pair === '2') return dealerValue >= 2 && dealerValue <= 7 ? 'Split' : 'Hit';

  return null;
}

function softTotalAction(total: number, dealerValue: number): PlayerAction {
  if (total >= 20) return 'Stand';
  if (total === 19) return dealerValue === 6 ? 'Double' : 'Stand';
  if (total === 18) {
    if (dealerValue >= 3 && dealerValue <= 6) return 'Double';
    if ([2, 7, 8].includes(dealerValue)) return 'Stand';
    return 'Hit';
  }
  if (total === 17 || total === 16) return dealerValue >= 4 && dealerValue <= 6 ? 'Double' : 'Hit';
  if (total === 15 || total === 14) return dealerValue >= 5 && dealerValue <= 6 ? 'Double' : 'Hit';
  if (total === 13) return dealerValue >= 5 && dealerValue <= 6 ? 'Double' : 'Hit';

  return 'Hit';
}

function shouldSurrenderHard(total: number, dealerValue: number, ruleset: Ruleset): boolean {
  if (!ruleset.surrender) return false;

  if (total === 16 && [9, 10, 11].includes(dealerValue)) return true;
  if (total === 15 && dealerValue === 10) return true;

  return false;
}

function hardTotalAction(total: number, dealerValue: number, ruleset: Ruleset): PlayerAction {
  if (total >= 17) return 'Stand';

  if (shouldSurrenderHard(total, dealerValue, ruleset)) return 'Surrender';

  if (total >= 13 && total <= 16) return dealerValue <= 6 ? 'Stand' : 'Hit';
  if (total === 12) return dealerValue >= 4 && dealerValue <= 6 ? 'Stand' : 'Hit';
  if (total === 11) return 'Double';
  if (total === 10) return dealerValue <= 9 ? 'Double' : 'Hit';
  if (total === 9) return dealerValue >= 3 && dealerValue <= 6 ? 'Double' : 'Hit';

  return 'Hit';
}

export function recommendAction(player: CardRank[], dealer: CardRank, ruleset: Ruleset): PlayerAction {
  const pairDecision = pairAction(player, dealer, ruleset);
  if (pairDecision) return pairDecision;

  const hand = evaluateHand(player);
  const dealerValue = upcardValue(dealer);

  if (hand.isBlackjack || hand.isBust) return 'Stand';
  if (hand.isSoft) return softTotalAction(hand.total, dealerValue);

  return hardTotalAction(hand.total, dealerValue, ruleset);
}
