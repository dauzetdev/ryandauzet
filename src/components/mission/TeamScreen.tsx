const AGENTS = [
  {
    emoji: "🐦",
    name: "Wren",
    role: "Main agent",
    model: "claude-sonnet-4-6",
    workspace: "~/.openclaw/workspace",
    color: "border-purple-400/30 bg-purple-400/5",
    badge: "bg-purple-400/10 text-purple-400",
    description: "Your personal AI assistant. Runs the show — reads context, manages memory, coordinates tasks, and keeps the operation running.",
    status: "🟢 Online",
  },
  {
    emoji: "⛳",
    name: "Geoff",
    role: "Content agent",
    model: "claude-opus-4-6",
    workspace: "~/.openclaw/workspace-geoff",
    color: "border-green-400/30 bg-green-400/5",
    badge: "bg-green-400/10 text-green-400",
    description: "Golf content machine. Writes SEO articles, manages the HitThePin/FairwayIQ content pipeline, optimizes for search.",
    status: "🟡 Scheduled",
  },
  {
    emoji: "🏌️",
    name: "Rigs",
    role: "Gear/YouTube agent",
    model: "claude-sonnet-4-6",
    workspace: "~/.openclaw/workspace-rigs",
    color: "border-blue-400/30 bg-blue-400/5",
    badge: "bg-blue-400/10 text-blue-400",
    description: "Golf gear expert and YouTube content producer. Reviews equipment, scripts videos, builds affiliate content.",
    status: "🟡 Scheduled",
  },
];

export function TeamScreen() {
  return (
    <div className="flex flex-col h-full">
      {/* Mission statement */}
      <div className="shrink-0 px-6 py-5 border-b border-border bg-gradient-to-r from-accent/10 to-purple-500/5">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Mission</div>
          <p className="text-base font-medium text-text leading-relaxed">
            Build a portfolio of AI-powered products in the golf space that generate passive income — content, apps, and automation running 24/7 so the business grows while I play.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Agents</h2>
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className={`border rounded-lg p-5 ${agent.color}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{agent.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-base font-semibold text-text">{agent.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${agent.badge}`}>
                      {agent.role}
                    </span>
                    <span className="text-xs text-text-secondary">{agent.status}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{agent.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="text-xs text-text-secondary/60">
                      <span className="text-text-secondary/40 mr-1">Model</span>
                      <span className="font-mono">{agent.model}</span>
                    </div>
                    <div className="text-xs text-text-secondary/60">
                      <span className="text-text-secondary/40 mr-1">Workspace</span>
                      <span className="font-mono">{agent.workspace}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
