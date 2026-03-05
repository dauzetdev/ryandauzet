import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "success" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-surface border border-border text-text hover:border-border-hover",
  danger:
    "bg-danger/8 border border-danger/20 text-danger hover:bg-danger/15",
  success:
    "bg-success text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost: "bg-transparent text-text-secondary hover:text-text hover:bg-surface",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-sm rounded-xl gap-2 w-full justify-center",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center font-medium font-[inherit] cursor-pointer transition-all duration-150 ${variantClasses[variant]} ${sizeClasses[size]} ${loading ? "opacity-70 cursor-wait" : ""} ${className}`}
    >
      {loading ? <span className="animate-spin text-[0.8rem]">↻</span> : null}
      {children}
    </button>
  );
}
