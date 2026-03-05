import { useState } from "react";
import type { AppView, ProjectId } from "./types";
import { Header } from "./components/layout/Header";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DetailView } from "./components/layout/DetailView";

export default function App() {
  const [view, setView] = useState<AppView>({ mode: "dashboard" });

  const handleSelect = (project: ProjectId) => {
    setView({ mode: "detail", project });
  };

  const handleBack = () => {
    setView({ mode: "dashboard" });
  };

  const handleRefresh = () => {
    // Wired to React Query invalidation in Phase 3+
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <Header view={view} onBack={handleBack} onRefresh={handleRefresh} />
      <main>
        {view.mode === "dashboard" ? (
          <DashboardView onSelect={handleSelect} />
        ) : (
          <DetailView key={view.project} project={view.project} />
        )}
      </main>
    </div>
  );
}
