export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  if (!gatewayUrl) {
    return Response.json({ error: "Gateway not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${gatewayUrl}/api/status`, {
      headers: { "accept": "application/json" },
    });
    const data = await res.text();
    return new Response(data, {
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
