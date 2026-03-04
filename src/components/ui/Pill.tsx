import type { PillVariant } from "../../types";

const variants: Record<PillVariant, string> = {
  ok: "bg-success/20 text-success",
  warn: "bg-warn/20 text-warn",
  error: "bg-danger/20 text-danger",
  idle: "bg-muted/20 text-muted",
  blue: "bg-accent/20 text-accent",
  purple: "bg-purple/20 text-purple",
};

interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ variant, children, className = "" }: PillProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[0.7rem] font-semibold leading-tight ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
