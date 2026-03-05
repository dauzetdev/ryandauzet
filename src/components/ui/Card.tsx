interface CardProps {
  title?: string;
  icon?: string;
  wide?: boolean;
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
  depth?: 0 | 1 | 2;
  scrollY?: number;
}

const PARALLAX_RATES = [0, -0.02, -0.04];

export function Card({
  title,
  icon,
  wide,
  children,
  className = "",
  noHover = false,
  depth = 0,
  scrollY = 0,
}: CardProps) {
  const base =
    "bg-card border border-border rounded-2xl p-5 transition-all duration-200 flex flex-col";
  const shadow = "shadow-card";
  const hover = noHover
    ? ""
    : "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-border-hover";
  const sizing = wide
    ? "w-full min-h-0"
    : "flex-1 min-w-[280px] min-h-[280px]";

  const translateY = depth > 0 ? scrollY * PARALLAX_RATES[depth] : 0;
  const style = translateY !== 0 ? { transform: `translateY(${translateY}px)` } : undefined;

  return (
    <div className={`${base} ${shadow} ${hover} ${sizing} ${className}`} style={style}>
      {title && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-tertiary flex items-center gap-1.5">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <div className="mt-3 mb-4 border-b border-border" />
        </>
      )}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
