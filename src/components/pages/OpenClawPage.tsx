import { useState } from "react";
import { useVitals } from "../../hooks/useVitals";
import { useSessions, recentSessions } from "../../hooks/useSessions";
import { useHostInfo } from "../../hooks/useHostInfo";

interface Props { scrollY: number }

/* ── Shared styles ─────────────────────────────────────────────────────────── */

const cardBase: React.CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: "20px 24px",
  boxShadow: "var(--shadow-card)",
};

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-text-secondary)",
  marginBottom: 12,
};

/* ── Inline components ─────────────────────────────────────────────────────── */

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        padding: "3px 8px",
        fontSize: 11,
        fontWeight: 500,
        color: copied ? "var(--color-success)" : "var(--color-text-secondary)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "color 0.15s",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export function OpenClawPage({ scrollY: _ }: Props) {
  const { data: vitals, isLoading: vLoading } = useVitals();
  const { data: sessions } = useSessions();
  const { data: host } = useHostInfo();
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const active = sessions ? recentSessions(sessions, 30) : [];
  const agents = vitals?.agents ?? [];
  const crons = vitals?.crons ?? [];
  const mcpServers = vitals?.mcp ?? [];
  const channels = vitals?.channels ?? {};
  const channelList = Object.entries(channels).map(([name, ok]) => ({ name, ok }));

  const currentVersion = host?.currentVersion ?? vitals?.version ?? "—";
  const latestVersion = host?.latestVersion ?? vitals?.latestVersion ?? null;
  const updateAvailable = host?.updateAvailable ?? vitals?.updateAvailable ?? false;
  const rebootSafe = active.length === 0;

  async function handleUpdate() {
    setUpdating(true);
    setUpdateMsg(null);
    try {
      const res = await fetch("/api/update", { method: "POST", credentials: "same-origin" });
      const data = await res.json();
      setUpdateMsg(data.ok ? "Update triggered!" : (data.error ?? "Update failed"));
    } catch {
      setUpdateMsg("Failed to reach server");
    } finally {
      setUpdating(false);
    }
  }

  const sshCmd = host ? `ssh ${host.ssh.user}@${host.ssh.host} -p ${host.ssh.port}` : "ssh dauzet@174.160.178.223 -p 2222";
  const sshHref = host ? `ssh://${host.ssh.user}@${host.ssh.host}:${host.ssh.port}` : "ssh://dauzet@174.160.178.223:2222";
  const vncAddr = host ? `${host.vnc.host}:${host.vnc.port}` : "174.160.178.223:15900";
  const vncHref = host ? `vnc://${host.vnc.host}:${host.vnc.port}` : "vnc://174.160.178.223:15900";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)" }}>🦞 OpenClaw</h1>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>Gateway status, agents, channels & cron jobs</p>
      </div>

      {/* Version + Host cards — top row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Version card */}
        <div style={cardBase}>
          <div style={label}>Version</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1, color: "var(--color-text)", letterSpacing: "-0.02em" }}>
              {vLoading ? "…" : currentVersion}
            </span>
            <Pill color={updateAvailable ? "amber" : "green"}>
              {updateAvailable ? "Update available" : "Up to date"}
            </Pill>
          </div>
          {latestVersion && latestVersion !== currentVersion && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10 }}>
              Latest: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{latestVersion}</span>
            </div>
          )}
          <button
            onClick={handleUpdate}
            disabled={updating}
            style={{
              background: updateAvailable ? "var(--color-accent)" : "var(--color-surface)",
              color: updateAvailable ? "#fff" : "var(--color-text-secondary)",
              border: updateAvailable ? "none" : "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: updating ? "wait" : "pointer",
              opacity: updating ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {updating ? "Updating…" : "Update Now"}
          </button>
          {updateMsg && (
            <div style={{ fontSize: 12, marginTop: 8, color: updateMsg.includes("triggered") ? "var(--color-success)" : "var(--color-warn)" }}>
              {updateMsg}
            </div>
          )}
        </div>

        {/* Host card */}
        <div style={cardBase}>
          <div style={label}>Host</div>
          {/* Hostname + IPs */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>
              {host?.hostname ?? "Mac Studio"}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Local IP</span>
                <span style={{ fontSize: 13, fontFamily: "monospace", color: "var(--color-text)" }}>{host?.localIp ?? "192.168.68.76"}</span>
                <CopyButton text={host?.localIp ?? "192.168.68.76"} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Public IP</span>
                <span style={{ fontSize: 13, fontFamily: "monospace", color: "var(--color-text)" }}>{host?.publicIp ?? "174.160.178.223"}</span>
                <CopyButton text={host?.publicIp ?? "174.160.178.223"} />
              </div>
            </div>
          </div>
          {/* SSH row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderTop: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", minWidth: 36 }}>SSH</span>
            <code style={{ flex: 1, fontSize: 12, fontFamily: "monospace", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sshCmd}
            </code>
            <CopyButton text={sshCmd} />
            <a
              href={sshHref}
              style={{ fontSize: 12, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Open →
            </a>
          </div>
          {/* VNC row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderTop: "1px solid var(--color-border)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", minWidth: 36 }}>VNC</span>
            <code style={{ flex: 1, fontSize: 12, fontFamily: "monospace", color: "var(--color-text)" }}>
              {vncAddr}
            </code>
            <CopyButton text={vncAddr} />
            <a
              href={vncHref}
              style={{ fontSize: 12, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Open →
            </a>
          </div>
        </div>
      </div>

      {/* Reboot Safety + Channels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Reboot safety */}
        <div style={{ ...cardBase, borderColor: rebootSafe ? "rgba(22,163,74,0.3)" : "rgba(217,119,6,0.3)" }}>
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
        <div style={cardBase}>
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

      {/* Agents + Cron Jobs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Agents */}
        <div style={cardBase}>
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
        <div style={cardBase}>
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
        <div style={cardBase}>
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
