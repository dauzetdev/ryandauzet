import { useQuery } from "@tanstack/react-query";

export interface HitThePinStats {
  courses: number;
  reviewPages: number;
  states: number;
}

async function fetchHitThePinStats(): Promise<HitThePinStats> {
  const res = await fetch("/api/hitthepin-stats", { credentials: "same-origin" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  }
  return res.json();
}

export function useHitThePinStats() {
  return useQuery({
    queryKey: ["hitthepin-stats"],
    queryFn: fetchHitThePinStats,
    refetchInterval: 300_000, // 5 minutes
    retry: 1,
    staleTime: 60_000,
  });
}
