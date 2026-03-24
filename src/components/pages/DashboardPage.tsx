import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useVitals } from "../../hooks/useVitals";
import { useSessions, recentSessions } from "../../hooks/useSessions";

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
      <div style={{ ...cardBase, overflow: "hidden", padding: 0 }}>
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
