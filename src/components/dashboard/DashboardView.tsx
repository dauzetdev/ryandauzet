import type { ProjectId } from "../../types";
import { GreetingBar } from "./GreetingBar";
import { TilesGrid } from "./TilesGrid";

interface DashboardViewProps {
  onSelect: (id: ProjectId) => void;
}

export function DashboardView({ onSelect }: DashboardViewProps) {
  return (
    <div className="tab-content px-10 md:px-16 lg:px-24 py-10">
      <GreetingBar />
      <TilesGrid onSelect={onSelect} />
    </div>
  );
}
