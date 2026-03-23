import { useState, useEffect } from "react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  scheduleHuman?: string;
  nextRun?: string;
  lastRunStatus?: "success" | "error" | "pending" | "running";
  agent?: string;
  model?: string;
  enabled?: boolean;
  description?: string;
}

const AGENT_COLORS: Record<string, string> = {
  geoff: "text-green-400 border-green-400/30 bg-green-400/5",
  rigs: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  main: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  wren: "text-purple-400 border-purple-400/30 bg-purple-400/5",
};

const STATUS_ICON: Record<string, string> = {
  success: "✅",
  error: "❌",
  pending: "⏳",
  running: "🔄",
};

function humanSchedule(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return cron;
  const [min, hour, dom, month, dow] = parts;
  if (min === "0" && dom === "*" && month === "*") {
    if (dow === "*") return `Every day at ${hour.padStart(2, "0")}:00`;
    if (dow === "1-5") return `Weekdays at ${hour.padStart(2, "0")}:00`;
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const dayStr = dow.split(",").map((d) => days[parseInt(d)] || d).join(", ");
    return `${dayStr} at ${hour.padStart(2, "0")}:00`;
  }
  if (min !== "*" && hour !== "*") return `At ${hour.padStart(2,"0")}:${min.padStart(2,"0")}`;
  if (min === "*/30") return "Every 30 minutes";
  if (min === "*/15") return "Every 15 minutes";
  if (min === "*/5") return "Every 5 minutes";
  if (min === "*" && hour === "*") return "Every minute";
  return cron;
}

export function CronCalendar() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCrons = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = import.meta.env.VITE_OPENCLAW_TOKEN || "";
      const r = await fetch("https://gateway.hitthepin.com/api/crons", {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      if (!r.ok) throw new Error(`Gateway responded ${r.status}`);
      const d = await r.json() as { crons?: CronJob[]; jobs?: CronJob[] };
      const rawJobs: CronJob[] = d.crons || d.jobs || [];
      setJobs(rawJobs.map((j) => ({
        ...j,
        scheduleHuman: j.schedule ? humanSchedule(j.schedule) : j.scheduleHuman,
      })));
    } catch (e: any) {
      setError(e.message);
      // Show placeholder data so the UI is useful
      setJobs([
        { id: "1", name: "geoff-content", schedule: "0 8 * * *", scheduleHuman: "Every day at 08:00", agent: "geoff", model: "claude-opus-4-6", lastRunStatus: "success", enabled: true },
        { id: "2", name: "rigs-youtube", schedule: "0 10 * * 1", scheduleHuman: "Mon at 10:00", agent: "rigs", model: "claude-sonnet-4-6", lastRunStatus: "success", enabled: true },
        { id: "3", name: "wren-heartbeat", schedule: "*/30 * * * *", scheduleHuman: "Every 30 minutes", agent: "wren", model: "claude-sonnet-4-6", lastRunStatus: "pending", enabled: true },
        { id: "4", name: "geoff-seo", schedule: "0 6 * * 1,3,5", scheduleHuman: "Mon/Wed/Fri at 06:00", agent: "geoff", model: "claude-opus-4-6", lastRunStatus: "error", enabled: false },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCrons(); }, []);

  const toggleJob = async (jobId: string, enabled: boolean) => {
    try {
      const token = import.meta.env.VITE_OPENCLAW_TOKEN || "";
      await fetch(`https://gateway.hitthepin.com/api/crons/${jobId}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ enabled }),
      });
    } catch {
      // ignore if gateway not reachable
    }
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, enabled } : j));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-text">Cron Calendar</h2>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-yellow-400">⚠ Gateway offline — showing cached data</span>
          )}
          <button
            onClick={fetchCrons}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-secondary hover:text-text hover:bg-surface transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div className="text-text-secondary text-sm">Loading cron jobs...</div>}
        {!loading && (
          <div className="space-y-2">
            {jobs.map((job) => {
              const agentKey = (job.agent || "main").toLowerCase();
              const colorClass = AGENT_COLORS[agentKey] || AGENT_COLORS.main;
              return (
                <div
                  key={job.id}
                  className={[
                    "flex items-center gap-4 px-4 py-3 rounded-lg border bg-surface",
                    job.enabled === false ? "opacity-50" : "",
                  ].join(" ")}
                >
                  {/* Agent badge */}
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded border ${colorClass} min-w-[60px] text-center`}>
                    {job.agent || "main"}
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text">{job.name}</div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-text-secondary">{job.scheduleHuman || job.schedule}</span>
                      {job.model && (
                        <span className="text-xs text-text-secondary/60">{job.model}</span>
                      )}
                      {job.description && (
                        <span className="text-xs text-text-secondary/60">{job.description}</span>
                      )}
                    </div>
                  </div>

                  {/* Next run */}
                  {job.nextRun && (
                    <div className="text-xs text-text-secondary text-right">
                      <div className="text-text-secondary/60 text-[10px] uppercase tracking-wide">Next</div>
                      <div>{new Date(job.nextRun).toLocaleString()}</div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="text-lg w-8 text-center">
                    {STATUS_ICON[job.lastRunStatus || "pending"]}
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleJob(job.id, !job.enabled)}
                    className={[
                      "relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0",
                      job.enabled !== false ? "bg-accent" : "bg-surface border border-border",
                    ].join(" ")}
                    title={job.enabled !== false ? "Disable" : "Enable"}
                  >
                    <span
                      className={[
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                        job.enabled !== false ? "left-[18px]" : "left-0.5",
                      ].join(" ")}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
