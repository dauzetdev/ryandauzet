import { useEffect, useState } from "react";
import { PROJECTS } from "../../lib/constants";
import type { AppView } from "../../types";

interface HeaderProps {
  view: AppView;
  onBack: () => void;
  onRefresh: () => void;
}

export function Header({ view, onBack, onRefresh }: HeaderProps) {
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

  const project =
    view.mode === "detail"
      ? PROJECTS.find((p) => p.id === view.project)
      : null;

  return (
    <header className="sticky top-0 z-50 h-[54px] flex items-center px-6 gap-6 bg-black/30 backdrop-blur-2xl border-b border-white/[0.08] rounded-t-xl">
      {view.mode === "dashboard" ? (
        /* Dashboard: logo */
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-base leading-none">🐦</span>
          <span className="text-sm font-semibold tracking-tight text-white/90">Command Center</span>
        </div>
      ) : (
        /* Detail: back + project name */
        <>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-[inherit] cursor-pointer bg-white/[0.06] border border-white/[0.10] text-white/60 transition-all duration-150 hover:bg-white/[0.10] hover:text-white/90 hover:border-white/20 shrink-0"
          >
            <span className="text-base leading-none">&larr;</span>
            Back
          </button>
          {project && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-base leading-none">{project.icon}</span>
              <span className="text-sm font-semibold tracking-tight text-white/90">{project.label}</span>
            </div>
          )}
        </>
      )}

      {/* Right — push to end */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
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
