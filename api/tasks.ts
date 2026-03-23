export const config = { runtime: "edge" };

function getProxy(): { url: string; token: string } | null {
  const url = (globalThis as any).process?.env?.WORKSPACE_PROXY_URL;
  const token = (globalThis as any).process?.env?.WORKSPACE_PROXY_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const proxy = getProxy();
  if (!proxy) return Response.json({ error: "Workspace proxy not configured" }, { status: 503 });

  const init: RequestInit = {
    method: request.method,
    headers: { authorization: `Bearer ${proxy.token}`, "content-type": "application/json" },
  };

  if (request.method === "POST") {
    init.body = await request.text();
  }

  const upstream = await fetch(`${proxy.url}/tasks`, init);
  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
