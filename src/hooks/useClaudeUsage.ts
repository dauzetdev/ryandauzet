import { useQuery } from "@tanstack/react-query";

export interface DayEntry {
  date: string;
  label: string;
  cost: number;
  output_tokens: number;
  cache_read_tokens: number;
}

export interface LlmEntry {
  date: string;
  label: string;
  cloud: number;
  local: number;
}

export interface ClaudeUsageData {
  totalCost: number;
  peakDayCost: number;
  peakDayDate: string;
  totalTokens: number;
  totalInput: number;
  totalOutput: number;
  totalCacheRead: number;
  totalCacheWrite: number;
  cacheHitRate: number;
  dailyChart: DayEntry[];
  llmChart: LlmEntry[];
}

async function fetchClaudeUsage(): Promise<ClaudeUsageData> {
  const res = await fetch("/api/claude-usage", { credentials: "same-origin" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `API ${res.status}`);
  }
  return res.json();
}

export function useClaudeUsage() {
  return useQuery({
    queryKey: ["claude-usage"],
    queryFn: fetchClaudeUsage,
    refetchInterval: 300_000, // 5 minutes
    retry: 1,
  });
}
