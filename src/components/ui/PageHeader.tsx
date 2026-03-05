import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text mb-1">{title}</h1>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
