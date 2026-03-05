interface Props {
  className?: string;
}

export function Skeleton({ className = "h-4 w-24" }: Props) {
  return (
    <div className={`bg-surface rounded-lg animate-pulse ${className}`} />
  );
}
