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
          className="py-5 px-3 bg-white/[0.03] rounded-xl border border-border text-center"
        >
          <div
            className={`text-3xl font-bold leading-none tracking-tight ${colorMap[kpi.color ?? ""] ?? "text-text"}`}
          >
            {kpi.value}
          </div>
          <div className="text-xs text-muted mt-1.5 font-medium uppercase tracking-wider">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
