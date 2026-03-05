import type { PageId } from "../../types";
import { PAGES } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SidebarIcon } from "./SidebarIcon";

interface Props {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const PAGE_EMOJIS: Record<string, string> = {
  dashboard:    "🏠",
  openclaw:     "🦞",
  hitthepin:    "⛳",
  saturdaygame: "🏌️",
  golfbooker:   "📅",
  claude:       "🤖",
  settings:     "⚙️",
};

export function Header({ activePage, onNavigate }: Props) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navPages = PAGES.filter((p) => p.id !== "settings");

  const nextTheme = () => {
    const cycle: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
    setTheme(cycle[theme]);
  };

  const themeIcon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "monitor";

  return (
    <header className="h-[53px] shrink-0 bg-sidebar border-b border-border flex items-center px-4 gap-1 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4 shrink-0">
        <span className="text-lg">🐦</span>
        <span className="font-semibold text-sm text-text hidden sm:block">Command Center</span>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
        {navPages.map((p) => (
          <button
            key={p.id}
            onClick={() => onNavigate(p.id)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0",
              activePage === p.id
                ? "bg-accent/15 text-accent"
                : "text-text-secondary hover:text-text hover:bg-surface",
            ].join(" ")}
          >
            <span className="text-base leading-none">{PAGE_EMOJIS[p.id]}</span>
            <span className="hidden md:block">{p.label}</span>
          </button>
        ))}
      </nav>

      {/* Right side controls */}
      <div className="flex items-center gap-1 ml-2 shrink-0">
        <button
          onClick={nextTheme}
          title="Toggle theme"
          className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface transition-colors cursor-pointer"
        >
          <SidebarIcon name={themeIcon} size={17} />
        </button>
        <button
          onClick={() => onNavigate("settings")}
          title="Settings"
          className={[
            "p-2 rounded-lg transition-colors cursor-pointer",
            activePage === "settings"
              ? "text-accent bg-accent/10"
              : "text-text-secondary hover:text-text hover:bg-surface",
          ].join(" ")}
        >
          <SidebarIcon name="settings" size={17} />
        </button>
        <button
          onClick={logout}
          title="Sign out"
          className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-surface transition-colors cursor-pointer"
        >
          <SidebarIcon name="log-out" size={17} />
        </button>
      </div>
    </header>
  );
}
