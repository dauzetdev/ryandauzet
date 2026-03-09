import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SidebarIcon } from "./SidebarIcon";

type Tab = "openclaw" | "claude" | "saturdaygame";

const TABS: { id: Tab; emoji: string; label: string; src: string }[] = [
  { id: "openclaw",     emoji: "🦞", label: "OpenClaw",      src: "https://lobsterboard.hitthepin.com" },
  { id: "claude",       emoji: "🤖", label: "Claude Usage",  src: "/claude-code-stats.html" },
  { id: "saturdaygame", emoji: "🏌️", label: "SaturdayGame", src: "/saturdaygame-stats.html" },
];

export function AppShell() {
  const [active, setActive] = useState<Tab>("openclaw");
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const cycle: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
    setTheme(cycle[theme]);
  };
  const themeIcon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "monitor";

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* ── Header ── */}
      <header className="shrink-0 h-[48px] bg-sidebar border-b border-border flex items-center px-4 gap-1">
        {/* Logo */}
        <span className="text-lg mr-3">🐦</span>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                active === t.id
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:text-text hover:bg-surface",
              ].join(" ")}
            >
              <span className="text-base leading-none">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={nextTheme} title="Toggle theme" className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface transition-colors cursor-pointer">
            <SidebarIcon name={themeIcon} size={16} />
          </button>
          <button onClick={logout} title="Sign out" className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-surface transition-colors cursor-pointer">
            <SidebarIcon name="log-out" size={16} />
          </button>
        </div>
      </header>

      {/* ── Content: iframes ── */}
      <div className="flex-1 min-h-0 relative">
        {TABS.map((t) => (
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
      </div>
    </div>
  );
}
