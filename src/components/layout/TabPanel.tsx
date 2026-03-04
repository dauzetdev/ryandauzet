interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div className="p-6 max-w-[1400px] mx-auto max-md:p-3.5">{children}</div>
  );
}
