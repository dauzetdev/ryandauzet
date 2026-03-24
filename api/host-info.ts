export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;

  if (!gatewayUrl || !gatewayToken) {
    return Response.json({ error: "Gateway not configured" }, { status: 503 });
  }

  try {
    // Fetch update check info from gateway
    const res = await fetch(`${gatewayUrl}/api/update-check`, {
      headers: { authorization: `Bearer ${gatewayToken}` },
    });

    let updateData: any = {};
    if (res.ok) updateData = await res.json();

    return Response.json({
      localIp: "192.168.68.76",
      publicIp: "174.160.178.223",
      hostname: "dauzets-Mac-Studio",
      ssh: { host: "174.160.178.223", port: 2222, user: "dauzet" },
      vnc: { host: "174.160.178.223", port: 15900 },
      currentVersion: updateData.currentVersion ?? null,
      latestVersion: updateData.latestVersion ?? null,
      updateAvailable: updateData.updateAvailable ?? false,
    });
  } catch (e: any) {
    // Return static info even if gateway is unreachable
    return Response.json({
      localIp: "192.168.68.76",
      publicIp: "174.160.178.223",
      hostname: "dauzets-Mac-Studio",
      ssh: { host: "174.160.178.223", port: 2222, user: "dauzet" },
      vnc: { host: "174.160.178.223", port: 15900 },
      currentVersion: null,
      latestVersion: null,
      updateAvailable: false,
    });
  }
}
