import { useRef, useState, useEffect, type ReactNode } from "react";

interface Props {
  children: (scrollY: number) => ReactNode;
}

export function ContentArea({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div ref={ref} className="pl-60 h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {children(scrollY)}
      </div>
    </div>
  );
}
