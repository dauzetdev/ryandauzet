import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";

interface DocEntry {
  filename: string;
  path: string;
  subdir: string | null;
  preview: string;
  lastModified: string;
  category: string;
  size: number;
}

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  SYSTEM:      { label: "System",       emoji: "⚙️",  color: "text-purple-400" },
  HITTHEPIN:   { label: "HitThePin",    emoji: "📍",  color: "text-green-400"  },
  SATURDAYGAME:{ label: "Saturday Game",emoji: "🏌️",  color: "text-blue-400"   },
  GOLFBOOKER:  { label: "GolfBooker",   emoji: "🏡",  color: "text-orange-400" },
  CONTENT:     { label: "Content",      emoji: "✍️",  color: "text-yellow-400" },
  TOOLS:       { label: "Tools",        emoji: "🔧",  color: "text-cyan-400"   },
  OTHER:       { label: "Other",        emoji: "📄",  color: "text-text-secondary" },
};

const CATEGORY_ORDER = ["SYSTEM","HITTHEPIN","SATURDAYGAME","GOLFBOOKER","CONTENT","TOOLS","OTHER"];

export function DocsScreen() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ filename: string; path: string; content: string } | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(CATEGORY_ORDER));

  const fetchDocs = useCallback(async (q?: string) => {
    setLoading(true);
    const url = q ? `/api/docs?search=${encodeURIComponent(q)}` : "/api/docs";
    const r = await fetch(url);
    const d = await r.json() as { docs?: DocEntry[] };
    setDocs(d.docs || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  useEffect(() => {
    const t = setTimeout(() => fetchDocs(search || undefined), 400);
    return () => clearTimeout(t);
  }, [search, fetchDocs]);

  const openDoc = async (doc: DocEntry) => {
    const r = await fetch(`/api/docs?file=${encodeURIComponent(doc.path)}`);
    const d = await r.json() as { content?: string };
    setSelected({ filename: doc.filename, path: doc.path, content: d.content || "" });
    setSlideOpen(true);
  };

  const toggleFolder = (cat: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const grouped = CATEGORY_ORDER.reduce<Record<string, DocEntry[]>>((acc, cat) => {
    acc[cat] = docs.filter((d) => d.category === cat);
    return acc;
  }, {});

  const renderMd = (md: string) => ({ __html: marked.parse(md) as string });

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-text">Docs</h2>
        <input
          type="text"
          placeholder="Search docs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 px-3 py-1.5 rounded-lg bg-bg border border-border text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-accent w-64"
        />
        <span className="text-xs text-text-secondary ml-auto">{docs.length} files</span>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading && <div className="text-text-secondary text-sm px-2">Loading...</div>}
        {!loading && docs.length === 0 && (
          <div className="text-text-secondary text-sm px-2">No docs found</div>
        )}
        {!loading && CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.OTHER;
          const isOpen = openFolders.has(cat);

          return (
            <div key={cat} className="mb-1">
              {/* Folder row */}
              <button
                onClick={() => toggleFolder(cat)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors text-left group"
              >
                <span className="text-xs text-text-secondary transition-transform duration-150" style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                <span className="text-base leading-none">{cfg.emoji}</span>
                <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-text-secondary ml-auto">{items.length}</span>
              </button>

              {/* Files */}
              {isOpen && (
                <div className="ml-6 border-l border-border/40 pl-2 mb-1">
                  {items.map((doc) => (
                    <button
                      key={doc.path}
                      onClick={() => openDoc(doc)}
                      className="w-full text-left flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors group"
                    >
                      <span className="text-text-secondary text-xs mt-0.5 shrink-0">📝</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text group-hover:text-accent transition-colors truncate">{doc.filename}</div>
                        <div className="text-xs text-text-secondary mt-0.5 truncate">{doc.preview}</div>
                      </div>
                      <div className="text-xs text-text-secondary/50 shrink-0 mt-0.5">
                        {new Date(doc.lastModified).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide-over panel */}
      {slideOpen && selected && (
        <div className="absolute inset-0 flex z-10">
          <div className="flex-1 bg-black/30" onClick={() => setSlideOpen(false)} />
          <div className="w-2/3 max-w-2xl bg-bg border-l border-border flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <h3 className="text-sm font-semibold text-text">{selected.filename}</h3>
              <button
                onClick={() => setSlideOpen(false)}
                className="text-text-secondary hover:text-text transition-colors cursor-pointer text-lg leading-none"
              >×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div
                className="prose prose-sm prose-invert max-w-none"
                dangerouslySetInnerHTML={renderMd(selected.content)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
