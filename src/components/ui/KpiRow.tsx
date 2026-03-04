interface Kpi {
  value: string;
  label: string;
  color?: string;
}

interface KpiRowProps {
  items: Kpi[];
}

const colorMap: Record<string, string> = {
  red: "text-danger",
  green: "text-success",
  blue: "text-accent",
  accent: "text-accent",
  purple: "text-purple",
  cyan: "text-cyan",
  yellow: "text-warn",
  orange: "text-orange",
  muted: "text-muted",
};

export function KpiRow({ items }: KpiRowProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 max-md:grid-cols-2">
      {items.map((kpi) => (
        <div
          key={kpi.label}
          className="text-center py-4 px-2 bg-white/[0.025] rounded-xl border border-border/50"
        >
          <div
            className={`text-[2rem] max-md:text-[1.5rem] font-bold leading-none tracking-tight ${colorMap[kpi.color ?? ""] ?? "text-text"}`}
          >
            {kpi.value}
          </div>
          <div className="text-xs text-muted mt-1.5 font-medium">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
