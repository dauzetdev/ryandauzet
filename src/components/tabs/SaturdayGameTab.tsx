import { Card } from "../ui/Card";
import { KpiRow } from "../ui/KpiRow";
import { StatRow } from "../ui/StatRow";
import { useSaturdayGameStats } from "../../hooks/useSaturdayGameStats";

export function SaturdayGameTab() {
  const { data, isLoading, error } = useSaturdayGameStats();
  const configured = !!import.meta.env.VITE_SG_FIREBASE_API_KEY;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">🏌️ SaturdayGame</h1>
      <div className="text-sm text-muted mb-5">
        iOS/macOS golf app — Firebase backend
      </div>

      <div className="mb-4">
        <KpiRow
          items={[
            {
              value: isLoading ? "…" : error || !configured ? "—" : String(data?.users ?? "—"),
              label: "Users",
              color: "accent",
            },
            {
              value: isLoading ? "…" : error || !configured ? "—" : String(data?.rounds ?? "—"),
              label: "Rounds Logged",
              color: "green",
            },
            { value: "—", label: "App Store Rating", color: "purple" },
            { value: "—", label: "DAU", color: "yellow" },
          ]}
        />
      </div>

      {!configured && (
        <div className="mb-4 px-4 py-3 bg-warn/10 border border-warn/20 rounded-xl text-sm text-warn">
          Add <code className="font-mono bg-black/20 px-1 rounded">VITE_SG_FIREBASE_API_KEY</code> to connect live Firebase data.
        </div>
      )}

      {configured && error && (
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
          {!configured ? (
            <div className="text-muted text-sm py-5 text-center">
              Configure <code className="font-mono text-xs bg-white/5 px-1 rounded">VITE_SG_FIREBASE_API_KEY</code> to see live data
            </div>
          ) : isLoading ? (
            <div className="text-muted text-sm py-5 text-center">Loading…</div>
          ) : error ? (
            <div className="text-danger text-sm py-5 text-center">
              Could not load data
            </div>
          ) : (
            <>
              <StatRow label="Total users">{data?.users ?? "—"}</StatRow>
              <StatRow label="Total rounds">{data?.rounds ?? "—"}</StatRow>
              <StatRow label="App Store Rating">— (connect API)</StatRow>
              <StatRow label="DAU">— (connect API)</StatRow>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
