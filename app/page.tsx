'use client';

import { useEffect, useMemo, useState } from 'react';
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
const COLLAPSE_STORAGE_KEYS = {
  howItWorks: 'blackjack-collapse-how-it-works',
  modeSelector: 'blackjack-collapse-mode-selector',
  playerCards: 'blackjack-collapse-player-cards',
  dealerUpcard: 'blackjack-collapse-dealer-upcard',
  playerDealerHand: 'blackjack-collapse-player-dealer-hand-panel',
  exposedCards: 'blackjack-collapse-exposed-cards',
  seenCardsPanel: 'blackjack-collapse-seen-cards-panel',
} as const;

type MainAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER' | 'INSURANCE' | 'WAITING';
type LayoutOption = 'classic' | 'focus' | 'compact' | 'mobile-stack';

const LAYOUT_STORAGE_KEY = 'blackjack-layout-option';
const LAYOUT_OPTIONS: ReadonlyArray<{ id: LayoutOption; label: string; description: string }> = [
  { id: 'classic', label: 'Classic', description: 'Balanced two-column layout for most screens.' },
  { id: 'focus', label: 'Focus', description: 'Emphasizes recommendation details in wider viewports.' },
  { id: 'compact', label: 'Compact', description: 'Denser multi-column layout for large screens.' },
  { id: 'mobile-stack', label: 'Mobile Stack', description: 'Forces a single stacked column at all sizes.' },
];

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
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption>('classic');
  const [playerCards, setPlayerCards] = useState<CardRank[]>([]);
  const [dealerUpcard, setDealerUpcard] = useState<CardRank[]>([]);
  const [exposedCards, setExposedCards] = useState<CardRank[]>([]);

  useEffect(() => {
    const savedLayout = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!savedLayout || !LAYOUT_OPTIONS.some(layout => layout.id === savedLayout)) {
      return;
    }

    setSelectedLayout(savedLayout as LayoutOption);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, selectedLayout);
  }, [selectedLayout]);

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
      ? `${advice.rationale} Insurance: decline by default without a dedicated insurance count.`
      : advice.rationale;

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
  const layoutClassName = useMemo(() => {
    switch (selectedLayout) {
      case 'focus':
        return 'grid gap-4 lg:grid-cols-2 xl:grid-cols-3';
      case 'compact':
        return 'grid gap-3 lg:grid-cols-3';
      case 'mobile-stack':
        return 'grid gap-4';
      default:
        return 'grid gap-4 lg:grid-cols-2';
    }
  }, [selectedLayout]);
  const recommendationPanelClassName = useMemo(() => {
    switch (selectedLayout) {
      case 'focus':
        return 'lg:col-span-2 xl:col-span-3';
      case 'compact':
        return 'lg:col-span-3';
      case 'mobile-stack':
        return '';
      default:
        return 'lg:col-span-2';
    }
  }, [selectedLayout]);

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Fast table-side blackjack guidance with instant high-visibility action output."
    >
      <div className={layoutClassName}>
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Layout Options</h2>
          <label className="mt-4 block text-sm font-medium text-slate-200" htmlFor="layout-selector">
            Assistant Layout
          </label>
          <select
            id="layout-selector"
            value={selectedLayout}
            onChange={event => setSelectedLayout(event.target.value as LayoutOption)}
            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            {LAYOUT_OPTIONS.map(layout => (
              <option key={layout.id} value={layout.id}>
                {layout.label}
              </option>
            ))}
          </select>
          <p className="mt-3 text-sm text-slate-300">
            {LAYOUT_OPTIONS.find(layout => layout.id === selectedLayout)?.description}
          </p>
        </section>

        <InfoPanel
          title="Live Recommendation"
          description="Primary action updates instantly as soon as card inputs change."
          className={recommendationPanelClassName}
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

        <InfoPanel
          title="How it Works"
          description="Quick guide for first-time users."
          collapsible
          defaultCollapsed
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.howItWorks}
        >
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">How it Works</h3>
              <p className="mt-1">
                This app is a blackjack assistant, not a predictor. It starts with basic strategy and then adjusts
                the recommendation when count-based deviations apply.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">How to Use</h3>
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                <li>Select a mode that matches your table rules.</li>
                <li>Enter your player cards.</li>
                <li>Enter the dealer upcard.</li>
                <li>Optionally add seen / exposed cards for counting context when supported.</li>
                <li>Read the recommendation panel.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Understanding Output</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-medium text-slate-200">Base Action:</span> the basic strategy decision before
                  count context.
                </li>
                <li>
                  <span className="font-medium text-slate-200">Final Action:</span> the decision after applying any
                  valid count deviation.
                </li>
                <li>
                  <span className="font-medium text-slate-200">Deviation:</span> shows whether a count deviation was
                  applied.
                </li>
                <li>
                  <span className="font-medium text-slate-200">Running / True Count:</span> displayed when count
                  context is available.
                </li>
              </ul>
            </div>
          </div>
        </InfoPanel>

        <ModeSelector
          selectedMode={selectedMode}
          modes={BLACKJACK_MODES}
          onModeChange={setSelectedMode}
          helperText="Select a ruleset profile used for recommendation and count context."
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.modeSelector}
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
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.playerCards}
        />

        <InfoPanel
          title="Player/Dealer hand panel"
          description="Current player and dealer hand context."
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.playerDealerHand}
        >
          <p className="text-sm text-slate-300">
            Cards entered: <span className="font-medium text-slate-100">{playerCards.length}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">Hand total: {playerHandValue.total}</p>
          <p className="mt-1 text-sm text-slate-400">Soft / hard status: {playerSoftHardLabel}</p>
          <p className="mt-1 text-sm text-slate-400">Pair status: {playerPairLabel}</p>
          <p className="mt-1 text-xs text-slate-500">
            Blackjack: {playerHandValue.isBlackjack ? 'Yes' : 'No'} · Bust: {playerHandValue.isBust ? 'Yes' : 'No'}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            Dealer upcard selected:{' '}
            <span className="font-medium text-slate-100">{dealerUpcard.length ? dealerUpcard[0] : 'None'}</span>
          </p>
        </InfoPanel>

        <CardPicker
          title="Dealer Upcard"
          cards={dealerUpcard}
          onAddCard={rank => setDealerUpcard([rank])}
          onUndoCard={() => setDealerUpcard([])}
          maxCards={1}
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.dealerUpcard}
        />

        <CardPicker
          title="Seen / Exposed Cards (Optional)"
          cards={exposedCards}
          onAddCard={rank => setExposedCards(prev => addCardWithCap(prev, rank, MAX_EXPOSED_CARDS))}
          onUndoCard={() => setExposedCards(prev => removeLastCard(prev))}
          maxCards={MAX_EXPOSED_CARDS}
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.exposedCards}
        />

        <InfoPanel
          title="Seen Cards Panel"
          description="Visible cards for counting context input."
          collapsible
          collapseStorageKey={COLLAPSE_STORAGE_KEYS.seenCardsPanel}
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
