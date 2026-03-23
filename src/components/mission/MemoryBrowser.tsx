import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";

interface DateEntry {
  date: string;
}

export function MemoryBrowser() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [memoryMd, setMemoryMd] = useState<string>("");
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ date: string; preview: string }[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/memory")
      .then((r) => r.json())
      .then((d: { dates?: string[] }) => {
        const ds = d.dates || [];
        setDates(ds);
        if (ds.length > 0) setSelectedDate(ds[0]);
      });
    fetch("/api/memory?file=MEMORY.md")
      .then((r) => r.json())
      .then((d: { content?: string }) => setMemoryMd(d.content || ""));
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetch(`/api/memory?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d: { content?: string }) => {
        setContent(d.content || "");
        setLoading(false);
      });
  }, [selectedDate]);

  const handleSearch = useCallback(async () => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const r = await fetch(`/api/memory?search=${encodeURIComponent(search)}`);
    const d = await r.json() as { results?: { date: string; preview: string }[] };
    setSearchResults(d.results || []);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(handleSearch, 400);
    return () => clearTimeout(t);
  }, [handleSearch]);

  const renderMd = (md: string) => {
    const html = marked.parse(md) as string;
    return { __html: html };
  };

  const displayDates = searchResults
    ? searchResults.map((r) => r.date)
    : dates;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-3 border-b border-border">
          <input
            type="text"
            placeholder="Search memory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
        {/* MEMORY.md collapsible */}
        <button
          onClick={() => setMemoryOpen(!memoryOpen)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider hover:text-text transition-colors border-b border-border"
        >
          <span>{memoryOpen ? "▾" : "▸"}</span>
          <span>Long-term Memory</span>
        </button>
        {memoryOpen && (
          <div className="px-3 py-2 border-b border-border bg-surface/50 text-xs text-text-secondary max-h-48 overflow-y-auto">
            <div
              className="prose prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={renderMd(memoryMd)}
            />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {displayDates.length === 0 && (
            <div className="px-3 py-4 text-xs text-text-secondary text-center">No entries found</div>
          )}
          {displayDates.map((date) => {
            const result = searchResults?.find((r) => r.date === date);
            return (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSearchResults(null); setSearch(""); }}
                className={[
                  "w-full text-left px-3 py-2 text-sm transition-colors border-b border-border/50",
                  selectedDate === date
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text hover:bg-surface",
                ].join(" ")}
              >
                <div className="font-medium">{date}</div>
                {result && (
                  <div className="text-xs text-text-secondary mt-0.5 line-clamp-2">{result.preview}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading && (
          <div className="text-text-secondary text-sm">Loading...</div>
        )}
        {!loading && selectedDate && (
          <>
            <h2 className="text-lg font-semibold text-text mb-4">{selectedDate}</h2>
            <div
              className="prose prose-sm prose-invert max-w-3xl"
              dangerouslySetInnerHTML={renderMd(content)}
            />
          </>
        )}
        {!loading && !selectedDate && (
          <div className="text-text-secondary text-sm">Select a date from the sidebar</div>
        )}
      </div>
    </div>
  );
}
