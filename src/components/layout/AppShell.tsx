import { useState } from "react";
import type { PageId } from "../../types";
import { Header } from "./Header";
import { ContentArea } from "./ContentArea";
import { DashboardPage } from "../pages/DashboardPage";
import { HitThePinPage } from "../pages/HitThePinPage";
import { SaturdayGamePage } from "../pages/SaturdayGamePage";
import { GolfBookerPage } from "../pages/GolfBookerPage";
import { SettingsPage } from "../pages/SettingsPage";

const IFRAME_PAGES: { id: PageId; src: string; title: string }[] = [
  { id: "claude", src: "/claude-code-stats.html", title: "Claude Code Stats" },
  { id: "openclaw", src: "https://lobsterboard.hitthepin.com", title: "OpenClaw Dashboard" },
];

function renderPage(page: PageId, scrollY: number) {
  switch (page) {
    case "dashboard":    return <DashboardPage scrollY={scrollY} />;
    case "hitthepin":    return <HitThePinPage scrollY={scrollY} />;
    case "saturdaygame": return <SaturdayGamePage scrollY={scrollY} />;
    case "golfbooker":   return <GolfBookerPage scrollY={scrollY} />;
    case "settings":     return <SettingsPage />;
    default:             return <DashboardPage scrollY={scrollY} />;
  }
}

export function AppShell() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  const isIframe = IFRAME_PAGES.some((p) => p.id === activePage);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <Header activePage={activePage} onNavigate={setActivePage} />

      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {/* Iframes — always mounted for instant switching */}
        {IFRAME_PAGES.map((p) => (
          <iframe
            key={p.id}
            src={p.src}
            title={p.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              display: activePage === p.id ? "block" : "none",
            }}
          />
        ))}

        {/* Regular pages through ContentArea */}
        {!isIframe && (
          <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
            <ContentArea>
              {(scrollY) => (
                <div className="page-content">
                  {renderPage(activePage, scrollY)}
                </div>
              )}
            </ContentArea>
          </div>
        )}
      </div>
    </div>
  );
}
