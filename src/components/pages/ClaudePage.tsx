import { useClaudeUsage } from "../../hooks/useClaudeUsage";

interface Props { scrollY: number }

const card: React.CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  boxShadow: "var(--shadow-card)",
  padding: "20px 24px",
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-text-secondary)",
  marginBottom: 6,
};

const kpiVal: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: 1,
  color: "var(--color-text)",
  letterSpacing: "-0.02em",
};

const kpiSub: React.CSSProperties = {
  fontSize: 12,
  color: "var(--color-text-secondary)",
  marginTop: 4,
};

function Bar({ percent, color = "var(--color-accent)" }: { percent: number; color?: string }) {
  return (
    <div style={{ height: 6, background: "var(--color-surface)", borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
      <div style={{ height: "100%", width: `${Math.min(100, percent)}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function ClaudePage({ scrollY: _ }: Props) {
  const { data, isLoading, error } = useClaudeUsage();

  const kpis = [
    { label: "API Cost (30d)", value: data ? `$${data.totalCost.toFixed(2)}` : "—", sub: "vs $100 Max plan", color: "var(--color-purple)" },
    { label: "Total Tokens", value: data ? fmt(data.totalTokens) : "—", sub: "input + output + cache", color: "var(--color-accent)" },
    { label: "Cache Hit Rate", value: data ? `${data.cacheHitRate}%` : "—", sub: "reduces cost significantly", color: "var(--color-success)" },
    { label: "Peak Day", value: data ? `$${data.peakDayCost.toFixed(2)}` : "—", sub: data?.peakDayDate ?? "", color: "var(--color-warn)" },
  ];

  const tokenTypes = data ? [
    { label: "Cache reads", tokens: data.totalCacheRead, cost: ((data.totalCacheRead / 1_000_000) * 0.3).toFixed(2), color: "var(--color-success)" },
    { label: "Cache writes", tokens: data.totalCacheWrite, cost: ((data.totalCacheWrite / 1_000_000) * 3.75).toFixed(2), color: "var(--color-warn)" },
    { label: "Output tokens", tokens: data.totalOutput, cost: ((data.totalOutput / 1_000_000) * 15).toFixed(2), color: "var(--color-purple)" },
    { label: "Input tokens", tokens: data.totalInput, cost: ((data.totalInput / 1_000_000) * 3).toFixed(2), color: "var(--color-accent)" },
  ] : [];

  const maxCost = tokenTypes.length ? Math.max(...tokenTypes.map(t => parseFloat(t.cost))) : 1;

  const channels = [
    { name: "discord (#saturday-game)", used: 173, max: 200 },
    { name: "discord (#golf-booker)", used: 171, max: 200 },
    { name: "discord (#ryandauzet)", used: 109, max: 200 },
    { name: "discord (#din-tai-fung)", used: 79, max: 200 },
    { name: "discord (#hitthepin)", used: 63, max: 200 },
    { name: "discord (#openclaw)", used: 61, max: 200 },
    { name: "discord (#general)", used: 39, max: 200 },
    { name: "main (direct)", used: 19, max: 200 },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)" }}>🤖 Claude Usage</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>API cost, token consumption & session budgets</p>
      </div>

      {error && (
        <div style={{ ...card, marginBottom: 20, border: "1px solid rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)", color: "var(--color-danger)", fontSize: 13 }}>
          Could not load live usage data: {(error as Error).message}. Showing cached estimates.
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={card}>
            <div style={label}>{k.label}</div>
            <div style={{ ...kpiVal, color: isLoading ? "var(--color-text-secondary)" : k.color }}>{isLoading ? "…" : k.value}</div>
            <div style={kpiSub}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Cost breakdown */}
        <div style={card}>
          <div style={label}>Cost Breakdown (30d)</div>
          {isLoading ? (
            <div style={{ color: "var(--color-text-secondary)", fontSize: 13, paddingTop: 12 }}>Loading…</div>
          ) : tokenTypes.length ? (
            <div style={{ marginTop: 4 }}>
              {tokenTypes.map((t) => (
                <div key={t.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 2 }}>
                    <span style={{ color: "var(--color-text)" }}>{t.label}</span>
                    <span style={{ fontWeight: 600, color: t.color }}>${t.cost}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>{fmt(t.tokens)} tokens</div>
                  <Bar percent={(parseFloat(t.cost) / maxCost) * 100} color={t.color} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--color-text-secondary)", fontSize: 13, paddingTop: 12 }}>No data</div>
          )}
        </div>

        {/* Session budgets */}
        <div style={card}>
          <div style={label}>Session Token Budgets</div>
          <div style={{ marginTop: 4 }}>
            {channels.map((ch) => {
              const pct = Math.round((ch.used / ch.max) * 100);
              const color = pct > 80 ? "var(--color-danger)" : pct > 60 ? "var(--color-warn)" : "var(--color-success)";
              return (
                <div key={ch.name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                    <span style={{ color: "var(--color-text)", fontFamily: "var(--font-mono, monospace)", fontSize: 11 }}>{ch.name}</span>
                    <span style={{ fontWeight: 600, color }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>{ch.used}k / {ch.max}k tokens</div>
                  <Bar percent={pct} color={color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Model config */}
      <div style={card}>
        <div style={label}>Model Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 12 }}>
          {[
            { name: "Default agent (Wren)", model: "claude-sonnet-4-6", badge: "Active" },
            { name: "Geoff (golf blogger)", model: "claude-sonnet-4-6", badge: "Active" },
            { name: "Cron jobs", model: "claude-sonnet-4-6", badge: "Sonnet" },
          ].map((m) => (
            <div key={m.name} style={{ background: "var(--color-surface)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--color-accent)" }}>{m.model}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
