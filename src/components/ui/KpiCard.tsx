interface KpiCardProps {
  value: string;
  label: string;
  color?: string;
}

const colorMap: Record<string, string> = {
  green: "text-success",
  red: "text-danger",
  yellow: "text-warn",
  orange: "text-warn",
  accent: "text-accent",
  blue: "text-accent",
  purple: "text-purple",
  cyan: "text-cyan",
};

export function KpiCard({ value, label, color }: KpiCardProps) {
  const valueColor = color ? (colorMap[color] ?? "text-text") : "text-text";

  return (
    <div className="bg-card border border-border rounded-2xl py-4 px-4 text-center shadow-card">
      <div className={`text-2xl font-bold leading-none tracking-tight ${valueColor}`}>
        {value}
      </div>
      <div className="text-[0.7rem] text-text-tertiary uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
}

interface KpiRowProps {
  items: { value: string; label: string; color?: string }[];
}

export function KpiRow({ items }: KpiRowProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}
