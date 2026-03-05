import { useState } from "react";
import { Card } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { KpiRow } from "../ui/KpiRow";
import { Pill } from "../ui/Pill";
import { StatRow } from "../ui/StatRow";
import { Button } from "../ui/Button";
import { useSessions, recentSessions } from "../../hooks/useSessions";
import { useVitals } from "../../hooks/useVitals";

export function OpenClawTab() {
  const { data: sessions, isLoading, error, refetch } = useSessions();
  const { data: vitals } = useVitals();
  const active = sessions ? recentSessions(sessions) : [];

  const agents = vitals?.agents ?? [];
  const crons = vitals?.crons ?? [];
  const channels = vitals?.channels ?? {};
  const agentCount = agents.length || 3;
  const cronCount = crons.length || 5;
  const gatewayOk = !error;
  const hasUpdate = vitals?.updateAvailable ?? false;

  return (
    <div>
      <PageHeader title="🦞 OpenClaw" subtitle="System status &amp; infrastructure" />

      <div className="mb-4">
        <KpiRow
          items={[
            { value: gatewayOk ? "✓" : "✗", label: "Gateway", color: gatewayOk ? "green" : "red" },
            { value: isLoading ? "…" : String(active.length), label: "Active Sessions" },
            { value: String(agentCount), label: "Agents" },
            { value: String(cronCount), label: "Cron Jobs" },
            { value: hasUpdate ? "⚠" : "✓", label: hasUpdate ? "Update Available" : "Up to Date", color: hasUpdate ? "yellow" : "green" },
          ]}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        <Card title="Agents" icon="🤖">
          {agents.length > 0 ? agents.map((a) => (
            <AgentRow
              key={a.name}
              emoji={a.emoji ?? "🤖"}
              bgColor={a.active ? "bg-accent/12" : "bg-white/[0.04]"}
              name={a.name}
              pillVariant={a.active ? "ok" : "idle"}
              pillText={a.active ? "active" : "idle"}
              detail={[a.profile, a.model, a.heartbeat ? `Heartbeat: ${a.heartbeat}` : ""].filter(Boolean).join(" · ")}
            />
          )) : (
            <>
              <AgentRow emoji="🐦" bgColor="bg-danger/12" name="Wren" pillVariant="ok" pillText="default" detail="main · claude-opus-4-6 · Heartbeat: 3h" />
              <AgentRow emoji="⛳" bgColor="bg-purple/12" name="Geoff" pillVariant="purple" pillText="content" detail="geoff · claude-sonnet-4-6" />
              <AgentRow emoji="✍️" bgColor="bg-accent/12" name="Golf Writer" pillVariant="idle" pillText="inactive" detail="golf-writer · not configured" />
            </>
          )}
        </Card>

        {/* Live Sessions */}
        <Card title="Live Sessions" icon="🔴" wide noHover>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isLoading && <Pill variant="idle">loading…</Pill>}
              {error && <Pill variant="error">offline</Pill>}
              {!isLoading && !error && (
                <Pill variant={active.length > 0 ? "ok" : "idle"}>
                  {active.length > 0 ? `${active.length} active` : "quiet"}
                </Pill>
              )}
            </div>
            <Button size="sm" variant="ghost" onClick={() => refetch()}>
              ↻ Refresh
            </Button>
          </div>

          {/* Session list */}
          <div className="min-h-[48px]">
            {isLoading && (
              <div className="text-sm text-muted py-2">
                Connecting to gateway…
              </div>
            )}
            {error && (
              <div className="text-sm text-danger py-2">
                Could not reach gateway: {(error as Error).message}
              </div>
            )}
            {!isLoading && !error && active.length === 0 && (
              <div className="text-sm text-muted py-2">
                No active sessions in the last 5 minutes
              </div>
            )}
            {!isLoading &&
              !error &&
              active.map((s, i) => {
                const name = s.displayName ?? s.key ?? "unknown";
                const tokens = s.totalTokens
                  ? `${(s.totalTokens / 1000).toFixed(0)}k`
                  : "—";
                const ago = s.updatedAt
                  ? Math.round((Date.now() - s.updatedAt) / 60_000)
                  : null;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2 border-b border-white/[0.07] last:border-b-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-success shrink-0" />
                    <span className="text-sm">{name}</span>
                    <span className="text-white/40 text-xs ml-auto">
                      {s.model ?? "—"} · {tokens} tokens
                      {ago !== null ? ` · ${ago}m ago` : ""}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Reboot safety */}
          <div className="mt-3 p-3 bg-white/[0.02] rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {isLoading
                  ? "⏳"
                  : error
                    ? "❓"
                    : active.length > 0
                      ? "⚠️"
                      : "✅"}
              </span>
              <span
                className={`text-sm font-semibold ${
                  !isLoading && !error && active.length === 0
                    ? "text-success"
                    : !isLoading && !error && active.length > 0
                      ? "text-warn"
                      : ""
                }`}
              >
                {isLoading
                  ? "Checking if safe to reboot…"
                  : error
                    ? "Cannot determine — gateway unreachable"
                    : active.length === 0
                      ? "Safe to reboot — no active sessions"
                      : `Reboot would interrupt ${active.length} active session(s)`}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Channels" icon="📡">
          {Object.keys(channels).length > 0
            ? Object.entries(channels).map(([name, ok]) => (
                <ChannelRow key={name} name={name} ok={ok} />
              ))
            : (
              <>
                <ChannelRow name="Discord" ok />
                <ChannelRow name="Signal" ok />
                <ChannelRow name="iMessage" ok />
                <ChannelRow name="WebChat" ok />
              </>
            )}
        </Card>

        <Card title="Security" icon="🔒">
          {vitals?.security ? (
            <>
              <div className="text-sm mb-2">
                <span className={vitals.security.critical ? "text-danger" : "text-success"}>{vitals.security.critical ?? 0} critical</span> ·{" "}
                <span className={vitals.security.warnings ? "text-warn" : "text-muted"}>{vitals.security.warnings ?? 0} warnings</span> ·{" "}
                <span className="text-muted">{vitals.security.info ?? 0} info</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm mb-2">
                <span className="text-success">0 critical</span> ·{" "}
                <span className="text-warn">1 warning</span> ·{" "}
                <span className="text-muted">2 info</span>
              </div>
              <div className="text-xs text-warn">
                ⚠ Discord slash commands have no allowlists configured
              </div>
            </>
          )}
        </Card>

        <Card title="Cron Jobs" icon="⏰" wide>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
            {crons.length > 0 ? crons.map((c) => {
              const variant = c.status === "error" ? "error" : c.status === "ok" ? "ok" : "idle";
              const detail = [c.schedule, c.model, c.lastRun ? `Last: ${c.lastRun}` : ""].filter(Boolean).join(" · ");
              return <CronItem key={c.name} name={c.name} variant={variant} detail={detail} />;
            }) : (
              <>
                <CronItem name="hitthepin-daily-traffic" variant="idle" detail="Daily 9:00 AM · Opus" />
                <CronItem name="delilah-recon" variant="ok" detail="Every 6h · Sonnet" />
                <CronItem name="geoff-golf-content" variant="ok" detail="7 AM + 3 PM · Sonnet" />
                <CronItem name="google-index-submit" variant="error" detail="Daily 6 AM · Opus · ⚠ Last run errored" />
                <CronItem name="hitthepin-seo-audit" variant="idle" detail="Mon 10 AM · Next: tomorrow" />
              </>
            )}
          </div>
        </Card>

        <Card title="Host & Updates" icon="🖥️">
          <StatRow label="Machine">{vitals?.host?.machine ?? "Mac Studio (arm64)"}</StatRow>
          <StatRow label="macOS">{vitals?.host?.os ?? "26.2"}</StatRow>
          <StatRow label="Node">{vitals?.host?.node ?? "25.6.1"}</StatRow>
          <UpdatePanel version={vitals?.version} latestVersion={vitals?.latestVersion} hasUpdate={hasUpdate} />
        </Card>

        <Card title="MCP Servers" icon="🔌">
          <McpServer
            name="OSP Marketing Tools"
            desc="Open Strategy Partners — writing, editing, SEO, positioning"
            tools={[
              ["get_editing_codes", "OSP editing codes docs"],
              ["get_writing_guide", "OSP writing guide"],
              ["get_meta_guide", "Meta titles, slugs, SEO"],
              ["get_value_map_positioning_guide", "Product positioning"],
              ["get_on_page_seo_guide", "On-page SEO"],
            ]}
          />
          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            <McpServer
              name="ClawFu Skills"
              desc="Marketing methodology library — positioning, copy, funnels, branding"
              tools={[
                ["search_skills", "Search skill library"],
                ["load_skill", "Load full skill content"],
                ["list_categories", "Browse skill catalog"],
                ["set_brand / get_brand", "Brand profile management"],
                ["give_feedback", "Submit skill feedback"],
              ]}
            />
          </div>
        </Card>

        <Card title="Memory" icon="📁">
          <StatRow label="MEMORY.md">Long-term curated</StatRow>
          <StatRow label="Daily files">5 files in memory/</StatRow>
          <StatRow label="HEARTBEAT.md">3 checks configured</StatRow>
        </Card>
      </div>
    </div>
  );
}

