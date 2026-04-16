'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { InfoPanel } from '@/components/InfoPanel';
import { ModeSelector } from '@/components/ModeSelector';
import { BLACKJACK_MODE_MAP, BLACKJACK_MODES } from '@/lib/blackjack/modes';
import { DEFAULT_MODE } from '@/lib/modes';

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState(DEFAULT_MODE);

  const selectedModeConfig = useMemo(() => BLACKJACK_MODE_MAP[selectedMode], [selectedMode]);

  return (
    <AppShell
      title="Blackjack Assistant"
      subtitle="Minimal assistant shell for hand entry, dealer upcard tracking, and action guidance."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ModeSelector
          selectedMode={selectedMode}
          modes={BLACKJACK_MODES}
          onModeChange={setSelectedMode}
        />

        <InfoPanel title="Count Info" description="Running count placeholders for future assistance logic.">
          <p className="text-sm text-slate-300">
            Current mode: <span className="font-medium text-slate-100">{selectedModeConfig.label}</span>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Placeholder for running count, true count, and decks remaining.
          </p>
        </InfoPanel>

        <InfoPanel title="Player Hand" description="Player cards and hand state.">
          <p className="text-sm text-slate-400">
            Placeholder for card picks, hand total, and soft/hard status.
          </p>
        </InfoPanel>

        <InfoPanel title="Dealer Upcard" description="Dealer&apos;s visible card.">
          <p className="text-sm text-slate-400">Placeholder for selecting or displaying the dealer&apos;s upcard.</p>
        </InfoPanel>

        <InfoPanel
          title="Recommendation"
          description="Assistant guidance based on selected mode and current hand."
          className="lg:col-span-2"
        >
          <p className="text-sm text-slate-400">
            Placeholder for suggested actions such as HIT, STAND, DOUBLE, SPLIT, or SURRENDER.
          </p>
        </InfoPanel>
      </div>
    </AppShell>
  );
}
