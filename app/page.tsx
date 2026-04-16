'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import CardPicker from '@/components/blackjack/CardPicker';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { BLACKJACK_MODE_MAP, BLACKJACK_MODES } from '@/lib/blackjack/modes';
import type { CardRank } from '@/lib/blackjack/types';
import { DEFAULT_MODE } from '@/lib/modes';

const MAX_PLAYER_CARDS = 6;

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

  const selectedModeConfig = useMemo(() => BLACKJACK_MODE_MAP[selectedMode], [selectedMode]);

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
          helperText="Select a ruleset profile for assistant context. Strategy logic is intentionally placeholder-only."
        />

        <InfoPanel
          title="Count Info"
          description="Placeholder panel for running count, true count, and decks remaining."
        >
          <p className="text-sm text-slate-300">
            Current mode: <span className="font-medium text-slate-100">{selectedModeConfig.label}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">Running count: —</p>
          <p className="mt-1 text-sm text-slate-400">True count: —</p>
          <p className="mt-1 text-xs text-slate-500">No counting engine is active in this shell yet.</p>
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
          <p className="mt-1 text-sm text-slate-400">Hand total: —</p>
          <p className="mt-1 text-sm text-slate-400">Soft / hard status: —</p>
          <p className="mt-1 text-xs text-slate-500">Evaluation logic will be connected in a later iteration.</p>
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
