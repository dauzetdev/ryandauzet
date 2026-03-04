import { useEffect, useState } from "react";
import { TABS } from "../../lib/constants";
import type { TabId } from "../../types";

interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onRefresh: () => void;
}

const TAB_ICONS: Record<TabId, string> = {
  home: "🏠",
  hitthepin: "⛳",
  saturdaygame: "🏌️",
  golfbooker: "📅",
  claude: "🤖",
  openclaw: "🦞",
};

export function TopBar({ activeTab, onTabChange, onRefresh }: TopBarProps) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () => {
      setClock(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 px-6 py-3 bg-surface border-b border-border sticky top-0 z-[100] max-md:flex-nowrap max-md:overflow-x-auto max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden max-md:px-3 max-md:py-2">
      <div className="text-[1.05rem] max-md:text-[0.9rem] font-bold mr-4 max-md:mr-2 shrink-0 tracking-tight">
        🐦 Command Center
      </div>

      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-3.5 py-2 border-none text-sm max-md:text-xs font-medium cursor-pointer rounded-lg transition-all duration-150 font-[inherit] whitespace-nowrap shrink-0 ${
            activeTab === tab.id
              ? "text-text bg-accent/25 font-semibold"
              : "text-muted hover:text-text hover:bg-white/[0.06]"
          }`}
        >
          {TAB_ICONS[tab.id]} {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-accent rounded-full opacity-70" />
          )}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-3 max-md:hidden shrink-0">
        <span className="text-xs text-muted tabular-nums">{clock}</span>
        <button
          onClick={onRefresh}
          className="bg-transparent border border-border text-muted py-1.5 px-3 rounded-lg text-xs cursor-pointer font-[inherit] transition-all duration-150 flex items-center gap-1.5 hover:border-accent hover:text-accent"
          title="Refresh live data"
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
}
