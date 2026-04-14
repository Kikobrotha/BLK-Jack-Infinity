import { blackjackModes } from '@/lib/blackjack/rules';
import { BlackjackMode } from '@/lib/blackjack/types';

interface ModeSelectorProps {
  value: BlackjackMode;
  onChange: (mode: BlackjackMode) => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="mode" className="text-sm font-medium text-slate-200">
        Blackjack Mode
      </label>
      <select
        id="mode"
        value={value}
        onChange={event => onChange(event.target.value as BlackjackMode)}
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
      >
        {blackjackModes.map(mode => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
