import { useState } from "react";
import type { TabId } from "./types";
import { Header } from "./components/layout/Header";
import { TabPanel } from "./components/layout/TabPanel";
import { HomeTab } from "./components/tabs/HomeTab";
import { HitThePinTab } from "./components/tabs/HitThePinTab";
import { SaturdayGameTab } from "./components/tabs/SaturdayGameTab";
import { GolfBookerTab } from "./components/tabs/GolfBookerTab";
import { ClaudeTab } from "./components/tabs/ClaudeTab";
import { OpenClawTab } from "./components/tabs/OpenClawTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const handleRefresh = () => {
    // Wired to React Query invalidation in Phase 3+
  };

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onRefresh={handleRefresh} />
      <main className="pt-[54px]">
        <TabPanel key={activeTab} active={activeTab === "home"}><HomeTab /></TabPanel>
        <TabPanel key={activeTab + "h"} active={activeTab === "hitthepin"}><HitThePinTab /></TabPanel>
        <TabPanel key={activeTab + "s"} active={activeTab === "saturdaygame"}><SaturdayGameTab /></TabPanel>
        <TabPanel key={activeTab + "g"} active={activeTab === "golfbooker"}><GolfBookerTab /></TabPanel>
        <TabPanel key={activeTab + "c"} active={activeTab === "claude"}><ClaudeTab /></TabPanel>
        <TabPanel key={activeTab + "o"} active={activeTab === "openclaw"}><OpenClawTab /></TabPanel>
      </main>
    </div>
  );
}