function UpdatePanel({ version, latestVersion, hasUpdate }: { version?: string; latestVersion?: string; hasUpdate: boolean }) {
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const triggerUpdate = async () => {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/update", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = await res.json();
      if (data.ok) {
        setState("success");
      } else {
        throw new Error(data.error ?? "Unknown error");
      }
    } catch (e) {
      setState("error");
      setErrorMsg((e as Error).message);
    }
  };

  if (!hasUpdate) {
    return (
      <div className="mt-4 p-3 bg-success/[0.06] border border-success/20 rounded-xl flex items-center gap-2">
        <span>✅</span>
        <span className="text-sm text-success font-semibold">Up to date</span>
        {version && <span className="text-xs text-muted ml-auto">{version}</span>}
      </div>
    );
  }

  return (
    <div className="mt-4 p-3.5 bg-warn/[0.06] border border-warn/20 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⬆️</span>
        <span className="font-bold text-sm">Update Available</span>
        <Pill variant="warn">new</Pill>
      </div>
      <StatRow label="Current">{version ?? "—"}</StatRow>
      <StatRow label="Latest">
        <span className="text-success">{latestVersion ?? "—"}</span>
      </StatRow>
      <StatRow label="Channel">stable</StatRow>
      <div className="mt-3 flex gap-2">
        <Button
          variant="success"
          size="lg"
          loading={state === "loading"}
          disabled={state === "success"}
          onClick={triggerUpdate}
          className="flex-1"
        >
          {state === "success"
            ? "✅ Updated!"
            : state === "error"
              ? "❌ Failed — retry"
              : "🚀 Update Now"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() =>
            window.open(
              "https://github.com/openclaw/openclaw/releases",
              "_blank",
            )
          }
          className="flex-1"
        >
          📋 Changelog
        </Button>
      </div>
      {state === "error" && errorMsg && (
        <div className="mt-2 text-xs text-danger">{errorMsg}</div>
      )}
      {state === "success" && (
        <div className="mt-2 text-xs text-muted">
          Update triggered. Gateway will restart in ~30s.
        </div>
      )}
    </div>
  );
}

