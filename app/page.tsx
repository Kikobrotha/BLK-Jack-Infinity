'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import CardPicker from '@/components/blackjack/CardPicker';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { getBlackjackAdvice } from '@/lib/blackjack/advisor';
import { evaluateHand } from '@/lib/blackjack/handEvaluator';
import { calculateCountState } from '@/lib/blackjack/counting';
import { BLACKJACK_MODE_MAP, BLACKJACK_MODES } from '@/lib/blackjack/modes';
import type { CardRank } from '@/lib/blackjack/types';
import { DEFAULT_MODE } from '@/lib/modes';

const MAX_PLAYER_CARDS = 6;
const MAX_EXPOSED_CARDS = 20;

type MainAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER' | 'INSURANCE' | 'WAITING';

function addCardWithCap(cards: CardRank[], rank: CardRank, maxCards: number): CardRank[] {
  if (cards.length >= maxCards) {
    return cards;
  }
  return [...cards, rank];
}

function removeLastCard(cards: CardRank[]): CardRank[] {
  return cards.slice(0, -1);
}

function actionStyle(mainAction: MainAction): string {
  switch (mainAction) {
    case 'HIT':
      return 'from-amber-400/25 to-amber-900/10 border-amber-300/70 text-amber-100';
    case 'STAND':
      return 'from-emerald-400/25 to-emerald-900/10 border-emerald-300/70 text-emerald-100';
    case 'DOUBLE':
      return 'from-sky-400/25 to-sky-900/10 border-sky-300/70 text-sky-100';
    case 'SPLIT':
      return 'from-violet-400/25 to-violet-900/10 border-violet-300/70 text-violet-100';
    case 'SURRENDER':
      return 'from-rose-400/25 to-rose-900/10 border-rose-300/70 text-rose-100';
    case 'INSURANCE':
      return 'from-cyan-400/25 to-cyan-900/10 border-cyan-300/70 text-cyan-100';
    default:
      return 'from-slate-400/15 to-slate-900/10 border-slate-400/50 text-slate-100';
  }
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

  const recommendationView = useMemo(() => {
    if (playerCards.length === 0 || dealerUpcard.length === 0) {
      return {
        mainAction: 'WAITING' as MainAction,
        shortReason: 'Enter player cards and dealer upcard to get an instant recommendation.',
        baseAction: '—',
        finalAction: '—',
        deviationApplied: false,
        countSummary: `RC ${countState.runningCount} · TC ${countState.trueCount}`,
        playerSummary: playerCards.length ? `${playerCards.join(' · ')} (${playerHandValue.total})` : 'No player cards entered',
        dealerSummary: dealerUpcard.length ? dealerUpcard[0] : 'No dealer upcard entered',
        modeLabel: selectedModeConfig.label,
      };
    }

    const advice = getBlackjackAdvice(selectedMode, playerCards, dealerUpcard[0], countCards);
    const mainAction: MainAction = advice.insurance.shouldOffer ? 'INSURANCE' : advice.finalAction.toUpperCase() as MainAction;
    const shortReason = advice.insurance.shouldOffer
      ? 'Dealer shows Ace: insurance decision available (decline by default strategy).'
      : advice.deviationExplanation;

    return {
      mainAction,
      shortReason,
      baseAction: advice.baseAction.toUpperCase(),
      finalAction: advice.finalAction.toUpperCase(),
      deviationApplied: advice.deviationApplied,
      countSummary: `RC ${advice.countState.runningCount} · TC ${advice.countState.trueCount}`,
      playerSummary: `${playerCards.join(' · ')} · ${advice.handType.toUpperCase()} ${advice.handValue.total}`,
      dealerSummary: `${dealerUpcard[0]} up`,
      modeLabel: selectedModeConfig.label,
    };
  }, [countCards, countState.runningCount, countState.trueCount, dealerUpcard, playerCards, playerHandValue.total, selectedMode, selectedModeConfig.label]);

  const recommendationTheme = actionStyle(recommendationView.mainAction);

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Fast table-side blackjack guidance with instant high-visibility action output."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <InfoPanel
          title="Live Recommendation"
          description="Primary action updates instantly as soon as card inputs change."
          className="lg:col-span-2"
        >
          <div className={`rounded-2xl border bg-gradient-to-br px-5 py-6 shadow-[0_0_28px_rgba(15,23,42,0.55)] ${recommendationTheme}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200/90">Main Action</p>
            <p className="mt-2 text-5xl font-black tracking-wide sm:text-6xl lg:text-7xl">{recommendationView.mainAction}</p>
            <p className="mt-3 max-w-3xl text-sm text-slate-100/90 sm:text-base">{recommendationView.shortReason}</p>

            <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-300/80">Mode</p>
                <p className="mt-1 font-semibold text-white">{recommendationView.modeLabel}</p>
              </div>
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-300/80">Count</p>
                <p className="mt-1 font-semibold text-white">{recommendationView.countSummary}</p>
              </div>
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-300/80">Deviation</p>
                <p className="mt-1 font-semibold text-white">{recommendationView.deviationApplied ? 'Applied' : 'Not applied'}</p>
              </div>
              <div className="rounded-lg border border-slate-200/20 bg-slate-950/35 px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-300/80">Final Action</p>
                <p className="mt-1 font-semibold text-white">{recommendationView.finalAction}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">Base Action</p>
              <p className="mt-1 font-semibold text-slate-100">{recommendationView.baseAction}</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">Final Action</p>
              <p className="mt-1 font-semibold text-slate-100">{recommendationView.finalAction}</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">Running / True Count</p>
              <p className="mt-1 font-semibold text-slate-100">{recommendationView.countSummary}</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">Player Summary</p>
              <p className="mt-1 font-semibold text-slate-100 break-words">{recommendationView.playerSummary}</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm text-slate-200 sm:col-span-2 lg:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">Dealer Summary</p>
              <p className="mt-1 font-semibold text-slate-100">{recommendationView.dealerSummary}</p>
            </div>
          </div>
        </InfoPanel>

        <ModeSelector
          selectedMode={selectedMode}
          modes={BLACKJACK_MODES}
          onModeChange={setSelectedMode}
          helperText="Select a ruleset profile used for recommendation and count context."
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

        <InfoPanel title="Player Hand Panel" description="Current player hand context.">
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

        <InfoPanel title="Dealer Upcard Panel" description="Dealer upcard context.">
          <p className="text-sm text-slate-300">
            Upcard selected:{' '}
            <span className="font-medium text-slate-100">{dealerUpcard.length ? dealerUpcard[0] : 'None'}</span>
          </p>
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
      </div>
    </AppShell>
  );
}
