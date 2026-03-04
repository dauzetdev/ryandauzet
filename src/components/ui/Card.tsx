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
    "bg-white/[0.07] backdrop-blur-md border border-white/[0.10] rounded-2xl p-5 " +
    "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] " +
    "transition-all duration-200";
  const hover = noHover
    ? ""
    : "hover:-translate-y-0.5 hover:bg-white/[0.10] hover:border-white/[0.18] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)]";
  const wideCls = wide ? " col-span-full" : "";
  const span2Cls = span2 ? " col-span-2 max-md:col-span-1" : "";

  return (
    <div className={`${base} ${hover}${wideCls}${span2Cls} ${className}`}>
      {title && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <div className="mt-3 mb-4 border-b border-white/[0.07]" />
        </>
      )}
      {children}
    </div>
  );
}
