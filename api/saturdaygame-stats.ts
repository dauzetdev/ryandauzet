export const config = { runtime: "edge" };

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })).buffer as ArrayBuffer);
  const claim = b64url(new TextEncoder().encode(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).buffer as ArrayBuffer);

  const pem = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = b64url(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`)));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claim}.${sig}`,
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(data.error ?? "Failed to get access token");
  return data.access_token;
}

async function countCollection(projectId: string, collectionId: string, token: string): Promise<number> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runAggregationQuery`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredAggregationQuery: {
          aggregations: [{ alias: "count", count: {} }],
          structuredQuery: { from: [{ collectionId }] },
        },
      }),
    },
  );
  const data = await res.json() as { result?: { aggregateFields?: { count?: { integerValue?: string } } } }[];
  return parseInt(data?.[0]?.result?.aggregateFields?.count?.integerValue ?? "0") || 0;
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const raw = process.env.SG_FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return Response.json({ error: "SG_FIREBASE_SERVICE_ACCOUNT not configured" }, { status: 503 });

  try {
    const sa: ServiceAccount = JSON.parse(raw);
    const token = await getAccessToken(sa);

    const [users, rounds, tournaments, groups] = await Promise.all([
      countCollection(sa.project_id, "users", token),
      countCollection(sa.project_id, "scoreSessions", token),
      countCollection(sa.project_id, "tournaments", token),
      countCollection(sa.project_id, "groups", token),
    ]);

    return Response.json({ users, rounds, tournaments, groups });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
