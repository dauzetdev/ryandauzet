interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div className="tab-content max-w-5xl mx-auto px-8 py-10 max-md:px-4 max-md:py-6">
      {children}
    </div>
  );
}
