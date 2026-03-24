import { useVitals } from "../../hooks/useVitals";
import { useSessions, recentSessions } from "../../hooks/useSessions";

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
  marginBottom: 8,
};

const kpiVal: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: 1,
  color: "var(--color-text)",
  letterSpacing: "-0.02em",
};

function Pill({ children, color = "blue" }: { children: React.ReactNode; color?: "green" | "blue" | "amber" | "red" | "slate" }) {
  const map = {
    green: { bg: "rgba(22,163,74,0.1)", text: "var(--color-success)" },
    blue:  { bg: "rgba(37,99,235,0.1)", text: "var(--color-accent)" },
    amber: { bg: "rgba(217,119,6,0.1)", text: "var(--color-warn)" },
    red:   { bg: "rgba(220,38,38,0.1)", text: "var(--color-danger)" },
    slate: { bg: "var(--color-surface)", text: "var(--color-text-secondary)" },
  };
  const s = map[color];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text }}>
      {children}
    </span>
  );
}

function Row({ left, right, mono }: { left: React.ReactNode; right: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--color-border)" }}>
      <span style={{ fontSize: 13, color: "var(--color-text)" }}>{left}</span>
      <span style={{ fontSize: 13, fontFamily: mono ? "var(--font-mono, monospace)" : undefined, color: "var(--color-text-secondary)" }}>{right}</span>
    </div>
  );
}

export function OpenClawPage({ scrollY: _ }: Props) {
  const { data: vitals, isLoading: vLoading } = useVitals();
  const { data: sessions } = useSessions();

  const active = sessions ? recentSessions(sessions, 30) : [];
  const agents = vitals?.agents ?? [];
  const crons = vitals?.crons ?? [];
  const mcpServers = vitals?.mcp ?? [];
  const channels = vitals?.channels ?? {};

  const channelList = Object.entries(channels).map(([name, ok]) => ({ name, ok }));

  const kpis = [
    { label: "Version", value: vitals?.version ?? "—", sub: vitals?.updateAvailable ? "Update available" : "Up to date" },
    { label: "Agents", value: String(agents.length || "—"), sub: `${agents.filter(a => a.active).length} active` },
    { label: "Active Sessions", value: String(active.length), sub: "last 30 min" },
    { label: "Cron Jobs", value: String(crons.length || "—"), sub: "scheduled tasks" },
  ];

  const rebootSafe = active.length === 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)" }}>🦞 OpenClaw</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>Gateway status, agents, channels & cron jobs</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
        {kpis.map((k) => (
          <div key={k.label} style={card}>
            <div style={label}>{k.label}</div>
            <div style={kpiVal}>{vLoading ? "…" : k.value}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Reboot safety */}
        <div style={{ ...card, borderColor: rebootSafe ? "rgba(22,163,74,0.3)" : "rgba(217,119,6,0.3)" }}>
          <div style={label}>Reboot Safety</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{rebootSafe ? "✅" : "⚠️"}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text)" }}>
                {rebootSafe ? "Safe to restart" : "Sessions in progress"}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                {rebootSafe ? "No active sessions" : `${active.length} active in last 30 min`}
              </div>
            </div>
          </div>
          {active.length > 0 && (
            <div>
              {active.slice(0, 4).map((s: any) => (
                <div key={s.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid var(--color-border)" }}>
                  <span style={{ color: "var(--color-text)", fontFamily: "monospace" }}>{s.label ?? s.key}</span>
                  <Pill color="amber">active</Pill>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channels */}
        <div style={card}>
          <div style={label}>Channels</div>
          {channelList.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{vLoading ? "Loading…" : "No channels configured"}</div>
          ) : (
            channelList.map(({ name, ok }) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: 13, color: "var(--color-text)", textTransform: "capitalize" }}>{name}</span>
                <Pill color={ok ? "green" : "red"}>{ok ? "Connected" : "Offline"}</Pill>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Agents */}
        <div style={card}>
          <div style={label}>Agents</div>
          {agents.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{vLoading ? "Loading…" : "No agents"}</div>
          ) : (
            agents.map((a) => (
              <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text)" }}>{a.emoji ?? "🤖"} {a.name}</span>
                  {a.model && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>{a.model}</div>}
                </div>
                <Pill color={a.active ? "green" : "slate"}>{a.active ? "Active" : "Idle"}</Pill>
              </div>
            ))
          )}
        </div>

        {/* Cron jobs */}
        <div style={card}>
          <div style={label}>Cron Jobs</div>
          {crons.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{vLoading ? "Loading…" : "No cron jobs"}</div>
          ) : (
            crons.map((c) => (
              <div key={c.name} style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text)" }}>{c.name}</span>
                  <Pill color={c.status === "running" ? "green" : "slate"}>{c.status ?? "idle"}</Pill>
                </div>
                {c.schedule && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "monospace", marginTop: 2 }}>{c.schedule}</div>}
                {c.lastRun && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 }}>Last run: {c.lastRun}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* MCP Servers */}
      {mcpServers.length > 0 && (
        <div style={card}>
          <div style={label}>MCP Servers</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 4 }}>
            {mcpServers.map((m) => (
              <div key={m.name} style={{ background: "var(--color-surface)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{m.name}</span>
                  <Pill color={m.status === "ok" ? "green" : "amber"}>{m.status ?? "unknown"}</Pill>
                </div>
                {m.tools && <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.tools.length} tools available</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
