import { useState } from "react";
import type { PageId } from "../../types";
import { Header } from "./Header";
import { ContentArea } from "./ContentArea";
import { DashboardPage } from "../pages/DashboardPage";
import { HitThePinPage } from "../pages/HitThePinPage";
import { SaturdayGamePage } from "../pages/SaturdayGamePage";
import { GolfBookerPage } from "../pages/GolfBookerPage";
import { ClaudePage } from "../pages/ClaudePage";
import { OpenClawPage } from "../pages/OpenClawPage";
import { SettingsPage } from "../pages/SettingsPage";

function renderPage(page: PageId, scrollY: number) {
  switch (page) {
    case "dashboard":    return <DashboardPage scrollY={scrollY} />;
    case "hitthepin":    return <HitThePinPage scrollY={scrollY} />;
    case "saturdaygame": return <SaturdayGamePage scrollY={scrollY} />;
    case "golfbooker":   return <GolfBookerPage scrollY={scrollY} />;
    case "claude":       return <ClaudePage scrollY={scrollY} />;
    case "openclaw":     return <OpenClawPage scrollY={scrollY} />;
    case "settings":     return <SettingsPage />;
    default:             return <DashboardPage scrollY={scrollY} />;
  }
}

export function AppShell() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <Header activePage={activePage} onNavigate={setActivePage} />
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
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
