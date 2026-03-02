// This endpoint proxies update requests to the local OpenClaw gateway
// For now, it triggers via the OpenClaw webhook or returns instructions

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "POST only" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  // Check auth cookie
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Try to reach the OpenClaw gateway webhook
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;

  if (gatewayUrl && gatewayToken) {
    try {
      const res = await fetch(`${gatewayUrl}/api/exec`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${gatewayToken}`,
        },
        body: JSON.stringify({
          command: "npm update -g openclaw && openclaw gateway restart",
        }),
      });
      if (res.ok) {
        return new Response(JSON.stringify({ ok: true, message: "Update triggered via gateway" }), {
          headers: { "content-type": "application/json" },
        });
      }
    } catch (e) {
      // Fall through to manual instructions
    }
  }

  // Fallback: return instructions
  return new Response(
    JSON.stringify({
      ok: false,
      error: "Gateway not configured. Run manually: npm update -g openclaw && openclaw gateway restart",
    }),
    { status: 503, headers: { "content-type": "application/json" } }
  );
}
