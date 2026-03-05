import { useEffect, useState } from "react";

export function GreetingBar() {
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hr = now.getHours();
      const g =
        hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
      setGreeting(`${g}, Ryan`);
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 pb-6 border-b border-white/[0.07]">
      <h1 className="text-3xl font-bold tracking-tight mb-1.5">{greeting}</h1>
      <p className="text-sm text-white/40">{dateStr}</p>
    </div>
  );
}
