export const config = { runtime: "edge" };

interface UsageDay {
  date: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
}

interface ModelUsageDay {
  date: string;
  models: {
    model_id: string;
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens: number;
    cache_creation_input_tokens: number;
  }[];
}

const MODEL_PRICING: Record<string, { input: number; output: number; cache_read: number; cache_write: number }> = {
  "claude-opus-4-6": { input: 15, output: 75, cache_read: 1.5, cache_write: 18.75 },
  "claude-sonnet-4-6": { input: 3, output: 15, cache_read: 0.3, cache_write: 3.75 },
  "claude-haiku-4-5": { input: 0.8, output: 4, cache_read: 0.08, cache_write: 1 },
  // Default fallback
  "default": { input: 3, output: 15, cache_read: 0.3, cache_write: 3.75 },
};

function calcCost(model: string, input: number, output: number, cacheRead: number, cacheWrite: number): number {
  const p = MODEL_PRICING[model] ?? MODEL_PRICING["default"];
  return (
    (input / 1_000_000) * p.input +
    (output / 1_000_000) * p.output +
    (cacheRead / 1_000_000) * p.cache_read +
    (cacheWrite / 1_000_000) * p.cache_write
  );
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminKey = process.env.ANTHROPIC_ADMIN_API_KEY;
  if (!adminKey) {
    return Response.json({ error: "ANTHROPIC_ADMIN_API_KEY not configured" }, { status: 503 });
  }

  const now = new Date();
  const end = now.toISOString().split("T")[0];
  const start30 = new Date(now);
  start30.setDate(start30.getDate() - 30);
  const start = start30.toISOString().split("T")[0];

  try {
    // Fetch usage grouped by day (last 30 days)
    const [usageRes, modelRes] = await Promise.all([
      fetch(`https://api.anthropic.com/v1/usage?start_date=${start}&end_date=${end}&granularity=daily`, {
        headers: { "x-api-key": adminKey, "anthropic-version": "2023-06-01" },
      }),
      fetch(`https://api.anthropic.com/v1/usage?start_date=${start}&end_date=${end}&granularity=daily&group_by=model`, {
        headers: { "x-api-key": adminKey, "anthropic-version": "2023-06-01" },
      }),
    ]);

    if (!usageRes.ok) {
      const err = await usageRes.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(err?.error?.message ?? `API ${usageRes.status}`);
    }

    const usageData = await usageRes.json() as { data?: UsageDay[] };
    const modelData = modelRes.ok ? await modelRes.json() as { data?: ModelUsageDay[] } : { data: [] };

    const days: UsageDay[] = usageData.data ?? [];

    // Aggregate 30-day totals
    let totalInput = 0, totalOutput = 0, totalCacheRead = 0, totalCacheWrite = 0, totalCost = 0;
    for (const d of days) {
      totalInput += d.input_tokens;
      totalOutput += d.output_tokens;
      totalCacheRead += d.cache_read_input_tokens;
      totalCacheWrite += d.cache_creation_input_tokens;
      totalCost += calcCost("default", d.input_tokens, d.output_tokens, d.cache_read_input_tokens, d.cache_creation_input_tokens);
    }

    const peakDay = days.reduce((best, d) => {
      const cost = calcCost("default", d.input_tokens, d.output_tokens, d.cache_read_input_tokens, d.cache_creation_input_tokens);
      return cost > best.cost ? { date: d.date, cost } : best;
    }, { date: "", cost: 0 });

    const totalTokens = totalInput + totalOutput + totalCacheRead + totalCacheWrite;
    const cacheHitRate = totalTokens > 0 ? Math.round((totalCacheRead / totalTokens) * 100) : 0;

    // Build daily chart data (last 14 days for display)
    const chartDays = days.slice(-14).map((d) => ({
      date: d.date,
      label: d.date.slice(5).replace("-", "/").replace(/^0/, ""),
      cost: parseFloat(calcCost("default", d.input_tokens, d.output_tokens, d.cache_read_input_tokens, d.cache_creation_input_tokens).toFixed(2)),
      output_tokens: d.output_tokens,
      cache_read_tokens: d.cache_read_input_tokens,
    }));

    // Build LLM usage data from model breakdown (cloud vs local by checking model prefix)
    const modelDays: ModelUsageDay[] = modelData.data ?? [];
    const llmChart = modelDays.slice(-14).map((d) => {
      let cloud = 0, local = 0;
      for (const m of d.models) {
        if (m.model_id.startsWith("claude")) {
          cloud += m.output_tokens;
        } else {
          local += m.output_tokens;
        }
      }
      return {
        date: d.date,
        label: d.date.slice(5).replace("-", "/").replace(/^0/, ""),
        cloud,
        local,
      };
    });

    return Response.json({
      totalCost: parseFloat(totalCost.toFixed(2)),
      peakDayCost: parseFloat(peakDay.cost.toFixed(2)),
      peakDayDate: peakDay.date,
      totalTokens,
      totalInput,
      totalOutput,
      totalCacheRead,
      totalCacheWrite,
      cacheHitRate,
      dailyChart: chartDays,
      llmChart,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
