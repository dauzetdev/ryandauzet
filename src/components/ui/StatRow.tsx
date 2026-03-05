interface StatRowProps {
  label: string;
  children: React.ReactNode;
}

export function StatRow({ label, children }: StatRowProps) {
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-border last:border-b-0 max-md:flex-wrap max-md:gap-1">
      <span className="text-xs text-text-tertiary uppercase tracking-wide shrink-0 mr-3">{label}</span>
      <span className="text-sm font-medium text-right text-text-secondary">{children}</span>
    </div>
  );
}
