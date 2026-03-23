import { useState, useEffect, useCallback } from "react";
import { marked } from "marked";

interface DocEntry {
  filename: string;
  preview: string;
  lastModified: string;
  category: string;
  size: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  SYSTEM: "bg-purple-400/10 text-purple-400",
  CONTENT: "bg-green-400/10 text-green-400",
  TOOLS: "bg-blue-400/10 text-blue-400",
  OTHER: "bg-surface text-text-secondary",
};

export function DocsScreen() {
  const [docs, setDocs] = useState<DocEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ filename: string; content: string } | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);

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

  const openDoc = async (filename: string) => {
    const r = await fetch(`/api/docs?file=${encodeURIComponent(filename)}`);
    const d = await r.json() as { content?: string };
    setSelected({ filename, content: d.content || "" });
    setSlideOpen(true);
  };

  const renderMd = (md: string) => {
    const html = marked.parse(md) as string;
    return { __html: html };
  };

  return (
    <div className="flex flex-col h-full relative">
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

      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div className="text-text-secondary text-sm">Loading...</div>}
        {!loading && docs.length === 0 && (
          <div className="text-text-secondary text-sm">No docs found</div>
        )}
        {!loading && (
          <div className="space-y-1">
            {docs.map((doc) => (
              <button
                key={doc.filename}
                onClick={() => openDoc(doc.filename)}
                className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">{doc.filename}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.OTHER}`}>
                      {doc.category}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5 truncate">{doc.preview}</div>
                </div>
                <div className="text-xs text-text-secondary/60 shrink-0">
                  {new Date(doc.lastModified).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over panel */}
      {slideOpen && selected && (
        <div className="absolute inset-0 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setSlideOpen(false)}
          />
          {/* Panel */}
          <div className="w-2/3 max-w-2xl bg-bg border-l border-border flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <h3 className="text-sm font-semibold text-text">{selected.filename}</h3>
              <button
                onClick={() => setSlideOpen(false)}
                className="text-text-secondary hover:text-text transition-colors cursor-pointer text-lg leading-none"
              >
                ×
              </button>
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
