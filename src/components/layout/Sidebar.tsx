import { useEffect, useState } from "react";
import { TABS } from "../../lib/constants";
import type { TabId } from "../../types";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onRefresh: () => void;
  lastUpdated?: Date | null;
}

const TAB_ICONS: Record<TabId, string> = {
  home: "🏠",
  hitthepin: "⛳",
  saturdaygame: "🏌️",
  golfbooker: "📅",
  claude: "🤖",
  openclaw: "🦞",
};

export function Sidebar({ activeTab, onTabChange, onRefresh, lastUpdated }: SidebarProps) {
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
    <div className="w-[220px] h-screen shrink-0 bg-sidebar border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <span className="text-base leading-none">🐦</span>
        <div>
          <div className="text-[0.8rem] font-semibold tracking-tight text-text leading-tight">Command Center</div>
          <div className="text-[0.65rem] text-muted leading-tight mt-0.5">ryandauzet.com</div>
        </div>
      </div>

      <div className="mx-3 border-b border-border" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-[inherit] cursor-pointer border-none transition-all duration-150 flex items-center gap-2.5 ${
              activeTab === tab.id
                ? "bg-accent/15 text-accent font-semibold"
                : "text-muted hover:bg-white/[0.05] hover:text-text"
            }`}
          >
            <span className="text-[0.95rem] leading-none w-4 text-center shrink-0">{TAB_ICONS[tab.id]}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mx-3 border-t border-border" />
      <div className="px-4 py-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted tabular-nums">{clock}</span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-muted/60">
            Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </span>
        )}
        <button
          onClick={onRefresh}
          className="mt-0.5 bg-white/[0.04] border border-border text-muted py-1.5 px-3 rounded-lg text-xs cursor-pointer font-[inherit] transition-all duration-150 flex items-center justify-center gap-1.5 hover:border-accent/50 hover:text-accent hover:bg-accent/[0.06] w-full"
          title="Refresh live data"
        >
          ↻ Refresh
        </button>
        <div className="text-[0.6rem] text-muted/40 tabular-nums">v2.1 · Mar 4</div>
      </div>
    </div>
  );
}
