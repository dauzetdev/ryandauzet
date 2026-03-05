import { PROJECTS } from "../../lib/constants";
import type { ProjectId } from "../../types";
import { ProjectTile } from "./ProjectTile";

interface TilesGridProps {
  onSelect: (id: ProjectId) => void;
}

export function TilesGrid({ onSelect }: TilesGridProps) {
  return (
    <div className="tiles-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
