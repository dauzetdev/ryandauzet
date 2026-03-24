import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useVitals } from "../../hooks/useVitals";
import { useSessions, recentSessions } from "../../hooks/useSessions";

import { useState, useEffect } from "react";
import { marked } from "marked";

interface Props { scrollY: number }

export function DashboardPage({ scrollY: _ }: Props) {
  const { data: claude } = useClaudeUsage();
  const { data: vitals } = useVitals();
  const { data: sessions } = useSessions();

  const activeSessions = sessions ? recentSessions(sessions) : [];
  const cronCount = vitals?.crons != null
    ? Array.isArray(vitals.crons) ? vitals.crons.length : vitals.crons
    : "—";

  const kpis = [
    { label: "Claude Spend (30d)", value: claude ? `$${claude.totalCost.toFixed(0)}` : "—", color: "var(--color-purple)" },
    { label: "Active Projects", value: "4", color: "var(--color-accent)" },
    { label: "Active Sessions", value: String(activeSessions.length), color: "var(--color-success)" },
    { label: "Crons Running", value: String(cronCount), color: "var(--color-cyan)" },
  ];

  const projects = [
    { emoji: "⛳", name: "HitThePin", subtitle: "Golf Course Reviews & SEO", status: "Live", statusType: "green" as const },
    { emoji: "🏌️", name: "SaturdayGame", subtitle: "iOS Golf Scoring App", status: "Active", statusType: "green" as const },
    { emoji: "📅", name: "GolfBooker", subtitle: "Reservation Automation", status: "Active", statusType: "green" as const },
    { emoji: "🦞", name: "OpenClaw", subtitle: "AI Agent Platform", status: "Dev", statusType: "blue" as const },
  ];

  const activity = [
    { emoji: "🤖", label: "Geoff posted review: Pebble Beach Golf Links", time: "2h ago" },
    { emoji: "📅", label: "GolfBooker: Delilah reservation confirmed", time: "5h ago" },
    { emoji: "⛳", label: "HitThePin: 12 new pages indexed", time: "8h ago" },
    { emoji: "🏌️", label: "SaturdayGame: v2.1 deployed to TestFlight", time: "1d ago" },
    { emoji: "🦞", label: "OpenClaw: Wren agent deployed", time: "2d ago" },
  ];

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          {getGreeting()}, Ryan
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* KPIs — 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
        {kpis.map((k) => (
          <div key={k.label} style={cardStyle}>
            <div style={sectionLabel}>{k.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1, color: k.color }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div style={sectionLabel}>Projects</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 32 }}>
        {projects.map((p) => (
          <div
            key={p.name}
            style={{
              ...cardBase,
              display: "flex", alignItems: "center", gap: 16,
              transition: "box-shadow 0.15s, border-color 0.15s", cursor: "default",
            }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            <span style={{ fontSize: 32 }}>{p.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text)" }}>{p.name}</span>
                <StatusPill type={p.statusType}>{p.status}</StatusPill>
              </div>
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{p.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={sectionLabel}>Recent Activity</div>
      <div style={{ ...cardBase, overflow: "hidden", padding: 0, marginBottom: 32 }}>
        {activity.map((a, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
            borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
          }}>
            <span style={{ fontSize: 18 }}>{a.emoji}</span>
            <span style={{ flex: 1, fontSize: 14, color: "var(--color-text)" }}>{a.label}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{a.time}</span>
          </div>
        ))}
      </div>

      {/* Bottom row: Daily Log + Open Todos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <DailyLog />
        <OpenTodos />
      </div>
    </div>
  );
}

/* ── Daily Log ─────────────────────────────────────────────────────────────── */
function DailyLog() {
  const [dates, setDates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!selected) return;
    setLoading(true);
    fetch(`/api/memory?date=${selected}`, { credentials: "same-origin" })
      .then(r => r.json())
      .then((d: { content?: string }) => {
        setHtml(marked.parse(d.content ?? "") as string);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selected]);

  return (
    <div style={cardBase}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={sectionLabel}>Daily Log</div>
        {dates.length > 0 && (
          <select
            value={selected ?? ""}
            onChange={e => setSelected(e.target.value)}
            style={{
              fontSize: 12, padding: "3px 8px", borderRadius: 6,
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)", color: "var(--color-text)", cursor: "pointer",
            }}
          >
            {dates.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
      </div>
      {loading ? (
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Loading…</div>
      ) : html ? (
        <div
          style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-text)", maxHeight: 320, overflowY: "auto" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>No log entries yet.</div>
      )}
    </div>
  );
}

/* ── Open Todos ────────────────────────────────────────────────────────────── */
const TODOS = [
  { project: "HitThePin", emoji: "⛳", items: [
    { text: "Build sitemap.xml (critical for SEO)", priority: "high" },
    { text: "Set up Google Search Console", priority: "high" },
    { text: "Create Facebook Page (was rate limited)", priority: "medium" },
    { text: "Add GolfNow affiliate ID to tee time links", priority: "medium" },
  ]},
  { project: "SaturdayGame", emoji: "🏌️", items: [
    { text: "Universal Links — replace JS redirect with iOS native deep links", priority: "high" },
  ]},
  { project: "GolfBooker", emoji: "📅", items: [
    { text: "Migrate JS automation from Swift app to browser tool", priority: "medium" },
  ]},
  { project: "OpenClaw", emoji: "🦞", items: [
    { text: "Wire Update Now button to gateway exec endpoint", priority: "low" },
  ]},
];

const PRIORITY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  high:   { bg: "rgba(220,38,38,0.08)",  text: "var(--color-danger)",  label: "High" },
  medium: { bg: "rgba(217,119,6,0.08)",  text: "var(--color-warn)",   label: "Med" },
  low:    { bg: "rgba(37,99,235,0.08)", text: "var(--color-accent)",  label: "Low" },
};

function OpenTodos() {
  const [open, setOpen] = useState<Set<string>>(new Set(["HitThePin", "SaturdayGame"]));
  const toggle = (p: string) => setOpen(prev => {
    const next = new Set(prev);
    next.has(p) ? next.delete(p) : next.add(p);
    return next;
  });

  return (
    <div style={cardBase}>
      <div style={sectionLabel}>Open Todos</div>
      {TODOS.map(({ project, emoji, items }) => (
        <div key={project} style={{ marginBottom: 12 }}>
          <button
            onClick={() => toggle(project)}
            style={{
              display: "flex", alignItems: "center", gap: 6, width: "100%",
              background: "none", border: "none", cursor: "pointer", padding: "4px 0",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 14 }}>{emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", flex: 1 }}>{project}</span>
            <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{items.length} todo{items.length !== 1 ? "s" : ""}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: 4 }}>{open.has(project) ? "▲" : "▼"}</span>
          </button>
          {open.has(project) && (
            <div style={{ marginTop: 4, marginLeft: 4 }}>
              {items.map((item, i) => {
                const ps = PRIORITY_STYLE[item.priority];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ fontSize: 11, marginTop: 2, padding: "1px 6px", borderRadius: 4, background: ps.bg, color: ps.text, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {ps.label}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--color-text)", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

const cardBase: React.CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: "20px 24px",
  boxShadow: "var(--shadow-card)",
};

const cardStyle: React.CSSProperties = { ...cardBase };

const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12,
};

function hoverIn(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
  e.currentTarget.style.borderColor = "var(--color-border-hover)";
}
function hoverOut(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.boxShadow = "var(--shadow-card)";
  e.currentTarget.style.borderColor = "var(--color-border)";
}

const PILL_COLORS = {
  green: { bg: "rgba(22,163,74,0.1)", text: "var(--color-success)" },
  blue:  { bg: "rgba(37,99,235,0.1)", text: "var(--color-accent)" },
  amber: { bg: "rgba(217,119,6,0.1)", text: "var(--color-warn)" },
};

function StatusPill({ type, children }: { type: keyof typeof PILL_COLORS; children: React.ReactNode }) {
  const c = PILL_COLORS[type];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 10px",
      borderRadius: 9999, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
    }}>
      {children}
    </span>
  );
}
