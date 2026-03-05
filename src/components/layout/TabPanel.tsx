interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div className="tab-content w-full max-w-[1080px] mx-auto px-6 py-10 sm:px-10">
      {children}
    </div>
  );
}
