import type { ProjectDef } from "../../types";
import { useSessions, recentSessions } from "../../hooks/useSessions";
import { useVitals } from "../../hooks/useVitals";
import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useHitThePinStats } from "../../hooks/useHitThePinStats";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";

interface ProjectTileProps {
  project: ProjectDef;
  onClick: () => void;
}

export function ProjectTile({ project, onClick }: ProjectTileProps) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full bg-white/[0.07] backdrop-blur-md border border-white/[0.10] rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:bg-white/[0.10] hover:border-white/[0.18] active:scale-[0.98] active:translate-y-0"
      style={{
        // Accent glow on hover via box-shadow
        "--tile-glow": `0 8px 40px ${project.accentHex}22, 0 0 0 1px ${project.accentHex}18`,
      } as React.CSSProperties}
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: `0 8px 40px ${project.accentHex}20, 0 0 0 1px ${project.accentHex}15` }}
      />

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl leading-none">{project.icon}</span>
        <div>
          <h3 className="text-base font-semibold text-white/90">{project.label}</h3>
          <p className="text-xs text-white/40">{project.subtitle}</p>
        </div>
      </div>

      <div className="border-t border-white/[0.07] pt-3">
        <TileMetrics projectId={project.id} />
      </div>
    </button>
  );
}

function TileMetrics({ projectId }: { projectId: string }) {
  switch (projectId) {
    case "openclaw":
      return <OpenClawMetrics />;
    case "hitthepin":
      return <HitThePinMetrics />;
    case "saturdaygame":
      return <SaturdayGameMetrics />;
    case "golfbooker":
      return <GolfBookerMetrics />;
    case "claude":
      return <ClaudeMetrics />;
    default:
      return null;
  }
}

function MetricItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-lg font-bold" style={color ? { color } : undefined}>{value}</span>
      <span className="text-xs text-white/35">{label}</span>
    </div>
  );
}

function OpenClawMetrics() {
  const { data: sessions, error: sessionsError } = useSessions();
  const { data: vitals } = useVitals();
  const activeSessions = sessions ? recentSessions(sessions) : [];
  const gatewayOk = !sessionsError;
  const agents = vitals?.agents ?? [];

  return (
    <div className="flex gap-6">
      <MetricItem label="Gateway" value={gatewayOk ? "Online" : "Down"} color={gatewayOk ? "#22c55e" : "#ef4444"} />
      <MetricItem label="Sessions" value={String(activeSessions.length)} />
      <MetricItem label="Agents" value={String(agents.length || 3)} />
    </div>
  );
}

function HitThePinMetrics() {
  const { data: stats, isLoading } = useHitThePinStats();
  return (
    <div className="flex gap-6">
      <MetricItem label="Courses" value={stats ? stats.courses.toLocaleString() : isLoading ? "..." : "1,660+"} color="#22c55e" />
      <MetricItem label="Pages" value={stats ? stats.reviewPages.toLocaleString() : isLoading ? "..." : "6,400+"} color="#3b82f6" />
      <MetricItem label="States" value={stats ? String(stats.states) : isLoading ? "..." : "22"} color="#a855f7" />
    </div>
  );
}

function SaturdayGameMetrics() {
  const { data: stats, isLoading } = useSaturdayGameStats();
  return (
    <div className="flex gap-6">
      <MetricItem label="Users" value={stats ? String(stats.users) : isLoading ? "..." : "--"} />
      <MetricItem label="Rounds" value={stats ? String(stats.rounds) : isLoading ? "..." : "--"} />
    </div>
  );
}

function GolfBookerMetrics() {
  return (
    <p className="text-xs text-white/35">Reservation targets & cron jobs</p>
  );
}

function ClaudeMetrics() {
  const { data: claude, isLoading } = useClaudeUsage();
  return (
    <div className="flex gap-6">
      <MetricItem
        label="30-day cost"
        value={claude ? `$${claude.totalCost.toFixed(2)}` : isLoading ? "..." : "--"}
        color="#ef4444"
      />
      <MetricItem
        label="Tokens"
        value={claude ? `${(claude.totalTokens / 1_000_000).toFixed(1)}M` : isLoading ? "..." : "--"}
      />
      <MetricItem
        label="Cache hit"
        value={claude ? `${claude.cacheHitRate}%` : isLoading ? "..." : "--"}
      />
    </div>
  );
}
