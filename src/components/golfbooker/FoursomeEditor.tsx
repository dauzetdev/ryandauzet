import { ACCOUNTS, TIME_PRESETS } from "../../lib/constants";
import { PlayerAutocomplete } from "./PlayerAutocomplete";
import { Button } from "../ui/Button";

export interface FoursomeState {
  id: number;
  account: string;
  targetTime: string;
  players: string[];
}

interface Props {
  foursome: FoursomeState;
  index: number;
  showRemove: boolean;
  allPlayers: string[];
  onChange: (id: number, patch: Partial<FoursomeState>) => void;
  onRemove: (id: number) => void;
}

export function FoursomeEditor({ foursome, index, showRemove, allPlayers, onChange, onRemove }: Props) {
  const addPlayer = (p: string) =>
    onChange(foursome.id, { players: [...foursome.players, p] });
  const removePlayer = (p: string) =>
    onChange(foursome.id, { players: foursome.players.filter((x) => x !== p) });

  return (
    <div className="bg-surface border border-border rounded-xl p-4 mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-text">Foursome {index + 1}</span>
        {showRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(foursome.id)}>Remove</Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5">Account</label>
          <select
            value={foursome.account}
            onChange={(e) => onChange(foursome.id, { account: e.target.value })}
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text outline-none focus:border-accent transition-colors"
          >
            {ACCOUNTS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5">Target Time</label>
          <input
            type="text"
            value={foursome.targetTime}
            onChange={(e) => onChange(foursome.id, { targetTime: e.target.value })}
            placeholder="e.g. 8:10 AM"
            className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-colors"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TIME_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange(foursome.id, { targetTime: t })}
                className={`px-2.5 py-1 border rounded-lg text-xs font-medium transition-all cursor-pointer font-[inherit] ${
                  foursome.targetTime === t
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5">
          Players ({foursome.players.length}/4)
        </label>
        {foursome.players.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {foursome.players.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-lg text-xs font-medium"
              >
                {p}
                <button
                  type="button"
                  onClick={() => removePlayer(p)}
                  className="text-accent hover:text-danger transition-colors ml-0.5 leading-none cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        {foursome.players.length < 4 && (
          <PlayerAutocomplete
            selected={foursome.players}
            allSelected={allPlayers}
            onAdd={addPlayer}
          />
        )}
      </div>
    </div>
  );
}
