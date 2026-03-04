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
  allPlayers: string[]; // selected across all foursomes
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
        <span className="text-sm font-semibold">Foursome {index + 1}</span>
        {showRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(foursome.id)}>
            Remove
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Account */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Account</label>
          <select
            value={foursome.account}
            onChange={(e) => onChange(foursome.id, { account: e.target.value })}
            className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text outline-none focus:border-accent transition-[border-color] duration-150"
          >
            {ACCOUNTS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Target time */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Target Time</label>
          <input
            type="text"
            value={foursome.targetTime}
            onChange={(e) => onChange(foursome.id, { targetTime: e.target.value })}
            placeholder="e.g. 8:10 AM"
            className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted outline-none focus:border-accent transition-[border-color] duration-150"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TIME_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange(foursome.id, { targetTime: t })}
                className={`px-2.5 py-1 border rounded-md text-xs font-medium transition-all duration-150 font-[inherit] cursor-pointer ${
                  foursome.targetTime === t
                    ? "border-accent bg-accent/12 text-accent"
                    : "border-border text-muted hover:border-accent hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Players */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">
          Players ({foursome.players.length}/4)
        </label>
        {foursome.players.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {foursome.players.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/12 text-accent rounded-md text-xs font-medium"
              >
                {p}
                <button
                  type="button"
                  onClick={() => removePlayer(p)}
                  className="text-accent hover:text-danger transition-colors ml-0.5 leading-none"
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
