import type { PillVariant } from "../../types";

const variants: Record<PillVariant, string> = {
  ok:     "bg-success/20 text-success border border-success/20",
  warn:   "bg-warn/20 text-warn border border-warn/20",
  error:  "bg-danger/20 text-danger border border-danger/20",
  idle:   "bg-white/[0.08] text-white/50 border border-white/10",
  blue:   "bg-accent/20 text-accent border border-accent/20",
  purple: "bg-purple/20 text-purple border border-purple/20",
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
