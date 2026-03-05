import type { ProjectId } from "../../types";
import { HitThePinTab } from "../tabs/HitThePinTab";
import { SaturdayGameTab } from "../tabs/SaturdayGameTab";
import { GolfBookerTab } from "../tabs/GolfBookerTab";
import { ClaudeTab } from "../tabs/ClaudeTab";
import { OpenClawTab } from "../tabs/OpenClawTab";

const COMPONENT_MAP: Record<ProjectId, React.FC> = {
  openclaw: OpenClawTab,
  hitthepin: HitThePinTab,
  saturdaygame: SaturdayGameTab,
  golfbooker: GolfBookerTab,
  claude: ClaudeTab,
};

interface DetailViewProps {
  project: ProjectId;
}

export function DetailView({ project }: DetailViewProps) {
  const Component = COMPONENT_MAP[project];
  return (
    <div className="tab-content px-2 md:px-4 py-8">
      <Component />
    </div>
  );
}
