'use client';

import { Card } from '../lib/shoe';

export default function CardGrid({
  onSelect,
  disabled,
}: {
  onSelect: (card: Card) => void;
  disabled: boolean;
}) {
  const cards: Card[] = [
    'A','2','3','4',
    '5','6','7','8',
    '9','10','J','Q','K',
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map(card => (
        <button
          key={card}
          disabled={disabled}
          onClick={() => onSelect(card)}
          className={`py-2 rounded font-semibold
            ${disabled
              ? 'bg-gray-400 text-gray-700'
              : 'bg-white text-black'}
          `}
        >
          {card}
        </button>
      ))}
    </div>
  );
}
