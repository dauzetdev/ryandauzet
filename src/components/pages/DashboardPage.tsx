import { PROJECTS } from "../../lib/constants";
import { useVitals } from "../../hooks/useVitals";
import { useSessions, recentSessions } from "../../hooks/useSessions";
import { useClaudeUsage } from "../../hooks/useClaudeUsage";
import { useHitThePinStats } from "../../hooks/useHitThePinStats";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";
import { Card } from "../ui/Card";
import { StatusDot } from "../ui/StatusDot";
import { PageHeader } from "../ui/PageHeader";

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function Greeting() {
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-text">{greeting}, Ryan</h2>
      <p className="text-sm text-text-secondary mt-0.5">{dateStr}</p>
    </div>
  );
}

interface Props { scrollY: number }

export function DashboardPage({ scrollY }: Props) {
  const { data: vitals } = useVitals();
  const { data: sessions, error: sessionsError } = useSessions();
  const { data: claude } = useClaudeUsage();
  const { data: htp } = useHitThePinStats();
  const { data: sg } = useSaturdayGameStats();

  const active = sessions ? recentSessions(sessions) : [];
  const gatewayOk = !sessionsError;

  return (
    <div>
      <Greeting />

      <div className="flex flex-wrap gap-5">
        {/* OpenClaw */}
        <Card depth={1} scrollY={scrollY}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PROJECTS[0].icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-text">{PROJECTS[0].label}</h3>
              <p className="text-xs text-text-secondary">{PROJECTS[0].subtitle}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Gateway</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status={gatewayOk ? "ok" : "error"} />
                <span className="text-text">{gatewayOk ? "Online" : "Offline"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Active Sessions</span>
              <span className="text-text font-medium">{active.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Agents</span>
              <span className="text-text font-medium">{vitals?.agents?.length ?? 3}</span>
            </div>
          </div>
        </Card>

        {/* HitThePin */}
        <Card depth={2} scrollY={scrollY}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PROJECTS[1].icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-text">{PROJECTS[1].label}</h3>
              <p className="text-xs text-text-secondary">{PROJECTS[1].subtitle}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Courses</span>
              <span className="text-text font-medium">{htp ? htp.courses.toLocaleString() : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Review Pages</span>
              <span className="text-text font-medium">{htp ? htp.reviewPages.toLocaleString() : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">States</span>
              <span className="text-text font-medium">{htp ? String(htp.states) : "—"}</span>
            </div>
          </div>
        </Card>

        {/* SaturdayGame */}
        <Card depth={1} scrollY={scrollY}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PROJECTS[2].icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-text">{PROJECTS[2].label}</h3>
              <p className="text-xs text-text-secondary">{PROJECTS[2].subtitle}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Users</span>
              <span className="text-text font-medium">{sg?.users ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Rounds</span>
              <span className="text-text font-medium">{sg?.rounds ?? "—"}</span>
            </div>
          </div>
        </Card>

        {/* GolfBooker */}
        <Card depth={2} scrollY={scrollY}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PROJECTS[3].icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-text">{PROJECTS[3].label}</h3>
              <p className="text-xs text-text-secondary">{PROJECTS[3].subtitle}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm text-text-secondary">
            <p>Automated tee-time reservation system with multi-account support and scheduling.</p>
          </div>
        </Card>

        {/* Claude */}
        <Card depth={1} scrollY={scrollY}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{PROJECTS[4].icon}</span>
            <div>
              <h3 className="font-semibold text-sm text-text">{PROJECTS[4].label}</h3>
              <p className="text-xs text-text-secondary">{PROJECTS[4].subtitle}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">30-Day Cost</span>
              <span className="text-text font-medium">{claude ? `$${claude.totalCost.toFixed(2)}` : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Tokens</span>
              <span className="text-text font-medium">{claude ? fmt(claude.totalTokens) : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Cache Hit</span>
              <span className="text-text font-medium">{claude ? `${claude.cacheHitRate}%` : "—"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
