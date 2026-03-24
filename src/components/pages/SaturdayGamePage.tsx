import { PLAYERS } from "../../lib/constants";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";

interface Props { scrollY: number }

export function SaturdayGamePage({ scrollY: _ }: Props) {
  const { data, isLoading, error } = useSaturdayGameStats();

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={pageTitle}>SaturdayGame</h1>
        <p style={pageSubtitle}>iOS/macOS golf scoring app — Swift + SwiftUI + Firebase</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Platform", value: "iOS + macOS", color: "var(--color-accent)", small: true },
          { label: "Backend", value: "Firebase", color: "var(--color-warn)", small: true },
          { label: "Language", value: "Swift/SwiftUI", color: "var(--color-purple)", small: true },
          { label: "Users", value: isLoading ? "..." : error ? "—" : String(data?.users ?? "—"), color: "var(--color-success)" },
        ].map((k) => (
          <div key={k.label} style={cardBase}>
            <div style={sectionLabel}>{k.label}</div>
            <div style={{ fontSize: k.small ? "1.1rem" : "2rem", fontWeight: 700, lineHeight: 1, color: k.color }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16, marginBottom: 32 }}>
        {/* Universal Links */}
        <div style={cardBase}>
          <div style={cardHeader}><span>🔗</span> Universal Links</div>
          <InfoRow label="Status"><Pill type="warn">Todo</Pill></InfoRow>
          <InfoRow label="Priority"><Pill type="error">High</Pill></InfoRow>
          <InfoRow label="Description">Enable deep linking for shared scorecards and group invites</InfoRow>
          <div style={{
            marginTop: 16, padding: "12px 16px", borderRadius: 8, fontSize: 13,
            background: "rgba(217,119,6,0.08)", color: "var(--color-warn)",
          }}>
            Requires apple-app-site-association file on saturdaygame.app domain
          </div>
        </div>

        {/* App Stats */}
        <div style={cardBase}>
          <div style={cardHeader}><span>📊</span> App Stats</div>
          {isLoading ? (
            <div style={{ padding: "20px 0", textAlign: "center", fontSize: 14, color: "var(--color-text-secondary)" }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: "20px 0", textAlign: "center", fontSize: 14, color: "var(--color-danger)" }}>Could not load data</div>
          ) : (
            <>
              <InfoRow label="Users">{data?.users ?? "—"}</InfoRow>
              <InfoRow label="Score Sessions">{data?.rounds ?? "—"}</InfoRow>
              <InfoRow label="Tournaments">{data?.tournaments ?? "—"}</InfoRow>
              <InfoRow label="Groups">{data?.groups ?? "—"}</InfoRow>
            </>
          )}
        </div>
      </div>

      {/* Players */}
      <div style={sectionLabel}>Players ({PLAYERS.length})</div>
      <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 0,
        }}>
          {PLAYERS.map((name) => (
            <div key={name} style={{
              padding: "10px 20px", fontSize: 14, color: "var(--color-text)",
              borderBottom: "1px solid var(--color-border)",
              borderRight: "1px solid var(--color-border)",
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

const pageTitle: React.CSSProperties = {
  fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", letterSpacing: "-0.02em",
};
const pageSubtitle: React.CSSProperties = {
  fontSize: 14, color: "var(--color-text-secondary)", marginTop: 4,
};
const cardBase: React.CSSProperties = {
  background: "var(--color-card)", border: "1px solid var(--color-border)",
  borderRadius: 12, padding: "20px 24px", boxShadow: "var(--shadow-card)",
};
const cardHeader: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  fontWeight: 600, fontSize: 15, color: "var(--color-text)",
  paddingBottom: 16, borderBottom: "1px solid var(--color-border)", marginBottom: 4,
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12,
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", borderBottom: "1px solid var(--color-border)", fontSize: 14,
    }}>
      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ color: "var(--color-text)" }}>{children}</span>
    </div>
  );
}

const PILL_STYLES = {
  ok:    { bg: "rgba(22,163,74,0.1)", text: "var(--color-success)" },
  warn:  { bg: "rgba(217,119,6,0.1)", text: "var(--color-warn)" },
  error: { bg: "rgba(220,38,38,0.1)", text: "var(--color-danger)" },
  info:  { bg: "rgba(37,99,235,0.1)", text: "var(--color-accent)" },
};

function Pill({ type, children }: { type: keyof typeof PILL_STYLES; children: React.ReactNode }) {
  const c = PILL_STYLES[type];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 10px",
      borderRadius: 9999, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text,
    }}>
      {children}
    </span>
  );
}
