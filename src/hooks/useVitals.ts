import { useQuery } from "@tanstack/react-query";

export interface VitalsData {
  status?: string;
  version?: string;
  latestVersion?: string;
  agents?: { name: string; emoji?: string; profile?: string; model?: string; heartbeat?: string; active?: boolean }[];
  crons?: { name: string; schedule?: string; model?: string; status?: string; lastRun?: string }[];
  channels?: Record<string, boolean>;
  sessions?: unknown[];
  host?: { machine?: string; os?: string; node?: string; arch?: string };
  security?: { critical?: number; warnings?: number; info?: number };
  mcp?: { name: string; status?: string; tools?: string[] }[];
  updateAvailable?: boolean;
}

async function fetchVitals(): Promise<VitalsData> {
  const res = await fetch("/api/vitals", { credentials: "same-origin" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  }
  return res.json();
}

export function useVitals() {
  return useQuery({
    queryKey: ["vitals"],
    queryFn: fetchVitals,
    refetchInterval: 60_000,
    retry: 1,
  });
}
