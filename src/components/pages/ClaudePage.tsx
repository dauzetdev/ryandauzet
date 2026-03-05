import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/Card";
import { PageHeader } from "../ui/PageHeader";
import { KpiRow } from "../ui/KpiCard";
import { BarProgress } from "../ui/BarProgress";
import { StatRow } from "../ui/StatRow";
import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useTheme } from "../../context/ThemeContext";

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

interface Props { scrollY: number }

export function ClaudePage({ scrollY }: Props) {
  const { data, isLoading, error } = useClaudeUsage();
  const { resolved } = useTheme();

  const totalCost = data ? `$${data.totalCost.toFixed(2)}` : isLoading ? "…" : "—";
  const totalTokens = data ? fmt(data.totalTokens) : isLoading ? "…" : "—";
  const cacheHit = data ? `${data.cacheHitRate}%` : isLoading ? "…" : "—";
  const peakDay = data ? `$${data.peakDayCost.toFixed(2)}` : isLoading ? "…" : "—";

  const llmData = data?.llmChart ?? [];
  const cloudTotal = llmData.reduce((s, d) => s + d.cloud, 0);
  const localTotal = llmData.reduce((s, d) => s + d.local, 0);
  const cloudShare = cloudTotal + localTotal > 0
    ? Math.round((cloudTotal / (cloudTotal + localTotal)) * 100) : 0;

  const tooltipStyle = {
    contentStyle: {
      background: resolved === "dark" ? "#1c1c1e" : "#ffffff",
      border: `1px solid ${resolved === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: "12px",
      fontSize: "0.75rem",
      padding: "6px 10px",
      color: resolved === "dark" ? "#f5f5f7" : "#1d1d1f",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    cursor: { fill: resolved === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
  };

  const axisColor = resolved === "dark" ? "#636366" : "#aeaeb2";

  return (
    <div>
      <PageHeader title="Claude Usage" subtitle="API cost & token consumption" />

      {error && (
        <div className="mb-5 px-4 py-3 bg-danger/8 border border-danger/15 rounded-xl text-sm text-danger">
          Could not load Claude usage: {(error as Error).message}
        </div>
      )}

      <div className="mb-6">
        <KpiRow
          items={[
            { value: totalCost, label: "30-Day Cost", color: "red" },
            { value: totalTokens, label: "Tokens (30d)", color: "blue" },
            { value: cacheHit, label: "Cache Hit Rate", color: "green" },
            { value: peakDay, label: "Peak Day", color: "orange" },
          ]}
        />
      </div>

      <Card title="Local vs Cloud LLM Usage (Output Tokens)" icon="🖥️" wide className="mb-5" depth={0} scrollY={scrollY}>
        <div className="flex gap-6 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-accent" />
            <span className="text-xs text-text-secondary">Cloud (Anthropic)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-success" />
            <span className="text-xs text-text-secondary">Local (Ollama)</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[160px] flex items-center justify-center text-text-secondary text-sm">Loading…</div>
        ) : llmData.length === 0 ? (
          <div className="h-[160px] flex items-center justify-center text-text-secondary text-sm">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={llmData} barCategoryGap="20%" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: number, name: string) => [
                  `${(value / 1000).toFixed(1)}K tokens`,
                  name === "cloud" ? "Cloud" : "Local",
                ]}
              />
              <Bar dataKey="cloud" stackId="a" fill="#007aff" name="cloud" />
              <Bar dataKey="local" stackId="a" fill="#34c759" name="local" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-[1.6rem] font-bold text-accent leading-none">{fmt(cloudTotal)}</div>
            <div className="text-xs text-text-secondary mt-1">Cloud Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-[1.6rem] font-bold text-success leading-none">{fmt(localTotal)}</div>
            <div className="text-xs text-text-secondary mt-1">Local Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-[1.6rem] font-bold text-text-secondary leading-none">{cloudShare}%</div>
            <div className="text-xs text-text-secondary mt-1">Cloud Share</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-5">
        <Card title="Cost Breakdown (30d)" icon="💸" depth={1} scrollY={scrollY}>
          {data ? (
            <>
              <StatRow label={`Input (${fmt(data.totalInput)} tokens)`}>
                <span className="text-accent">${((data.totalInput / 1_000_000) * 3).toFixed(2)}</span>
              </StatRow>
              <StatRow label={`Output (${fmt(data.totalOutput)} tokens)`}>
                <span className="text-purple">${((data.totalOutput / 1_000_000) * 15).toFixed(2)}</span>
              </StatRow>
              <StatRow label={`Cache reads (${fmt(data.totalCacheRead)})`}>
                <span className="text-success">${((data.totalCacheRead / 1_000_000) * 0.3).toFixed(2)}</span>
              </StatRow>
              <StatRow label={`Cache writes (${fmt(data.totalCacheWrite)})`}>
                <span className="text-warn">${((data.totalCacheWrite / 1_000_000) * 3.75).toFixed(2)}</span>
              </StatRow>
              <div className="mt-3 text-xs text-text-secondary">
                Cache writes (cold misses) are the biggest cost driver.
              </div>
            </>
          ) : (
            <div className="text-text-secondary text-sm py-4 text-center">{isLoading ? "Loading…" : "—"}</div>
          )}
        </Card>

        <Card title="Session Token Budgets" icon="🔑" depth={2} scrollY={scrollY}>
          <SessionBudget name="main (direct)" used={19} max={200} percent={10} color="green" />
          <SessionBudget name="discord (#general)" used={167} max={200} percent={84} color="orange" />
          <SessionBudget name="discord (#din-tai-fung)" used={137} max={200} percent={69} color="yellow" />
          <SessionBudget name="discord (#ryandauzet)" used={109} max={200} percent={55} color="yellow" />
        </Card>

        <Card title="Model Config" icon="🧠" depth={1} scrollY={scrollY}>
          <StatRow label="Default model">claude-sonnet-4-6</StatRow>
          <StatRow label="Geoff agent">claude-sonnet-4-6</StatRow>
          <StatRow label="Cron overrides">Sonnet for recon jobs</StatRow>
        </Card>
      </div>
    </div>
  );
}

function SessionBudget({ name, used, max, percent, color }: {
  name: string; used: number; max: number; percent: number; color: string;
}) {
  const colorClass = color === "green" ? "text-success" : color === "orange" ? "text-warn" : "text-warn";
  return (
    <div className="mb-3 last:mb-0">
      <StatRow label={name}>
        {used}k / {max}k <span className={colorClass}>{percent}%</span>
      </StatRow>
      <BarProgress percent={percent} color={color} />
    </div>
  );
}
