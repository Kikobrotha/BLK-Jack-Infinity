import { type BlackjackModeConfig } from '@/lib/blackjack/modes';
import { type GameMode } from '@/lib/types';

type ModeSelectorProps = {
  selectedMode: GameMode;
  modes: readonly BlackjackModeConfig[];
  onModeChange: (mode: GameMode) => void;
  helperText?: string;
};

export function ModeSelector({ selectedMode, modes, onModeChange, helperText }: ModeSelectorProps) {
  const selectedModeConfig = modes.find(mode => mode.id === selectedMode);

  const handleModeChange = (value: string) => {
    const nextMode = modes.find(mode => mode.id === value);

    if (!nextMode) {
      return;
    }

    onModeChange(nextMode.id);
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="text-lg font-semibold text-white">Mode Selector</h2>

      <label className="mt-4 block text-sm font-medium text-slate-200" htmlFor="mode-selector">
        Blackjack Mode
      </label>
      <select
        id="mode-selector"
        value={selectedMode}
        onChange={event => handleModeChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      >
        {modes.map(mode => (
          <option key={mode.id} value={mode.id}>
            {mode.label}
          </option>
        ))}
      </select>

      {selectedModeConfig ? (
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-slate-200">Selected mode: {selectedModeConfig.label}</p>
          <p className="text-slate-400">{selectedModeConfig.shortDescription}</p>
        </div>
      ) : null}

      {helperText ? <p className="mt-3 text-sm text-slate-400">{helperText}</p> : null}
    </section>
  );
}
