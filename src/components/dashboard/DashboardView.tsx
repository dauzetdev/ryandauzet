import type { ProjectId } from "../../types";
import { GreetingBar } from "./GreetingBar";
import { TilesGrid } from "./TilesGrid";

interface DashboardViewProps {
  onSelect: (id: ProjectId) => void;
}

export function DashboardView({ onSelect }: DashboardViewProps) {
  return (
    <div className="tab-content px-2 md:px-4 py-8">
      <GreetingBar />
      <TilesGrid onSelect={onSelect} />
    </div>
  );
}
