export const config = { runtime: "edge" };

function getProxy(): { url: string; token: string } | null {
  const url = (globalThis as any).process?.env?.WORKSPACE_PROXY_URL;
  const token = (globalThis as any).process?.env?.WORKSPACE_PROXY_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function proxyGet(proxy: { url: string; token: string }, path: string): Promise<Response> {
  return fetch(`${proxy.url}${path}`, {
    headers: { authorization: `Bearer ${proxy.token}` },
  });
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const proxy = getProxy();
  if (!proxy) return Response.json({ error: "Workspace proxy not configured" }, { status: 503 });

  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const file = url.searchParams.get("file");
  const search = url.searchParams.get("search");

  let qs = "";
  if (file) qs = `?file=${encodeURIComponent(file)}`;
  else if (date) qs = `?date=${encodeURIComponent(date)}`;
  else if (search) qs = `?search=${encodeURIComponent(search)}`;

  const upstream = await proxyGet(proxy, `/memory${qs}`);
  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
