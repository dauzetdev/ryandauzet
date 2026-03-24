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
    <header style={{
      height: "52px",
      flexShrink: 0,
      background: "var(--color-sidebar)",
      borderBottom: "1px solid var(--color-border)",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: "4px",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px", flexShrink: 0 }}>
        <span style={{ fontSize: "20px" }}>🐦</span>
        <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text)", letterSpacing: "-0.01em" }} className="hidden sm:block">
          Command Center
        </span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, overflowX: "auto" }} className="scrollbar-none">
        {navPages.map((p) => (
          <button
            key={p.id}
            onClick={() => onNavigate(p.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              cursor: "pointer",
              flexShrink: 0,
              border: "none",
              background: activePage === p.id ? "rgba(37,99,235,0.1)" : "transparent",
              color: activePage === p.id ? "var(--color-accent)" : "var(--color-text-secondary)",
            }}
            onMouseEnter={e => {
              if (activePage !== p.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
              }
            }}
            onMouseLeave={e => {
              if (activePage !== p.id) {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
              }
            }}
          >
            <span style={{ fontSize: "15px", lineHeight: 1 }}>{PAGE_EMOJIS[p.id]}</span>
            <span className="hidden md:block">{p.label}</span>
          </button>
        ))}
      </nav>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "8px", flexShrink: 0 }}>
        {[
          { icon: themeIcon, onClick: nextTheme, title: "Toggle theme" },
          { icon: "settings", onClick: () => onNavigate("settings"), title: "Settings", active: activePage === "settings" },
          { icon: "log-out", onClick: logout, title: "Sign out", danger: true },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            title={btn.title}
            style={{
              padding: "7px",
              borderRadius: "8px",
              border: "none",
              background: btn.active ? "rgba(37,99,235,0.1)" : "transparent",
              color: btn.active ? "var(--color-accent)" : "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = btn.danger ? "rgba(220,38,38,0.08)" : "var(--color-surface)";
              (e.currentTarget as HTMLButtonElement).style.color = btn.danger ? "var(--color-danger)" : "var(--color-text)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = btn.active ? "rgba(37,99,235,0.1)" : "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = btn.active ? "var(--color-accent)" : "var(--color-text-secondary)";
            }}
          >
            <SidebarIcon name={btn.icon} size={16} />
          </button>
        ))}
      </div>
    </header>
  );
}
