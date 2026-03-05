import { Card } from "../ui/Card";
import { KpiRow } from "../ui/KpiCard";
import { PageHeader } from "../ui/PageHeader";
import { StatRow } from "../ui/StatRow";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";

interface Props { scrollY: number }

export function SaturdayGamePage({ scrollY }: Props) {
  const { data, isLoading, error } = useSaturdayGameStats();

  return (
    <div>
      <PageHeader title="SaturdayGame" subtitle="iOS/macOS golf app — Firebase backend" />

      <div className="mb-6">
        <KpiRow
          items={[
            { value: isLoading ? "…" : error ? "—" : String(data?.users ?? "—"), label: "Users", color: "blue" },
            { value: isLoading ? "…" : error ? "—" : String(data?.rounds ?? "—"), label: "Score Sessions", color: "green" },
            { value: isLoading ? "…" : error ? "—" : String(data?.tournaments ?? "—"), label: "Tournaments", color: "purple" },
            { value: isLoading ? "…" : error ? "—" : String(data?.groups ?? "—"), label: "Groups", color: "yellow" },
          ]}
        />
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-danger/8 border border-danger/15 rounded-xl text-sm text-danger">
          Firebase error: {(error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card title="App Status" icon="📱" depth={1} scrollY={scrollY}>
          <StatRow label="Platform">iOS + macOS</StatRow>
          <StatRow label="Backend">Firebase</StatRow>
          <StatRow label="Project">saturdaygame-10f98</StatRow>
          <StatRow label="Repo">/Users/dauzet/dev/SaturdayGame</StatRow>
        </Card>

        <Card title="Analytics" icon="📊" depth={2} scrollY={scrollY}>
          {isLoading ? (
            <div className="text-text-secondary text-sm py-5 text-center">Loading…</div>
          ) : error ? (
            <div className="text-danger text-sm py-5 text-center">Could not load data</div>
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
