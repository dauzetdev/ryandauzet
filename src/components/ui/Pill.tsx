import type { PillVariant } from "../../types";

const variants: Record<PillVariant, string> = {
  ok:     "bg-success/12 text-success",
  warn:   "bg-warn/12 text-warn",
  error:  "bg-danger/12 text-danger",
  idle:   "bg-text-tertiary/12 text-text-tertiary",
  blue:   "bg-accent/12 text-accent",
  purple: "bg-purple/12 text-purple",
};

interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ variant, children, className = "" }: PillProps) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold leading-tight ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
