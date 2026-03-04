import { Card } from "../ui/Card";
import { KpiRow } from "../ui/KpiRow";
import { StatRow } from "../ui/StatRow";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";

export function SaturdayGameTab() {
  const { data, isLoading, error } = useSaturdayGameStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">🏌️ SaturdayGame</h1>
      <div className="text-sm text-muted mb-5">
        iOS/macOS golf app — Firebase backend
      </div>

      <div className="mb-4">
        <KpiRow
          items={[
            { value: isLoading ? "…" : error ? "—" : String(data?.users ?? "—"), label: "Users", color: "accent" },
            { value: isLoading ? "…" : error ? "—" : String(data?.rounds ?? "—"), label: "Score Sessions", color: "green" },
            { value: isLoading ? "…" : error ? "—" : String(data?.tournaments ?? "—"), label: "Tournaments", color: "purple" },
            { value: isLoading ? "…" : error ? "—" : String(data?.groups ?? "—"), label: "Groups", color: "yellow" },
          ]}
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
          Firebase error: {(error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] max-md:grid-cols-1 gap-4">
        <Card title="App Status" icon="📱">
          <StatRow label="Platform">iOS + macOS</StatRow>
          <StatRow label="Backend">Firebase</StatRow>
          <StatRow label="Project">saturdaygame-10f98</StatRow>
          <StatRow label="Repo">/Users/dauzet/dev/SaturdayGame</StatRow>
        </Card>

        <Card title="Analytics" icon="📊">
          {isLoading ? (
            <div className="text-muted text-sm py-5 text-center">Loading…</div>
          ) : error ? (
            <div className="text-danger text-sm py-5 text-center">
              Could not load data
            </div>
          ) : (
            <>
              <StatRow label="Users">{data?.users ?? "—"}</StatRow>
              <StatRow label="Score sessions">{data?.rounds ?? "—"}</StatRow>
              <StatRow label="Tournaments">{data?.tournaments ?? "—"}</StatRow>
              <StatRow label="Groups">{data?.groups ?? "—"}</StatRow>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
