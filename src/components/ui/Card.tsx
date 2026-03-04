interface CardProps {
  title?: string;
  icon?: string;
  wide?: boolean;
  span2?: boolean;
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
}

export function Card({
  title,
  icon,
  wide,
  span2,
  children,
  className = "",
  noHover = false,
}: CardProps) {
  const base =
    "bg-card border border-border rounded-xl p-5 transition-all duration-200";
  const hover = noHover
    ? ""
    : "hover:border-border-hover hover:shadow-lg hover:shadow-black/20 hover:-translate-y-px";
  const wideCls = wide ? " col-span-full" : "";
  const span2Cls = span2 ? " col-span-2 max-md:col-span-1" : "";

  return (
    <div className={`${base} ${hover}${wideCls}${span2Cls} ${className}`}>
      {title && (
        <h2 className="text-xs uppercase tracking-[1.5px] text-muted mb-3 flex items-center gap-1.5 font-semibold">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
