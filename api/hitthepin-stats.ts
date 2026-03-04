export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabaseUrl = process.env.HITTHEPIN_SUPABASE_URL;
  const supabaseKey = process.env.HITTHEPIN_SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const authHeaders = {
    "apikey": supabaseKey,
    "Authorization": `Bearer ${supabaseKey}`,
    "Prefer": "count=exact",
  };

  try {
    // Use HEAD requests for efficient count-only queries
    const [coursesRes, reviewsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/courses?select=id`, { method: "HEAD", headers: authHeaders }),
      fetch(`${supabaseUrl}/rest/v1/reviews?select=id`, { method: "HEAD", headers: authHeaders }),
    ]);

    const courseCount = parseInt(coursesRes.headers.get("content-range")?.split("/")[1] ?? "0") || 0;
    const reviewCount = parseInt(reviewsRes.headers.get("content-range")?.split("/")[1] ?? "0") || 0;

    // Get distinct state count from courses
    const statesRes = await fetch(
      `${supabaseUrl}/rest/v1/courses?select=state&state=not.is.null`,
      { headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` } },
    );
    let stateCount = 0;
    if (statesRes.ok) {
      const stateData = await statesRes.json() as { state: string }[];
      stateCount = new Set(stateData.map((r) => r.state)).size;
    }

    return Response.json({
      courses: courseCount,
      reviewPages: reviewCount,
      states: stateCount,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
