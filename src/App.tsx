import { useState } from "react";
import type { TabId } from "./types";
import { TopBar } from "./components/layout/TopBar";
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
    // Will be wired to React Query invalidation in Phase 3+
  };

  return (
    <>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
      />
      <TabPanel active={activeTab === "home"}>
        <HomeTab />
      </TabPanel>
      <TabPanel active={activeTab === "hitthepin"}>
        <HitThePinTab />
      </TabPanel>
      <TabPanel active={activeTab === "saturdaygame"}>
        <SaturdayGameTab />
      </TabPanel>
      <TabPanel active={activeTab === "golfbooker"}>
        <GolfBookerTab />
      </TabPanel>
      <TabPanel active={activeTab === "claude"}>
        <ClaudeTab />
      </TabPanel>
      <TabPanel active={activeTab === "openclaw"}>
        <OpenClawTab />
      </TabPanel>
    </>
  );
}
