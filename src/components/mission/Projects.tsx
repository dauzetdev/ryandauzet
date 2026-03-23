const PROJECTS = [
  {
    emoji: "📍",
    name: "HitThePin / FairwayIQ",
    tag: "#hitthepin",
    description: "Golf course review site with AI-generated reviews and SEO. Built on Vercel + Supabase.",
    lastActive: "2026-03-16",
    color: "border-green-400/20 hover:border-green-400/40",
    badge: "bg-green-400/10 text-green-400",
  },
  {
    emoji: "🏌️",
    name: "Saturday Game",
    tag: "#saturdaygame",
    description: "iOS/macOS golf scoring app with live leaderboards, handicap tracking, and Firebase backend.",
    lastActive: "2026-03-12",
    color: "border-blue-400/20 hover:border-blue-400/40",
    badge: "bg-blue-400/10 text-blue-400",
  },
  {
    emoji: "⛳",
    name: "Geoff",
    tag: "#geoff",
    description: "Automated golf content agent. Writes SEO articles, manages HitThePin content pipeline.",
    lastActive: "2026-03-12",
    color: "border-green-500/20 hover:border-green-500/40",
    badge: "bg-green-500/10 text-green-500",
  },
  {
    emoji: "🏌️‍♂️",
    name: "Rigs",
    tag: "#rigs",
    description: "Gear and YouTube content agent. Reviews golf equipment, scripts YouTube videos.",
    lastActive: "2026-03-12",
    color: "border-sky-400/20 hover:border-sky-400/40",
    badge: "bg-sky-400/10 text-sky-400",
  },
  {
    emoji: "🍽️",
    name: "Delilah",
    tag: "#delilah",
    description: "Vegas dinner reservation automation — watches for cancellations at top restaurants.",
    lastActive: "2026-03-16",
    color: "border-rose-400/20 hover:border-rose-400/40",
    badge: "bg-rose-400/10 text-rose-400",
  },
  {
    emoji: "🦞",
    name: "OpenClaw",
    tag: "#openclaw",
    description: "Mac Studio AI infrastructure. Wren's home base — crons, agents, memory, Discord.",
    lastActive: "2026-03-23",
    color: "border-purple-400/20 hover:border-purple-400/40",
    badge: "bg-purple-400/10 text-purple-400",
  },
];

export function Projects() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold text-text">Projects</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROJECTS.map((p) => (
            <div
              key={p.tag}
              className={`bg-surface border rounded-lg p-4 transition-colors ${p.color}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-text">{p.name}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${p.badge}`}>
                      {p.tag}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{p.description}</p>
              <div className="mt-3 text-[10px] text-text-secondary/60 uppercase tracking-wide">
                Last active: {p.lastActive}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
