export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const gw = process.env.OPENCLAW_GATEWAY_URL;
  const token = process.env.OPENCLAW_GATEWAY_TOKEN;
  if (!gw) return Response.json({ error: "Gateway not configured" }, { status: 503 });

  try {
    const res = await fetch(`${gw}/api/sessions`, {
      headers: {
        "accept": "application/json",
        ...(token ? { "authorization": `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    const sessions = data.sessions || [];
    const counts = { claude: 0, ollama: 0 };
    sessions.forEach(s => {
      if (s.model?.toLowerCase()?.includes("claude")) counts.claude++;
      else if (s.model?.toLowerCase()?.includes("ollama")) counts.ollama++;
    });
    return Response.json(counts);
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
