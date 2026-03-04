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
  muted: "text-white/40",
};

export function KpiRow({ items }: KpiRowProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3 max-md:grid-cols-2">
      {items.map((kpi) => (
        <div
          key={kpi.label}
          className="py-4 px-3 bg-white/[0.05] backdrop-blur-sm rounded-xl border border-white/[0.08] text-center"
        >
          <div className={`text-3xl font-bold leading-none tracking-tight ${colorMap[kpi.color ?? ""] ?? "text-white/90"}`}>
            {kpi.value}
          </div>
          <div className="text-[0.65rem] text-white/40 mt-1.5 font-medium uppercase tracking-wider">{kpi.label}</div>
        </div>
      ))}
    </div>
  );
}
