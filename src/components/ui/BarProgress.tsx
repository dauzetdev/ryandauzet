interface BarProgressProps {
  percent: number;
  color?: string;
}

const colorMap: Record<string, string> = {
  green: "bg-success",
  yellow: "bg-warn",
  orange: "bg-orange",
  red: "bg-danger",
  blue: "bg-accent",
  purple: "bg-purple",
};

export function BarProgress({ percent, color = "accent" }: BarProgressProps) {
  return (
    <div className="w-full h-1.5 bg-border rounded-sm mt-1.5 overflow-hidden">
      <div
        className={`h-full rounded-sm transition-[width] duration-600 ${colorMap[color] ?? "bg-accent"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
