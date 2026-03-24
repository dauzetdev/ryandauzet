import { useState } from "react";
import type { PageId } from "../../types";
import { PAGES } from "../../lib/constants";
import { ContentArea } from "./ContentArea";
import { SidebarIcon } from "./SidebarIcon";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { DashboardPage } from "../pages/DashboardPage";
import { HitThePinPage } from "../pages/HitThePinPage";
import { SaturdayGamePage } from "../pages/SaturdayGamePage";
import { GolfBookerPage } from "../pages/GolfBookerPage";
import { ClaudePage } from "../pages/ClaudePage";
import { OpenClawPage } from "../pages/OpenClawPage";
import { LogPage } from "../pages/LogPage";
import { SettingsPage } from "../pages/SettingsPage";

const PAGE_ICONS: Record<string, string> = {
  dashboard:    "grid",
  openclaw:     "cpu",
  hitthepin:    "flag",
  saturdaygame: "trophy",
  golfbooker:   "calendar",
  claude:       "bot",
  log:          "book-open",
  settings:     "settings",
};

const PAGE_EMOJIS: Record<string, string> = {
  dashboard:    "🏠",
  openclaw:     "🦞",
  hitthepin:    "⛳",
  saturdaygame: "🏌️",
  golfbooker:   "📅",
  claude:       "🤖",
  log:          "📔",
  settings:     "⚙️",
};

function renderPage(page: PageId, scrollY: number) {
  switch (page) {
    case "dashboard":    return <DashboardPage scrollY={scrollY} />;
    case "hitthepin":    return <HitThePinPage scrollY={scrollY} />;
    case "saturdaygame": return <SaturdayGamePage scrollY={scrollY} />;
    case "golfbooker":   return <GolfBookerPage scrollY={scrollY} />;
    case "claude":       return <ClaudePage scrollY={scrollY} />;
    case "openclaw":     return <OpenClawPage scrollY={scrollY} />;
    case "log":          return <LogPage scrollY={scrollY} />;
    case "settings":     return <SettingsPage />;
    default:             return <DashboardPage scrollY={scrollY} />;
  }
}

export function AppShell() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const navPages = PAGES.filter(p => p.id !== "settings");
  const nextTheme = () => {
    const cycle: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" };
    setTheme(cycle[theme]);
  };
  const themeIcon = theme === "light" ? "sun" : theme === "dark" ? "moon" : "monitor";

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        height: "100%",
        background: "var(--color-sidebar)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>🐦</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text)", letterSpacing: "-0.01em" }}>
            Command Center
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {navPages.map(p => {
            const active = activePage === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePage(p.id as PageId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 400,
                  fontFamily: "inherit",
                  background: active ? "rgba(37,99,235,0.1)" : "transparent",
                  color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                  transition: "all 0.12s",
                  marginBottom: 1,
                  textAlign: "left",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
                  }
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{PAGE_EMOJIS[p.id]}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "8px 8px 12px", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
          {/* Settings */}
          <button
            onClick={() => setActivePage("settings")}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13.5, fontWeight: activePage === "settings" ? 600 : 400,
              fontFamily: "inherit",
              background: activePage === "settings" ? "rgba(37,99,235,0.1)" : "transparent",
              color: activePage === "settings" ? "var(--color-accent)" : "var(--color-text-secondary)",
              transition: "all 0.12s", marginBottom: 1, textAlign: "left",
            }}
            onMouseEnter={e => { if (activePage !== "settings") { (e.currentTarget as HTMLElement).style.background = "var(--color-surface)"; (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}}
            onMouseLeave={e => { if (activePage !== "settings") { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}}
          >
            <SidebarIcon name="settings" size={16} />
            <span>Settings</span>
          </button>
          {/* Theme */}
          <button
            onClick={nextTheme}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13.5, fontFamily: "inherit",
              background: "transparent", color: "var(--color-text-secondary)",
              transition: "all 0.12s", marginBottom: 1, textAlign: "left",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface)"; (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
          >
            <SidebarIcon name={themeIcon} size={16} />
            <span>{theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}</span>
          </button>
          {/* Sign out */}
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13.5, fontFamily: "inherit",
              background: "transparent", color: "var(--color-text-secondary)",
              transition: "all 0.12s", textAlign: "left",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--color-danger)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"; }}
          >
            <SidebarIcon name="log-out" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto" }}>
        <ContentArea>
          {(scrollY) => (
            <div className="page-content">
              {renderPage(activePage, scrollY)}
            </div>
          )}
        </ContentArea>
      </div>
    </div>
  );
}
