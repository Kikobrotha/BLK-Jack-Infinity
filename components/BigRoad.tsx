'use client';

import { Result } from '../lib/roads';

export default function BigRoad({ results }: { results: Result[] }) {
  const columns: Array<Array<'PLAYER' | 'BANKER'>> = [];
  let tieCount = 0;

  results.forEach(r => {
    if (r === 'TIE') {
      tieCount += 1;
      return;
    }
    const last = columns.at(-1);
    if (!last || last[0] !== r) columns.push([r]);
    else last.push(r);
  });

  return (
    <div className="bg-black/50 p-3 rounded">
      <p className="text-xs text-center mb-2">Big Road</p>
      <div className="flex gap-1 items-start">
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
        {tieCount > 0 && (
          <div className="ml-2 rounded border border-green-400/60 bg-green-950/50 px-1.5 py-0.5 text-[10px] leading-none text-green-300">
            T:{tieCount}
          </div>
        )}
      </div>
    </div>
  );
}
