import type { PageId } from "../../types";
import { PAGES } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SidebarItem } from "./SidebarItem";
import { SidebarIcon } from "./SidebarIcon";

interface Props {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ activePage, onNavigate }: Props) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navPages = PAGES.filter((p) => p.id !== "settings");
  const settingsPage = PAGES.find((p) => p.id === "settings")!;

  const nextTheme = () => {
    const cycle: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
    setTheme(cycle[theme]);
  };

  const themeIcon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "monitor";
  const themeLabel = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  return (
    <aside className="fixed top-0 left-0 w-60 h-screen bg-sidebar border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border shrink-0">
        <span className="text-xl">🐦</span>
        <span className="font-semibold text-sm text-text">Command Center</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navPages.map((page) => (
          <SidebarItem
            key={page.id}
            icon={page.icon}
            label={page.label}
            active={activePage === page.id}
            onClick={() => onNavigate(page.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3 space-y-0.5 shrink-0">
        <SidebarItem
          icon={settingsPage.icon}
          label={settingsPage.label}
          active={activePage === "settings"}
          onClick={() => onNavigate("settings")}
        />
        <button
          onClick={nextTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface hover:text-text transition-colors cursor-pointer"
        >
          <SidebarIcon name={themeIcon} size={18} />
          <span>{themeLabel}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface hover:text-danger transition-colors cursor-pointer"
        >
          <SidebarIcon name="log-out" size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
