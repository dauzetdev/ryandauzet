import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SidebarIcon } from "./SidebarIcon";
import { MemoryBrowser } from "../mission/MemoryBrowser";
import { TaskBoard } from "../mission/TaskBoard";
import { CronCalendar } from "../mission/CronCalendar";
import { Projects } from "../mission/Projects";
import { TeamScreen } from "../mission/TeamScreen";
import { DocsScreen } from "../mission/DocsScreen";

type IframeTabId = "openclaw" | "claude" | "saturdaygame" | "hitthepin";
type MissionTabId = "memory" | "tasks" | "crons" | "projects" | "team" | "docs";
type TabId = IframeTabId | MissionTabId;

const IFRAME_TABS: { id: IframeTabId; emoji: string; label: string; src: string }[] = [
  { id: "openclaw",     emoji: "🦞", label: "OpenClaw",     src: "https://lobsterboard.hitthepin.com" },
  { id: "claude",       emoji: "🤖", label: "Claude Usage", src: "/claude-code-stats.html" },
  { id: "saturdaygame", emoji: "🏌️", label: "Saturday Game", src: "/saturdaygame-stats.html" },
  { id: "hitthepin",    emoji: "📍", label: "HitThePin",    src: "/hitthepin-stats.html" },
];

const MISSION_TABS: { id: MissionTabId; emoji: string; label: string }[] = [
  { id: "memory",   emoji: "🧠", label: "Memory"   },
  { id: "tasks",    emoji: "📋", label: "Tasks"    },
  { id: "crons",    emoji: "📅", label: "Crons"    },
  { id: "projects", emoji: "🗂", label: "Projects" },
  { id: "team",     emoji: "👥", label: "Team"     },
  { id: "docs",     emoji: "📄", label: "Docs"     },
];

const MISSION_COMPONENTS: Record<MissionTabId, React.ComponentType> = {
  memory:   MemoryBrowser,
  tasks:    TaskBoard,
  crons:    CronCalendar,
  projects: Projects,
  team:     TeamScreen,
  docs:     DocsScreen,
};

export function AppShell() {
  const [active, setActive] = useState<TabId>("openclaw");
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const cycle: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
    setTheme(cycle[theme]);
  };
  const themeIcon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "monitor";

  const isMission = MISSION_TABS.some((t) => t.id === active);

  const renderTabButton = (id: TabId, emoji: string, label: string) => (
    <button
      key={id}
      onClick={() => setActive(id)}
      className={[
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
        active === id
          ? "bg-accent/15 text-accent"
          : "text-text-secondary hover:text-text hover:bg-surface",
      ].join(" ")}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* ── Header ── */}
      <header className="shrink-0 h-[48px] bg-sidebar border-b border-border flex items-center px-4 gap-1 overflow-x-auto">
        {/* Logo */}
        <span className="text-lg mr-2 shrink-0">🐦</span>

        {/* Iframe tabs */}
        <nav className="flex items-center gap-1 shrink-0">
          {IFRAME_TABS.map((t) => renderTabButton(t.id, t.emoji, t.label))}
        </nav>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1 shrink-0" />

        {/* Mission control tabs */}
        <nav className="flex items-center gap-1 shrink-0">
          {MISSION_TABS.map((t) => renderTabButton(t.id, t.emoji, t.label))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <button onClick={nextTheme} title="Toggle theme" className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface transition-colors cursor-pointer">
            <SidebarIcon name={themeIcon} size={16} />
          </button>
          <button onClick={logout} title="Sign out" className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-surface transition-colors cursor-pointer">
            <SidebarIcon name="log-out" size={16} />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 relative">
        {/* Iframe tabs — keep all mounted for fast switching */}
        {IFRAME_TABS.map((t) => (
          <iframe
            key={t.id}
            src={t.src}
            title={t.label}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              display: active === t.id ? "block" : "none",
            }}
          />
        ))}

        {/* Mission control — render active component */}
        {isMission && (() => {
          const Component = MISSION_COMPONENTS[active as MissionTabId];
          return (
            <div
              style={{ position: "absolute", inset: 0, overflow: "hidden" }}
              className="bg-bg"
            >
              <Component />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
