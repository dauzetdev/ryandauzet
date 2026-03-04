import { useEffect, useState, useCallback } from "react";
import { WIDGETS, DEFAULT_WIDGET_IDS } from "../../lib/constants";
import { Modal } from "../ui/Modal";
import { KpiRow } from "../ui/KpiRow";
import { Pill } from "../ui/Pill";
import { StatRow } from "../ui/StatRow";
import { BarProgress } from "../ui/BarProgress";
import { useSessions, recentSessions } from "../../hooks/useSessions";
import { useVitals } from "../../hooks/useVitals";
import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useHitThePinStats } from "../../hooks/useHitThePinStats";

const STORAGE_KEY = "home-widgets";

function getWidgetIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...DEFAULT_WIDGET_IDS];
  } catch {
    return [...DEFAULT_WIDGET_IDS];
  }
}

function saveWidgetIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function HomeTab() {
  const [widgetIds, setWidgetIds] = useState(getWidgetIds);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hr = now.getHours();
      const g =
        hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
      setGreeting(`${g}, Ryan`);
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  const removeWidget = useCallback(
    (idx: number) => {
      const next = widgetIds.filter((_, i) => i !== idx);
      setWidgetIds(next);
      saveWidgetIds(next);
    },
    [widgetIds],
  );

  const addWidget = useCallback(
    (id: string) => {
      const next = [...widgetIds, id];
      setWidgetIds(next);
      saveWidgetIds(next);
    },
    [widgetIds],
  );

  const handleDrop = useCallback(
    (fromIdx: number, toIdx: number) => {
      if (fromIdx === toIdx) return;
      const arr = [...widgetIds];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      setWidgetIds(arr);
      saveWidgetIds(arr);
    },
    [widgetIds],
  );

  const currentSet = new Set(widgetIds);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[1.4rem] max-md:text-[1.1rem]">{greeting}</h1>
          <div className="text-[0.8rem] text-muted">{dateStr}</div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1 gap-4">
        {widgetIds.map((id, idx) => {
          const w = WIDGETS[id];
          if (!w) return null;
          return (
            <div
              key={`${id}-${idx}`}
              draggable
              className={`bg-card border border-border rounded-xl p-4 max-md:p-3 cursor-grab select-none transition-[transform,box-shadow] duration-100 ${
                dragIdx === idx ? "opacity-50 scale-[0.97]" : ""
              } ${
                dragOverIdx === idx
                  ? "border-accent shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
                  : ""
              }`}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(idx));
                setDragIdx(idx);
              }}
              onDragEnd={() => {
                setDragIdx(null);
                setDragOverIdx(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIdx(idx);
              }}
              onDragLeave={() => setDragOverIdx(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverIdx(null);
                const from = parseInt(e.dataTransfer.getData("text/plain"));
                handleDrop(from, idx);
              }}
            >
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="text-[0.78rem] max-md:text-[0.72rem] font-semibold">
                  {w.name}
                </h3>
                <div className="flex gap-1 items-center">
                  <span className="text-[0.6rem] text-muted px-1.5 py-0.5 bg-white/[0.04] rounded">
                    {w.source}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWidget(idx);
                    }}
                    className="bg-transparent border-none text-muted cursor-pointer text-[0.9rem] px-1.5 py-0.5 rounded transition-all duration-150 hover:text-danger hover:bg-danger/10"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <WidgetContent id={id} />
            </div>
          );
        })}

        {/* Add widget button */}
        <div
          onClick={() => setModalOpen(true)}
          className="border-2 border-dashed border-border rounded-xl py-10 px-5 max-md:py-6 max-md:px-4 max-md:min-h-[120px] flex flex-col items-center justify-center gap-2 text-muted cursor-pointer transition-all duration-200 min-h-[160px] hover:border-accent hover:text-accent hover:bg-accent/[0.03]"
        >
          <div className="text-3xl leading-none">+</div>
          <div className="text-[0.8rem]">Add Widget</div>
        </div>
      </div>

      {/* Widget Picker Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Widget"
      >
        {Object.entries(
          Object.entries(WIDGETS).reduce<
            Record<string, { id: string; name: string; desc: string }[]>
          >((acc, [id, w]) => {
            if (!acc[w.source]) acc[w.source] = [];
            acc[w.source].push({ id, name: w.name, desc: w.desc });
            return acc;
          }, {}),
        ).map(([source, widgets]) => (
          <div key={source}>
            <div className="text-[0.72rem] text-muted uppercase tracking-[1px] my-3 pt-2 border-t border-border first:border-t-0 first:mt-0">
              {source}
            </div>
            {widgets.map((w) => {
              const added = currentSet.has(w.id);
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    if (!added) addWidget(w.id);
                  }}
                  className={`flex items-center justify-between p-3 border border-border rounded-lg mb-2 cursor-pointer transition-all duration-150 hover:border-accent hover:bg-accent/[0.04] ${
                    added ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[0.85rem] font-semibold">{w.name}</div>
                    <div className="text-[0.7rem] text-muted">{w.desc}</div>
                  </div>
                  <div className="text-xl text-accent">
                    {added ? "\u2713" : "+"}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </Modal>
    </div>
  );
}

function WidgetContent({ id }: { id: string }) {
  const { data: sessions, error: sessionsError } = useSessions();
  const { data: vitals } = useVitals();
  const { data: claude, isLoading: claudeLoading } = useClaudeUsage();
  const { data: htpStats, isLoading: htpLoading } = useHitThePinStats();

  const activeSessions = sessions ? recentSessions(sessions) : [];
  const gatewayOk = !sessionsError;
  const agents = vitals?.agents ?? [];
  const crons = vitals?.crons ?? [];
  const channels = vitals?.channels ?? {};

  switch (id) {
    case "htp-kpis":
      return (
        <KpiRow
          items={[
            { value: htpStats ? htpStats.courses.toLocaleString() : htpLoading ? "…" : "1,660+", label: "Courses", color: "green" },
            { value: htpStats ? htpStats.reviewPages.toLocaleString() : htpLoading ? "…" : "6,400+", label: "Pages", color: "accent" },
            { value: htpStats ? String(htpStats.states) : htpLoading ? "…" : "22", label: "States", color: "purple" },
          ]}
        />
      );
    case "htp-seo":
      return (
        <>
          <StatRow label="Indexing API">
            <Pill variant="ok">active</Pill>
          </StatRow>
          <StatRow label="Sitemap">
            <Pill variant="ok">active</Pill>
          </StatRow>
          <StatRow label="Search Console">
            <Pill variant="ok">configured</Pill>
          </StatRow>
        </>
      );
    case "htp-todos":
      return (
        <>
          <StatRow label="✅ Sitemap.xml">Done</StatRow>
          <StatRow label="✅ Search Console">Configured</StatRow>
          <StatRow label="🟡 Facebook Page">Retry</StatRow>
        </>
      );
    case "htp-socials":
      return (
        <>
          <DotRow color="green" text="Instagram @HitThePin_Golf" />
          <DotRow color="green" text="YouTube hitthepin.golf.1" />
          <DotRow color="yellow" text="X @HitThePin_Golf (read-only)" />
          <DotRow color="green" text="TikTok @HitThePinGolf" />
        </>
      );
    case "sg-status":
      return (
        <>
          <StatRow label="Platform">iOS + macOS</StatRow>
          <StatRow label="Backend">Firebase</StatRow>
        </>
      );
    case "gb-bookings":
      return (
        <>
          <StatRow label="Delilah LV">
            <Pill variant="blue">Aug 8</Pill> 6PM, 4ppl
          </StatRow>
          <StatRow label="Din Tai Fung">
            <Pill variant="purple">Mar 29</Pill> 6PM, 2ppl
          </StatRow>
        </>
      );
    case "gb-crons":
      return (
        <>
          <StatRow label="delilah-recon">
            <Pill variant="ok">ok</Pill> 6h
          </StatRow>
          <StatRow label="dtf-drop-time">
            <Pill variant="ok">ok</Pill> 2h
          </StatRow>
          <StatRow label="dtf-march29">
            <Pill variant="ok">ok</Pill> 6h
          </StatRow>
        </>
      );
    case "claude-cost":
      return (
        <div className="text-center">
          <div className="text-[2.4rem] max-md:text-[1.8rem] font-bold leading-none text-danger">
            {claude ? `$${claude.totalCost.toFixed(2)}` : claudeLoading ? "…" : "—"}
          </div>
          <div className="text-muted text-[0.72rem] mt-1">
            {claude ? `${(claude.totalTokens / 1_000_000).toFixed(1)}M tokens · ${claude.cacheHitRate}% cache hit` : "\u00A0"}
          </div>
        </div>
      );
    case "claude-daily":
      return <MiniChart data={claude?.dailyChart} />;
    case "claude-sessions":
      return (
        <>
          <div className="mb-2">
            <StatRow label="main">
              <span className="text-success">10%</span>
            </StatRow>
            <BarProgress percent={10} color="green" />
          </div>
          <div>
            <StatRow label="discord (general)">
              <span className="text-orange">84%</span>
            </StatRow>
            <BarProgress percent={84} color="orange" />
          </div>
        </>
      );
    case "oc-vitals":
      return (
        <KpiRow
          items={[
            { value: gatewayOk ? "✓" : "✗", label: "Gateway", color: gatewayOk ? "green" : "red" },
            { value: String(activeSessions.length), label: "Sessions" },
            { value: String(agents.length || 3), label: "Agents" },
            { value: String(crons.length || 5), label: "Crons" },
          ]}
        />
      );
    case "oc-channels":
      return Object.keys(channels).length > 0 ? (
        <>
          {Object.entries(channels).map(([name, ok]) => (
            <DotRow key={name} color={ok ? "green" : "red"} text={name} pill={ok ? "OK" : "down"} />
          ))}
        </>
      ) : (
        <>
          <DotRow color="green" text="Discord" pill="OK" />
          <DotRow color="green" text="Signal" pill="OK" />
          <DotRow color="green" text="iMessage" pill="OK" />
          <DotRow color="green" text="WebChat" pill="OK" />
        </>
      );
    case "oc-crons":
      return crons.length > 0 ? (
        <>
          {crons.slice(0, 5).map((c) => (
            <StatRow key={c.name} label={c.name}>
              <Pill variant={c.status === "error" ? "error" : c.status === "ok" ? "ok" : "idle"}>
                {c.status ?? "idle"}
              </Pill>
            </StatRow>
          ))}
        </>
      ) : (
        <>
          <StatRow label="hitthepin-daily-traffic">
            <Pill variant="idle">idle</Pill>
          </StatRow>
          <StatRow label="delilah-recon">
            <Pill variant="ok">ok</Pill>
          </StatRow>
          <StatRow label="geoff-golf-content">
            <Pill variant="ok">ok</Pill>
          </StatRow>
          <StatRow label="google-index-submit">
            <Pill variant="error">error</Pill>
          </StatRow>
          <StatRow label="hitthepin-seo-audit">
            <Pill variant="idle">idle</Pill>
          </StatRow>
        </>
      );
    default:
      return <div className="text-muted text-[0.8rem]">Unknown widget</div>;
  }
}

function DotRow({
  color,
  text,
  pill,
}: {
  color: string;
  text: string;
  pill?: string;
}) {
  const dotColor =
    color === "green"
      ? "bg-success"
      : color === "yellow"
        ? "bg-warn"
        : "bg-danger";
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0 text-[0.82rem]">
      <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <span>{text}</span>
      {pill && (
        <Pill variant="ok" className="ml-auto">
          {pill}
        </Pill>
      )}
    </div>
  );
}

const FALLBACK_DAILY = [
  { label: "2/19", cost: 0.16 },
  { label: "2/20", cost: 2.26 },
  { label: "2/22", cost: 0.23 },
  { label: "2/24", cost: 1.71 },
  { label: "2/25", cost: 47.41 },
  { label: "2/26", cost: 29.31 },
  { label: "2/27", cost: 6.86 },
  { label: "2/28", cost: 70.55 },
  { label: "3/1", cost: 14.16 },
];

function MiniChart({ data }: { data?: { label: string; cost: number }[] }) {
  const chartData = data && data.length > 0 ? data : FALLBACK_DAILY;
  const mx = Math.max(...chartData.map((d) => d.cost), 0.01);
  return (
    <>
      <div className="flex items-end gap-0.5 h-20 max-md:h-[60px]">
        {chartData.map((d) => {
          const pct = (d.cost / mx) * 100;
          const bg =
            d.cost > 40
              ? "bg-danger"
              : d.cost > 15
                ? "bg-orange"
                : d.cost > 5
                  ? "bg-warn"
                  : "bg-accent";
          return (
            <div
              key={d.label}
              className={`flex-1 rounded-t-sm min-w-2 transition-[height] duration-300 relative cursor-default group ${bg}`}
              style={{ height: `${Math.max(pct, 2)}%` }}
              title={`$${d.cost.toFixed(2)}`}
            >
              <div className="hidden group-hover:block absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-black text-white py-0.5 px-1.5 rounded text-[0.62rem] whitespace-nowrap z-10">
                ${d.cost.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-0.5 mt-0.5">
        {chartData.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center text-[0.55rem] text-muted"
          >
            {d.label}
          </span>
        ))}
      </div>
    </>
  );
}
