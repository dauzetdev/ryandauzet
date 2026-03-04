import { useState, useRef, useEffect } from "react";
import { PLAYERS } from "../../lib/constants";

interface Props {
  selected: string[];
  allSelected: string[]; // across all foursomes
  onAdd: (player: string) => void;
  disabled?: boolean;
}

export function PlayerAutocomplete({ selected, allSelected, onAdd, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hlIdx, setHlIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const matches =
    query.trim().length > 0
      ? PLAYERS.filter(
          (p) =>
            !allSelected.includes(p) &&
            p.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const select = (player: string) => {
    onAdd(player);
    setQuery("");
    setOpen(false);
    setHlIdx(-1);
    inputRef.current?.focus();
  };

  useEffect(() => {
    setOpen(matches.length > 0);
    setHlIdx(-1);
  }, [query]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (!matches.length) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setHlIdx((i) => Math.min(i + 1, matches.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setHlIdx((i) => Math.max(i - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); if (hlIdx >= 0) select(matches[hlIdx]); }
          else if (e.key === "Escape") setOpen(false);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search players…"
        disabled={disabled || selected.length >= 4}
        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text placeholder:text-muted outline-none transition-[border-color] duration-150 focus:border-accent disabled:opacity-40 disabled:cursor-not-allowed"
      />
      {open && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-0.5 bg-surface border border-border rounded-lg max-h-44 overflow-y-auto z-50 shadow-xl shadow-black/30"
        >
          {matches.map((p, i) => (
            <div
              key={p}
              onMouseDown={() => select(p)}
              onMouseEnter={() => setHlIdx(i)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-75 ${i === hlIdx ? "bg-accent/10 text-accent" : "hover:bg-white/5"}`}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
