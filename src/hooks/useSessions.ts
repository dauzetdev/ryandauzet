import { useQuery } from "@tanstack/react-query";
import type { Session } from "../types";

async function fetchSessions(): Promise<Session[]> {
  const res = await fetch("/api/sessions", { credentials: "same-origin" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.sessions ?? []);
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    refetchInterval: 60_000,
    retry: 1,
  });
}

/** Filter sessions active in last N minutes */
export function recentSessions(sessions: Session[], minutes = 5): Session[] {
  const cutoff = Date.now() - minutes * 60_000;
  return sessions.filter((s) => (s.updatedAt ?? 0) > cutoff);
}
