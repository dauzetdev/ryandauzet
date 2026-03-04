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
    "bg-card border border-border rounded-2xl p-5 transition-all duration-200 " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_24px_rgba(0,0,0,0.5)]";
  const hover = noHover
    ? ""
    : "hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_8px_32px_rgba(0,0,0,0.6)]";
  const wideCls = wide ? " col-span-full" : "";
  const span2Cls = span2 ? " col-span-2 max-md:col-span-1" : "";

  return (
    <div className={`${base} ${hover}${wideCls}${span2Cls} ${className}`}>
      {title && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted flex items-center gap-1.5">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <div className="mt-3 mb-4 border-b border-border" />
        </>
      )}
      {children}
    </div>
  );
}
