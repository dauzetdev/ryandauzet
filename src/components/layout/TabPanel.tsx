interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export function TabPanel({ active, children }: TabPanelProps) {
  if (!active) return null;
  return (
    <div className="tab-content w-full max-w-[1280px] mx-auto px-6 py-10 sm:px-10 lg:px-14 xl:px-16">
      {children}
    </div>
  );
}
