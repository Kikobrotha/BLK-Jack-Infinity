import { formatModeLabel } from '@/lib/utils';
import { type GameMode } from '@/lib/types';

type ModeSelectorProps = {
  selectedMode: GameMode;
  modes: readonly GameMode[];
  helperText?: string;
};

export function ModeSelector({ selectedMode, modes, helperText }: ModeSelectorProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="text-lg font-semibold text-white">Mode</h2>
      <p className="mt-1 text-sm text-slate-400">Top-level mode selector placeholder.</p>

      <label className="mt-4 block text-sm font-medium text-slate-200" htmlFor="mode-selector">
        Table Mode
      </label>
      <select
        id="mode-selector"
        value={selectedMode}
        readOnly
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      >
        {modes.map(mode => (
          <option key={mode} value={mode}>
            {formatModeLabel(mode)}
          </option>
        ))}
      </select>

      {helperText ? <p className="mt-3 text-sm text-slate-400">{helperText}</p> : null}
    </section>
  );
}
