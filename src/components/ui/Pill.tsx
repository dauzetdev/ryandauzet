import type { PillVariant } from "../../types";

const variants: Record<PillVariant, string> = {
  ok: "bg-success/25 text-success",
  warn: "bg-warn/25 text-warn",
  error: "bg-danger/25 text-danger",
  idle: "bg-muted/25 text-muted",
  blue: "bg-accent/25 text-accent",
  purple: "bg-purple/25 text-purple",
};

interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ variant, children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold leading-tight ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
