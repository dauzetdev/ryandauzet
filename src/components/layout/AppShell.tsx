import { useState } from "react";
import type { PageId } from "../../types";
import { Header } from "./Header";
import { ContentArea } from "./ContentArea";
import { DashboardPage } from "../pages/DashboardPage";
import { OpenClawPage } from "../pages/OpenClawPage";
import { HitThePinPage } from "../pages/HitThePinPage";
import { SaturdayGamePage } from "../pages/SaturdayGamePage";
import { GolfBookerPage } from "../pages/GolfBookerPage";
import { ClaudePage } from "../pages/ClaudePage";
import { SettingsPage } from "../pages/SettingsPage";

function PageRouter({ page, scrollY }: { page: PageId; scrollY: number }) {
  switch (page) {
    case "dashboard":    return <DashboardPage scrollY={scrollY} />;
    case "openclaw":     return <OpenClawPage scrollY={scrollY} />;
    case "hitthepin":    return <HitThePinPage scrollY={scrollY} />;
    case "saturdaygame": return <SaturdayGamePage scrollY={scrollY} />;
    case "golfbooker":   return <GolfBookerPage scrollY={scrollY} />;
    case "claude":       return <ClaudePage scrollY={scrollY} />;
    case "settings":     return <SettingsPage />;
    default:             return <DashboardPage scrollY={scrollY} />;
  }
}

export function AppShell() {
  const [page, setPage] = useState<PageId>("dashboard");

  return (
    <div className="flex flex-col h-screen">
      <Header activePage={page} onNavigate={setPage} />
      <ContentArea>
        {(scrollY) => (
          <div key={page} className="page-content">
            <PageRouter page={page} scrollY={scrollY} />
          </div>
        )}
      </ContentArea>
    </div>
  );
}
