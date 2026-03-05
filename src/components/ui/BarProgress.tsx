interface BarProgressProps {
  percent: number;
  color?: string;
}

const colorMap: Record<string, string> = {
  green: "bg-success",
  yellow: "bg-warn",
  orange: "bg-warn",
  red: "bg-danger",
  blue: "bg-accent",
  purple: "bg-purple",
};

export function BarProgress({ percent, color = "blue" }: BarProgressProps) {
  return (
    <div className="w-full h-1.5 bg-surface rounded-full mt-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${colorMap[color] ?? "bg-accent"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
