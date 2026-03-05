import { SidebarIcon } from "./SidebarIcon";

interface Props {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon, label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-accent/10 text-accent"
          : "text-text-secondary hover:bg-surface hover:text-text"
      }`}
    >
      <SidebarIcon name={icon} size={18} />
      <span>{label}</span>
    </button>
  );
}
