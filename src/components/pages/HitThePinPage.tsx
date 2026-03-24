import { useHitThePinStats } from "../../hooks/useHitThePinStats";

interface Props { scrollY: number }

export function HitThePinPage({ scrollY: _ }: Props) {
  const { data: stats, isLoading } = useHitThePinStats();

  const courses = stats ? stats.courses.toLocaleString() : isLoading ? "..." : "1,660";
  const reviews = stats ? stats.reviewPages.toLocaleString() : isLoading ? "..." : "6,640";
  const states = stats ? String(stats.states) : isLoading ? "..." : "22";

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={pageTitle}>HitThePin</h1>
        <p style={pageSubtitle}>hitthepin.com — AI-powered golf course reviews</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Courses", value: courses, color: "var(--color-success)" },
          { label: "States", value: states, color: "var(--color-purple)" },
          { label: "Reviews", value: reviews, color: "var(--color-accent)" },
          { label: "Domain", value: "hitthepin.com", color: "var(--color-text)", small: true },
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
        {/* SEO Status */}
        <div style={cardBase}>
          <div style={cardHeader}><span>📈</span> SEO Status</div>
          <InfoRow label="Sitemap.xml"><Pill type="warn">Missing</Pill></InfoRow>
          <InfoRow label="Google Search Console"><Pill type="warn">Not set up</Pill></InfoRow>
          <InfoRow label="Google Indexing API"><Pill type="ok">Active — 200 URLs/day</Pill></InfoRow>
          <InfoRow label="Analytics"><Pill type="ok">GA4</Pill></InfoRow>
          <div style={{
            marginTop: 16, padding: "12px 16px", borderRadius: 8, fontSize: 13,
            background: "rgba(217,119,6,0.08)", color: "var(--color-warn)",
          }}>
            Action: Generate sitemap.xml and submit to Google Search Console
          </div>
        </div>

        {/* Geoff Bot */}
        <div style={cardBase}>
          <div style={cardHeader}><span>🤖</span> Geoff — Content Bot</div>
          <InfoRow label="Status"><Pill type="ok">Running</Pill></InfoRow>
          <InfoRow label="Schedule">7 AM + 3 PM PT</InfoRow>
          <InfoRow label="Model">claude-sonnet-4-6</InfoRow>
          <InfoRow label="Posts to">Discord #geoff</InfoRow>
          <InfoRow label="Voice">Snarky golf pundit</InfoRow>
        </div>
      </div>

      {/* Todos */}
      <div style={sectionLabel}>Todos</div>
      <div style={{ ...cardBase, padding: 0, overflow: "hidden" }}>
        <TodoRow priority="critical" text="Sitemap.xml — generate and deploy" />
        <TodoRow priority="high" text="Google Search Console — verify ownership and submit sitemap" />
        <TodoRow priority="blocked" text="Facebook Page — rate limited, retry later" />
        <TodoRow priority="medium" text="GolfNow affiliate ID — apply for affiliate program" />
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
  ok:      { bg: "rgba(22,163,74,0.1)", text: "var(--color-success)" },
  warn:    { bg: "rgba(217,119,6,0.1)", text: "var(--color-warn)" },
  error:   { bg: "rgba(220,38,38,0.1)", text: "var(--color-danger)" },
  info:    { bg: "rgba(37,99,235,0.1)", text: "var(--color-accent)" },
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

const PRIORITY_STYLES: Record<string, { dot: string; label: string; labelColor: string }> = {
  critical: { dot: "var(--color-danger)", label: "CRITICAL", labelColor: "var(--color-danger)" },
  high:     { dot: "var(--color-warn)", label: "HIGH", labelColor: "var(--color-warn)" },
  medium:   { dot: "var(--color-accent)", label: "MEDIUM", labelColor: "var(--color-accent)" },
  blocked:  { dot: "var(--color-text-tertiary)", label: "BLOCKED", labelColor: "var(--color-text-tertiary)" },
};

function TodoRow({ priority, text }: { priority: string; text: string }) {
  const s = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
      borderBottom: "1px solid var(--color-border)",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 14, color: "var(--color-text)" }}>{text}</span>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", color: s.labelColor }}>{s.label}</span>
    </div>
  );
}
