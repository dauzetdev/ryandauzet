interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-white/[0.07]">
      <h1 className="text-3xl font-bold tracking-tight mb-1.5">{title}</h1>
      <p className="text-sm text-white/40">{subtitle}</p>
    </div>
  );
}
