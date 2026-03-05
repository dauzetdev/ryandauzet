import { PROJECTS } from "../../lib/constants";
import type { ProjectId } from "../../types";
import { ProjectTile } from "./ProjectTile";

interface TilesGridProps {
  onSelect: (id: ProjectId) => void;
}

export function TilesGrid({ onSelect }: TilesGridProps) {
  return (
    <div className="tiles-grid grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-6">
      {PROJECTS.map((project) => (
        <ProjectTile
          key={project.id}
          project={project}
          onClick={() => onSelect(project.id)}
        />
      ))}
    </div>
  );
}
