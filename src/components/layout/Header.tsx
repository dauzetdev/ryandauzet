import { useEffect, useState } from "react";
import { TABS } from "../../lib/constants";
import type { TabId } from "../../types";

interface HeaderProps {
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

export function Header({ activeTab, onTabChange, onRefresh }: HeaderProps) {
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
    <header className="fixed top-0 left-0 right-0 z-50 h-[54px] flex items-center px-6 gap-6 bg-black/30 backdrop-blur-2xl border-b border-white/[0.08]">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-base leading-none">🐦</span>
        <span className="text-sm font-semibold tracking-tight text-white/90">Command Center</span>
      </div>

      <div className="w-px h-4 bg-white/[0.12] shrink-0" />

      {/* Tabs */}
      <nav className="flex items-center gap-0.5 flex-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-[inherit] cursor-pointer border-none transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white/[0.12] text-white font-medium"
                : "text-white/45 hover:text-white/75 hover:bg-white/[0.06]"
            }`}
          >
            <span className="text-[0.85rem] leading-none">{TAB_ICONS[tab.id]}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-white/30 tabular-nums hidden md:block">{clock}</span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-[inherit] cursor-pointer bg-white/[0.06] border border-white/[0.10] text-white/50 transition-all duration-150 hover:bg-white/[0.10] hover:text-white/80 hover:border-white/20"
        >
          ↻ Refresh
        </button>
      </div>
    </header>
  );
}
