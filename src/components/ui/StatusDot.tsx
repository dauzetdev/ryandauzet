type Status = "ok" | "warn" | "error" | "idle";

const colorMap: Record<Status, string> = {
  ok: "bg-success",
  warn: "bg-warn",
  error: "bg-danger",
  idle: "bg-text-tertiary",
};

interface Props {
  status: Status;
  className?: string;
}

export function StatusDot({ status, className = "" }: Props) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${colorMap[status]} ${className}`} />
  );
}
