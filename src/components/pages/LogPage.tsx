import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

interface Props { scrollY: number }

interface SearchResult {
  date: string;
  preview: string;
  matchLine: string;
}

const card: React.CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  boxShadow: "var(--shadow-card)",
  padding: "20px 24px",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10,
};

export function LogPage({ scrollY: _ }: Props) {
  const [dates, setDates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/memory", { credentials: "same-origin" })
      .then(r => r.json())
      .then((d: { dates?: string[] }) => {
        const ds = d.dates ?? [];
        setDates(ds);
        if (ds.length > 0) setSelected(ds[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected || results !== null) return;
    setLoading(true);
    fetch(`/api/memory?date=${selected}`, { credentials: "same-origin" })
      .then(r => r.json())
      .then((d: { content?: string }) => {
        setHtml(marked.parse(d.content ?? "") as string);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selected, results]);

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!query.trim()) { setResults(null); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/memory?search=${encodeURIComponent(query.trim())}`, { credentials: "same-origin" });
        const d = await r.json() as { results?: SearchResult[] };
        setResults(d.results ?? []);
      } catch { setResults([]); }
      setSearching(false);
    }, 300);
  }, [query]);

  const selectDate = (date: string) => {
    setSelected(date);
    setQuery("");
    setResults(null);
    setHtml("");
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)" }}>📔 Daily Log</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
          Session history, requests & results, git references
        </p>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--color-text-secondary)", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search all log entries…"
            style={{
              width: "100%", padding: "10px 14px 10px 40px",
              fontSize: 14, borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)", color: "var(--color-text)",
              outline: "none", boxShadow: "var(--shadow-card)",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults(null); }}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--color-text-secondary)" }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {results !== null ? (
        <div>
          <div style={sectionLabel}>{searching ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}</div>
          {results.length === 0 && !searching ? (
            <div style={{ ...card, color: "var(--color-text-secondary)", fontSize: 14 }}>No matches found.</div>
          ) : (
            results.map((r) => (
              <div key={r.date} onClick={() => selectDate(r.date)} style={{ ...card, marginBottom: 10, cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", fontFamily: "monospace" }}>{r.date}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.5, fontFamily: "monospace", background: "var(--color-surface)", borderRadius: 6, padding: "6px 10px" }}>
                  {r.matchLine}
                </div>
                {r.preview && (
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 6 }}>{r.preview}</div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
          {/* Date sidebar */}
          <div style={card}>
            <div style={sectionLabel}>Log Files</div>
            <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {dates.map(d => (
                <button key={d} onClick={() => selectDate(d)} style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 10px", borderRadius: 7, fontSize: 13,
                  fontFamily: "monospace", border: "none", cursor: "pointer",
                  background: selected === d ? "rgba(37,99,235,0.1)" : "transparent",
                  color: selected === d ? "var(--color-accent)" : "var(--color-text)",
                  fontWeight: selected === d ? 600 : 400,
                  transition: "background 0.1s",
                  marginBottom: 2,
                }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Log content */}
          <div style={card}>
            {loading ? (
              <div style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Loading…</div>
            ) : html ? (
              <div
                className="log-content"
                style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-text)" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Select a date to view the log.</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .log-content h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 16px; color: var(--color-text); letter-spacing: -0.01em; }
        .log-content h2 { font-size: 1rem; font-weight: 600; margin: 20px 0 8px; color: var(--color-text); border-bottom: 1px solid var(--color-border); padding-bottom: 6px; }
        .log-content h3 { font-size: 0.9rem; font-weight: 600; margin: 14px 0 6px; color: var(--color-text); }
        .log-content p { margin: 0 0 10px; }
        .log-content ul, .log-content ol { padding-left: 20px; margin: 0 0 10px; }
        .log-content li { margin-bottom: 4px; }
        .log-content code { font-family: var(--font-mono, monospace); font-size: 12px; background: var(--color-surface); padding: 1px 5px; border-radius: 4px; color: var(--color-accent); }
        .log-content pre { background: var(--color-surface); border-radius: 8px; padding: 12px 16px; overflow-x: auto; margin: 10px 0; }
        .log-content pre code { background: none; padding: 0; }
        .log-content table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin: 10px 0; }
        .log-content th { text-align: left; padding: 7px 10px; background: var(--color-surface); font-weight: 600; border: 1px solid var(--color-border); color: var(--color-text-secondary); font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
        .log-content td { padding: 7px 10px; border: 1px solid var(--color-border); vertical-align: top; }
        .log-content tr:hover td { background: var(--color-surface); }
        .log-content blockquote { border-left: 3px solid var(--color-accent); margin: 10px 0; padding: 4px 12px; color: var(--color-text-secondary); font-style: italic; }
        .log-content a { color: var(--color-accent); text-decoration: none; }
        .log-content a:hover { text-decoration: underline; }
        .log-content strong { font-weight: 600; color: var(--color-text); }
        .log-content hr { border: none; border-top: 1px solid var(--color-border); margin: 16px 0; }
      `}</style>
    </div>
  );
}
