'use client';

import { useEffect, useState } from 'react';
import { CardRank } from '@/lib/blackjack/types';

const CARD_RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface CardPickerProps {
  title: string;
  cards: CardRank[];
  onAddCard: (rank: CardRank) => void;
  onUndoCard: () => void;
  maxCards?: number;
  collapsible?: boolean;
  collapseStorageKey?: string;
}

export default function CardPicker({
  title,
  cards,
  onAddCard,
  onUndoCard,
  maxCards = 6,
  collapsible = false,
  collapseStorageKey,
}: CardPickerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!collapseStorageKey) {
      return;
    }

    const savedValue = window.localStorage.getItem(collapseStorageKey);
    if (!savedValue) {
      return;
    }

    setIsCollapsed(savedValue === 'collapsed');
  }, [collapseStorageKey]);

  useEffect(() => {
    if (!collapseStorageKey) {
      return;
    }

    window.localStorage.setItem(collapseStorageKey, isCollapsed ? 'collapsed' : 'expanded');
  }, [collapseStorageKey, isCollapsed]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {collapsible ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(prev => !prev)}
              aria-expanded={!isCollapsed}
              className="rounded-md border border-slate-700 px-2 py-1 text-xs font-medium text-slate-200 hover:border-slate-500"
            >
              {isCollapsed ? 'Expand' : 'Minimize'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onUndoCard}
            disabled={cards.length === 0}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Undo
          </button>
        </div>
      </div>

      {!isCollapsed ? (
        <>
          <div className="mb-3 min-h-8 rounded-md border border-dashed border-slate-700 px-2 py-2 text-sm text-slate-200">
            {cards.length > 0 ? cards.join(' · ') : 'No cards selected'}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:grid-cols-7 md:grid-cols-10">
            {CARD_RANKS.map(rank => (
              <button
                key={rank}
                type="button"
                onClick={() => onAddCard(rank)}
                disabled={cards.length >= maxCards}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {rank}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