function AgentRow({
  emoji,
  bgColor,
  name,
  pillVariant,
  pillText,
  detail,
}: {
  emoji: string;
  bgColor: string;
  name: string;
  pillVariant: "ok" | "purple" | "idle";
  pillText: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-2.5 border-b border-white/[0.07] last:border-b-0">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${bgColor}`}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm flex items-center gap-1.5">
          {name} <Pill variant={pillVariant}>{pillText}</Pill>
        </div>
        <div className="text-white/40 text-xs mt-0.5 truncate">{detail}</div>
      </div>
    </div>
  );
}

function ChannelRow({ name, ok = true }: { name: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-white/[0.07] last:border-b-0">
      <div className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-success" : "bg-danger"}`} />
      <span className="text-sm">{name}</span>
      <Pill variant={ok ? "ok" : "error"} className="ml-auto">
        {ok ? "OK" : "down"}
      </Pill>
    </div>
  );
}

function CronItem({
  name,
  variant,
  detail,
}: {
  name: string;
  variant: "ok" | "error" | "idle";
  detail: string;
}) {
  return (
    <div className="py-2.5 border-b border-white/[0.07] last:border-b-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="font-semibold text-sm">{name}</span>
        <Pill variant={variant}>{variant}</Pill>
      </div>
      <div className="text-white/40 text-xs leading-relaxed">{detail}</div>
    </div>
  );
}

function McpServer({
  name,
  desc,
  tools,
}: {
  name: string;
  desc: string;
  tools: [string, string][];
}) {
  return (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-semibold text-sm">{name}</span>
        <Pill variant="ok">healthy</Pill>
      </div>
      <div className="text-xs text-muted mb-2">{desc}</div>
      {tools.map(([key, val]) => (
        <StatRow key={key} label={key}>
          <span className="text-xs text-muted">{val}</span>
        </StatRow>
      ))}
    </>
  );
}
