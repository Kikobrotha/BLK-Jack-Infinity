'use client';

import { Result } from '../lib/roads';

export default function BigRoad({ results }: { results: Result[] }) {
  const columns: Result[][] = [];

  results.forEach(r => {
    if (r === 'TIE') return;
    const last = columns.at(-1);
    if (!last || last[0] !== r) columns.push([r]);
    else last.push(r);
  });

  return (
    <div className="bg-black/50 p-3 rounded">
      <p className="text-xs text-center mb-2">Big Road</p>
      <div className="flex gap-1">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((r, j) => (
              <div
                key={j}
                className={`w-4 h-4 rounded-full border-2
                  ${r === 'PLAYER'
                    ? 'border-blue-400'
                    : 'border-red-400'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
