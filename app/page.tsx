'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { DEFAULT_MODE, MODES } from '@/lib/modes';
import { getModeDescription } from '@/lib/rules';
import { type GameMode } from '@/lib/types';
import { formatModelLabel } from '@/lib/utils';

export default function HomePage() {
  const [mode, setMode] = useState<GameMode>(DEFAULT_MODE);

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Minimal starter layout for hand input, upcard tracking, and recommendation output."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ModeSelector selectedMode={mode} modes={MODES} onChange={setMode} helperText={getModeDescription(mode)} />

        <InfoPanel
          title="Rules / Mode Info"
          description="Core configuration context for recommendations."
        >
          <p className="text-sm text-slate-300">
            Current mode: <span className="font-medium text-slate-100">{formatModelLabel(mode)}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">Detailed rules and toggles will appear here.</p>
        </InfoPanel>

        <InfoPanel title="Player Hand" description="Card input and running total.">
          <p className="text-sm text-slate-400">Placeholder for player cards, totals, and soft/hard hand status.</p>
        </InfoPanel>

        <InfoPanel title="Dealer Upcard" description="Visible dealer card.">
          <p className="text-sm text-slate-400">Placeholder for selecting or displaying the dealer&apos;s upcard.</p>
        </InfoPanel>

        <InfoPanel title="Recommendation" description="Best action based on mode and hand." className="lg:col-span-2">
          <p className="text-sm text-slate-400">Placeholder for HIT / STAND / DOUBLE / SPLIT guidance.</p>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
