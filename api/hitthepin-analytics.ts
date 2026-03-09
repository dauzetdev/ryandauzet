export const config = { runtime: "edge" };

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getGSCToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })).buffer as ArrayBuffer);
  const claim = b64url(new TextEncoder().encode(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
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

const SITE_URL = "sc-domain:hitthepin.com";
const GSC_BASE = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}`;

async function gscQuery(token: string, body: object): Promise<any> {
  const res = await fetch(`${GSC_BASE}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GSC API error ${res.status}: ${text}`);
  }
  return res.json();
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return Response.json({ error: "GOOGLE_SERVICE_ACCOUNT_KEY not configured" }, { status: 503 });

  try {
    const sa: ServiceAccount = JSON.parse(raw);
    const token = await getGSCToken(sa);

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];
    const dateRange = { startDate, endDate };

    const [dailyRes, queriesRes, pagesRes, devicesRes, countriesRes] = await Promise.all([
      gscQuery(token, { ...dateRange, dimensions: ["date"], type: "web" }),
      gscQuery(token, { ...dateRange, dimensions: ["query"], rowLimit: 20, type: "web" }),
      gscQuery(token, { ...dateRange, dimensions: ["page"], rowLimit: 20, type: "web" }),
      gscQuery(token, { ...dateRange, dimensions: ["device"], type: "web" }),
      gscQuery(token, { ...dateRange, dimensions: ["country"], rowLimit: 10, type: "web" }),
    ]);

    const mapRow = (r: any) => ({
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    });

    const daily = (dailyRes.rows || []).map((r: any) => ({
      date: r.keys[0],
      ...mapRow(r),
    }));

    const topQueries = (queriesRes.rows || []).map((r: any) => ({
      query: r.keys[0],
      ...mapRow(r),
    }));

    const topPages = (pagesRes.rows || []).map((r: any) => ({
      page: r.keys[0],
      ...mapRow(r),
    }));

    const devices = (devicesRes.rows || []).map((r: any) => ({
      device: r.keys[0],
      ...mapRow(r),
    }));

    const countries = (countriesRes.rows || []).map((r: any) => ({
      country: r.keys[0],
      ...mapRow(r),
    }));

    const totalClicks = daily.reduce((s: number, d: any) => s + d.clicks, 0);
    const totalImpressions = daily.reduce((s: number, d: any) => s + d.impressions, 0);
    const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const avgPosition = daily.length > 0
      ? daily.reduce((s: number, d: any) => s + d.position, 0) / daily.length
      : 0;

    return Response.json({
      daily,
      topQueries,
      topPages,
      devices,
      countries,
      totals: {
        clicks: totalClicks,
        impressions: totalImpressions,
        ctr: avgCtr,
        position: avgPosition,
      },
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
