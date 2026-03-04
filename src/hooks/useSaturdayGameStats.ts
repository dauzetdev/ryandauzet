import { useQuery } from "@tanstack/react-query";

interface SaturdayGameStats {
  users: number;
  rounds: number;
  tournaments: number;
  groups: number;
}

async function fetchStats(): Promise<SaturdayGameStats> {
  const res = await fetch("/api/saturdaygame-stats", { credentials: "same-origin" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  }
  return res.json();
}

export function useSaturdayGameStats() {
  return useQuery({
    queryKey: ["saturdaygame-stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
