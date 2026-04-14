import { CardRank } from '@/lib/blackjack/types';

const CARD_RANKS: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

interface CardPickerProps {
  title: string;
  cards: CardRank[];
  onAddCard: (rank: CardRank) => void;
  onUndoCard: () => void;
  maxCards?: number;
}

export default function CardPicker({ title, cards, onAddCard, onUndoCard, maxCards = 6 }: CardPickerProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button
          type="button"
          onClick={onUndoCard}
          className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
        >
          Undo
        </button>
      </div>

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
    </section>
  );
}
