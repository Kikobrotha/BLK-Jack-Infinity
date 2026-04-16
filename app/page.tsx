'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import CardPicker from '@/components/blackjack/CardPicker';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { cardLabel, evaluateHand } from '@/lib/blackjack/handEvaluator';
import { getBlackjackAdvice } from '@/lib/blackjack/advisor';
import { BLACKJACK_MODE_MAP, BLACKJACK_MODES } from '@/lib/blackjack/modes';
import type { CardRank } from '@/lib/blackjack/types';
import { DEFAULT_MODE } from '@/lib/modes';

const MAX_PLAYER_CARDS = 6;
const MAX_SEEN_CARDS = 20;

function addCardWithCap(cards: CardRank[], rank: CardRank, maxCards: number): CardRank[] {
  if (cards.length >= maxCards) {
    return cards;
  }
  return [...cards, rank];
}

function removeLastCard(cards: CardRank[]): CardRank[] {
  return cards.slice(0, -1);
}

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState(DEFAULT_MODE);
  const [playerCards, setPlayerCards] = useState<CardRank[]>([]);
  const [dealerUpcard, setDealerUpcard] = useState<CardRank[]>([]);
  const [seenCards, setSeenCards] = useState<CardRank[]>([]);

  const selectedModeConfig = useMemo(() => BLACKJACK_MODE_MAP[selectedMode], [selectedMode]);
  const playerHand = useMemo(() => evaluateHand(playerCards), [playerCards]);
  const dealerCard = dealerUpcard[0];

  const recommendation = useMemo(() => {
    if (playerCards.length < 2 || !dealerCard) {
      return null;
    }

    return getBlackjackAdvice(selectedMode, playerCards, dealerCard);
  }, [dealerCard, playerCards, selectedMode]);

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Minimal assistant shell for hand entry, dealer upcard tracking, and action guidance."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ModeSelector
          selectedMode={selectedMode}
          modes={BLACKJACK_MODES}
          onModeChange={setSelectedMode}
        />

        <InfoPanel title="Count Info" description="Running count placeholders for future assistance logic.">
          <p className="text-sm text-slate-300">
            Current mode: <span className="font-medium text-slate-100">{selectedModeConfig.label}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Placeholder for running count, true count, and decks remaining.
          </p>
        </InfoPanel>

        <CardPicker
          title="Player Cards"
          cards={playerCards}
          onAddCard={rank => setPlayerCards(prev => addCardWithCap(prev, rank, MAX_PLAYER_CARDS))}
          onUndoCard={() => setPlayerCards(prev => removeLastCard(prev))}
          maxCards={MAX_PLAYER_CARDS}
        />

        <InfoPanel title="Player Hand" description="Evaluated from the current player cards.">
          <p className="text-sm text-slate-200">
            Total: <span className="font-semibold text-white">{playerHand.total}</span>
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Hand type:{' '}
            <span className="font-medium text-slate-100">{playerHand.isSoft ? 'Soft' : 'Hard'}</span>
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Pair status:{' '}
            <span className="font-medium text-slate-100">{playerHand.canSplit ? 'Pair (splittable)' : 'Not a pair'}</span>
          </p>
          {playerCards.length > 0 ? (
            <p className="mt-3 text-xs text-slate-400">Entered cards: {playerCards.join(' · ')}</p>
          ) : null}
        </InfoPanel>

        <CardPicker
          title="Dealer Upcard"
          cards={dealerUpcard}
          onAddCard={rank => setDealerUpcard([rank])}
          onUndoCard={() => setDealerUpcard([])}
          maxCards={1}
        />

        <CardPicker
          title="Seen / Exposed Cards (Optional)"
          cards={seenCards}
          onAddCard={rank => setSeenCards(prev => addCardWithCap(prev, rank, MAX_SEEN_CARDS))}
          onUndoCard={() => setSeenCards(prev => removeLastCard(prev))}
          maxCards={MAX_SEEN_CARDS}
        />

        <InfoPanel
          title="Recommendation"
          description="Assistant guidance based on selected mode and current hand."
          className="lg:col-span-2"
        >
          {recommendation ? (
            <div className="space-y-2 text-sm text-slate-200">
              <p>
                Recommended action:{' '}
                <span className="font-semibold text-white">{recommendation.primaryAction}</span>
              </p>
              <p className="text-slate-300">{recommendation.rationale}</p>
              <p>
                Selected mode: <span className="font-medium text-slate-100">{selectedModeConfig.label}</span>
              </p>
              <p>
                Player hand summary:{' '}
                <span className="font-medium text-slate-100">
                  {playerCards.join(' · ')} ({recommendation.handValue.isSoft ? 'Soft' : 'Hard'} {recommendation.handValue.total})
                </span>
              </p>
              <p>
                Dealer upcard summary:{' '}
                <span className="font-medium text-slate-100">{cardLabel(dealerCard)} ({dealerCard})</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Enter at least two player cards and one dealer upcard to see a recommendation.
            </p>
          )}
        </InfoPanel>
      </div>
    </AppShell>
  );
}
