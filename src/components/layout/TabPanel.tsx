interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div className="max-w-5xl mx-auto px-8 py-8 max-md:px-4 max-md:py-5">{children}</div>
  );
}
