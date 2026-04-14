'use client';

import { useMemo, useState } from 'react';
import CardPicker from '@/components/blackjack/CardPicker';
import ModeSelector from '@/components/blackjack/ModeSelector';
import { getBlackjackAdvice } from '@/lib/blackjack/advisor';
import { getRuleset } from '@/lib/blackjack/rules';
import { BlackjackMode, CardRank } from '@/lib/blackjack/types';

const DEALER_UPCARDS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function Home() {
  const [mode, setMode] = useState<BlackjackMode>('regular');
  const [playerCards, setPlayerCards] = useState<CardRank[]>(['10', '6']);
  const [dealerUpcard, setDealerUpcard] = useState<CardRank>('10');

  const ruleset = useMemo(() => getRuleset(mode), [mode]);
  const advice = useMemo(() => getBlackjackAdvice(mode, playerCards, dealerUpcard), [mode, playerCards, dealerUpcard]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-xl border border-slate-800 bg-slate-900/80 p-6">
          <h1 className="text-2xl font-bold text-white">Blackjack Decision Assistant</h1>
          <p className="mt-2 text-sm text-slate-300">
            Mode-based blackjack guidance for human play. This tool gives strategy advice and explanations, not autoplay.
          </p>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
          <ModeSelector value={mode} onChange={setMode} />

          <div className="space-y-2">
            <label htmlFor="dealer-upcard" className="text-sm font-medium text-slate-200">
              Dealer Upcard
            </label>
            <select
              id="dealer-upcard"
              value={dealerUpcard}
              onChange={event => setDealerUpcard(event.target.value as CardRank)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {DEALER_UPCARDS.map(upcard => (
                <option key={upcard} value={upcard}>
                  {upcard}
                </option>
              ))}
            </select>
          </div>
        </section>

        <CardPicker
          title="Player Hand"
          cards={playerCards}
          onAddCard={rank => setPlayerCards(current => [...current, rank])}
          onUndoCard={() => setPlayerCards(current => current.slice(0, -1))}
        />

        <section className="rounded-xl border border-emerald-700/40 bg-emerald-900/15 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
              Recommended Action
            </span>
            <span className="text-2xl font-bold text-emerald-300">{advice.primaryAction}</span>
            {advice.fallbackAction ? (
              <span className="text-sm text-slate-300">Fallback: {advice.fallbackAction}</span>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-slate-200">{advice.rationale}</p>

          <dl className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            <div>
              <dt className="text-slate-400">Player Total</dt>
              <dd className="font-semibold text-white">{advice.handValue.total}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Hand Type</dt>
              <dd className="font-semibold text-white">{advice.handValue.isSoft ? 'Soft' : 'Hard'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Blackjack</dt>
              <dd className="font-semibold text-white">{advice.handValue.isBlackjack ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Bust</dt>
              <dd className="font-semibold text-white">{advice.handValue.isBust ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Mode Rules Snapshot</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-300">
            <li>Mode: {ruleset.label}</li>
            <li>Decks: {ruleset.decks}</li>
            <li>Dealer Hits Soft 17: {ruleset.dealerHitsSoft17 ? 'Yes' : 'No'}</li>
            <li>Double After Split: {ruleset.doubleAfterSplit ? 'Yes' : 'No'}</li>
            <li>Surrender Allowed: {ruleset.surrender ? 'Yes' : 'No'}</li>
            <li>Blackjack Payout: {ruleset.blackjackPayout}</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
