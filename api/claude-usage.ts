export const config = { runtime: "edge" };

// Serve Claude usage stats from the pre-generated dashboard_data.json
// (regenerated daily at 9 AM by the claude-code-stats cron)

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;

  try {
    const res = await fetch(`${origin}/dashboard_data.json`);
    if (!res.ok) throw new Error(`dashboard_data.json: ${res.status}`);
    const raw = await res.json() as any;

    // Map dashboard_data.json → ClaudeUsageData shape
    const kpi = raw.kpi ?? {};
    const daily: any[] = raw.daily_costs ?? [];
    const models: any[] = raw.model_summary ?? [];

    const totalInput = kpi.total_input_tokens ?? 0;
    const totalOutput = kpi.total_output_tokens ?? 0;
    // Estimate cache tokens from cost_by_token_type
    const costByType = raw.cost_by_token_type ?? {};
    const totalCacheRead = costByType.cache_read != null
      ? Math.round((costByType.cache_read / 0.3) * 1_000_000) : 0;
    const totalCacheWrite = costByType.cache_write != null
      ? Math.round((costByType.cache_write / 3.75) * 1_000_000) : 0;

    const totalTokens = totalInput + totalOutput + totalCacheRead + totalCacheWrite;
    const cacheHitRate = totalTokens > 0 ? Math.round((totalCacheRead / totalTokens) * 100) : 0;

    // Daily chart (last 14 entries)
    const chartDays = daily.slice(-14).map((d: any) => ({
      date: d.date,
      label: (d.date as string).slice(5).replace("-", "/").replace(/^0/, ""),
      cost: parseFloat((d.total ?? 0).toFixed(2)),
      output_tokens: 0,
      cache_read_tokens: 0,
    }));

    // Find peak day
    const peak = daily.reduce((best: any, d: any) =>
      (d.total ?? 0) > (best.total ?? 0) ? d : best, daily[0] ?? {});

    // LLM chart — all Anthropic (Claude Code has no local sessions)
    const llmChart = daily.slice(-14).map((d: any) => ({
      date: d.date,
      label: (d.date as string).slice(5).replace("-", "/").replace(/^0/, ""),
      cloud: Math.round((d.total ?? 0) * 10000), // proxy tokens with cost×scale
      local: 0,
    }));

    return Response.json({
      totalCost: parseFloat((kpi.total_cost ?? 0).toFixed(2)),
      peakDayCost: parseFloat((peak.total ?? 0).toFixed(2)),
      peakDayDate: peak.date ?? "",
      totalTokens,
      totalInput,
      totalOutput,
      totalCacheRead,
      totalCacheWrite,
      cacheHitRate,
      // Extra fields for the native ClaudePage
      sessions: kpi.total_sessions ?? 0,
      messages: kpi.total_messages ?? 0,
      projects: raw.projects ?? [],
      models,
      costByType,
      dailyChart: chartDays,
      llmChart,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
