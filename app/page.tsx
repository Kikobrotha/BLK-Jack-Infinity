'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import CardPicker from '@/components/blackjack/CardPicker';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { evaluateHand } from '@/lib/blackjack/handEvaluator';
import { calculateCountState } from '@/lib/blackjack/counting';
import { BLACKJACK_MODE_MAP, BLACKJACK_MODES } from '@/lib/blackjack/modes';
import type { CardRank } from '@/lib/blackjack/types';
import { DEFAULT_MODE } from '@/lib/modes';

const MAX_PLAYER_CARDS = 6;
const MAX_EXPOSED_CARDS = 20;

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
  const [exposedCards, setExposedCards] = useState<CardRank[]>([]);

  const selectedModeConfig = useMemo(() => BLACKJACK_MODE_MAP[selectedMode], [selectedMode]);
  const playerHandValue = useMemo(() => evaluateHand(playerCards), [playerCards]);
  const playerSoftHardLabel = playerCards.length === 0 ? '—' : playerHandValue.isSoft ? 'Soft' : 'Hard';
  const playerPairLabel = playerCards.length < 2 ? 'N/A (need 2 cards)' : playerHandValue.canSplit ? 'Pair' : 'Not a pair';

  const countCards = useMemo(() => [...playerCards, ...dealerUpcard, ...exposedCards], [playerCards, dealerUpcard, exposedCards]);
  const countState = useMemo(
    () => calculateCountState(countCards, selectedModeConfig.rulesConfig.deckCount),
    [countCards, selectedModeConfig.rulesConfig.deckCount]
  );

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Baccarat-Oracle-style shell adapted for blackjack assistant workflows."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ModeSelector
          selectedMode={selectedMode}
          modes={BLACKJACK_MODES}
          onModeChange={setSelectedMode}
          helperText="Select a ruleset profile for assistant context. Strategy and deviation logic are intentionally placeholder-only."
        />

        <InfoPanel
          title="Count Info"
          description="Live Hi-Lo count context from entered exposed cards."
        >
          <p className="text-sm text-slate-300">
            Current mode: <span className="font-medium text-slate-100">{selectedModeConfig.label}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">Running count: {countState.runningCount}</p>
          <p className="mt-1 text-sm text-slate-400">Estimated decks remaining: {countState.decksRemaining}</p>
          <p className="mt-1 text-sm text-slate-400">True count: {countState.trueCount}</p>
          <p className="mt-1 text-xs text-slate-500">Based on exposed cards entered across player, dealer upcard, and seen cards.</p>
        </InfoPanel>

        <CardPicker
          title="Player Hand"
          cards={playerCards}
          onAddCard={rank => setPlayerCards(prev => addCardWithCap(prev, rank, MAX_PLAYER_CARDS))}
          onUndoCard={() => setPlayerCards(prev => removeLastCard(prev))}
          maxCards={MAX_PLAYER_CARDS}
        />

        <InfoPanel title="Player Hand Panel" description="Placeholder summary of the entered player hand.">
          <p className="text-sm text-slate-300">
            Cards entered: <span className="font-medium text-slate-100">{playerCards.length}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">Hand total: {playerHandValue.total}</p>
          <p className="mt-1 text-sm text-slate-400">Soft / hard status: {playerSoftHardLabel}</p>
          <p className="mt-1 text-sm text-slate-400">Pair status: {playerPairLabel}</p>
          <p className="mt-1 text-xs text-slate-500">
            Blackjack: {playerHandValue.isBlackjack ? 'Yes' : 'No'} · Bust: {playerHandValue.isBust ? 'Yes' : 'No'}
          </p>
        </InfoPanel>

        <CardPicker
          title="Dealer Upcard"
          cards={dealerUpcard}
          onAddCard={rank => setDealerUpcard([rank])}
          onUndoCard={() => setDealerUpcard([])}
          maxCards={1}
        />

        <InfoPanel title="Dealer Upcard Panel" description="Placeholder view for dealer upcard context.">
          <p className="text-sm text-slate-300">
            Upcard selected:{' '}
            <span className="font-medium text-slate-100">{dealerUpcard.length ? dealerUpcard[0] : 'None'}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">Dealer hand resolution is intentionally not implemented yet.</p>
        </InfoPanel>

        <CardPicker
          title="Seen / Exposed Cards (Optional)"
          cards={exposedCards}
          onAddCard={rank => setExposedCards(prev => addCardWithCap(prev, rank, MAX_EXPOSED_CARDS))}
          onUndoCard={() => setExposedCards(prev => removeLastCard(prev))}
          maxCards={MAX_EXPOSED_CARDS}
        />

        <InfoPanel
          title="Seen Cards Panel"
          description="Visible cards for counting context input."
        >
          <p className="text-sm text-slate-300">
            Exposed cards entered: <span className="font-medium text-slate-100">{exposedCards.length}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400 break-words">
            Cards: {exposedCards.length ? exposedCards.join(' · ') : 'None'}
          </p>
        </InfoPanel>

        <InfoPanel
          title="Recommendation"
          description="Assistant recommendation panel (placeholder only, not a predictor)."
          className="lg:col-span-2"
        >
          <p className="text-sm text-slate-300">Base action: —</p>
          <p className="mt-1 text-sm text-slate-300">Final action: —</p>
          <p className="mt-1 text-sm text-slate-400">Rationale: This shell is ready for future assistant guidance wiring.</p>
          <p className="mt-1 text-xs text-slate-500">
            This interface is an assistant scaffold and does not provide predictive or guaranteed outcomes.
          </p>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
