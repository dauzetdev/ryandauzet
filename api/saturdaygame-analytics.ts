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

async function getFirestoreToken(sa: ServiceAccount): Promise<string> {
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
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
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

async function queryRecent(projectId: string, collectionId: string, token: string, orderField: string, limit: number, selectFields?: string[]): Promise<any[]> {
  const structuredQuery: any = {
    from: [{ collectionId }],
    orderBy: [{ field: { fieldPath: orderField }, direction: "DESCENDING" }],
    limit: limit,
  };
  if (selectFields) {
    structuredQuery.select = { fields: selectFields.map(f => ({ fieldPath: f })) };
  }
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ structuredQuery }),
    },
  );
  const data = await res.json() as any[];
  return data.filter((d: any) => d.document).map((d: any) => d.document);
}

async function getDoc(projectId: string, docPath: string, token: string): Promise<any> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return null;
  return res.json();
}

function extractField(fields: any, key: string): any {
  const val = fields?.[key];
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.doubleValue !== undefined) return val.doubleValue;
  return null;
}

// ── App Store Connect JWT ──
async function getASCToken(): Promise<string | null> {
  const keyId = process.env.ASC_KEY_ID;
  const issuerId = process.env.ASC_ISSUER_ID;
  const privateKey = process.env.ASC_PRIVATE_KEY;
  if (!keyId || !issuerId || !privateKey) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" })).buffer as ArrayBuffer);
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    iss: issuerId,
    iat: now,
    exp: now + 1200,
    aud: "appstoreconnect-v1",
  })).buffer as ArrayBuffer);

  const pem = privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sigRaw = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(`${header}.${payload}`)));

  // WebCrypto returns IEEE P1363 format (r || s, 64 bytes) which is what JWT ES256 expects
  const sig = b64url(sigRaw.buffer as ArrayBuffer);
  return `${header}.${payload}.${sig}`;
}

async function fetchASCData(ascToken: string): Promise<any> {
  const appId = "6754344063";
  const headers = { Authorization: `Bearer ${ascToken}` };

  const [versionsRes, buildsRes] = await Promise.all([
    fetch(`https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions?limit=5`, { headers }),
    fetch(`https://api.appstoreconnect.apple.com/v1/builds?filter[app]=${appId}&sort=-uploadedDate&limit=5`, { headers }),
  ]);

  const versions = versionsRes.ok
    ? ((await versionsRes.json()) as any).data?.map((v: any) => ({
        version: v.attributes?.versionString,
        state: v.attributes?.appStoreState,
      })) ?? []
    : [];

  const builds = buildsRes.ok
    ? ((await buildsRes.json()) as any).data?.map((b: any) => ({
        version: b.attributes?.version,
        buildNumber: b.attributes?.version,
        uploadedDate: b.attributes?.uploadedDate,
      })) ?? []
    : [];

  return { versions, recentBuilds: builds };
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
    const token = await getFirestoreToken(sa);

    // Run all Firestore queries in parallel
    const [users, rounds, tournaments, groups, polls, recentUserDocs, recentTournamentDocs, configDoc, ascToken] = await Promise.all([
      countCollection(sa.project_id, "users", token),
      countCollection(sa.project_id, "scoreSessions", token),
      countCollection(sa.project_id, "tournaments", token),
      countCollection(sa.project_id, "groups", token),
      countCollection(sa.project_id, "polls", token),
      queryRecent(sa.project_id, "users", token, "createdAt", 30, ["firstName", "lastName", "createdAt"]),
      queryRecent(sa.project_id, "tournaments", token, "createdAt", 20, ["date", "status", "gameFormat", "createdAt"]),
      getDoc(sa.project_id, "config/appSettings", token),
      getASCToken(),
    ]);

    const recentUsers = recentUserDocs.map((doc: any) => ({
      firstName: extractField(doc.fields, "firstName"),
      lastName: extractField(doc.fields, "lastName"),
      createdAt: extractField(doc.fields, "createdAt"),
    }));

    const recentTournaments = recentTournamentDocs.map((doc: any) => {
      const name = doc.name?.split("/").pop() ?? "";
      return {
        name,
        date: extractField(doc.fields, "date"),
        status: extractField(doc.fields, "status"),
        gameFormat: extractField(doc.fields, "gameFormat"),
        createdAt: extractField(doc.fields, "createdAt"),
      };
    });

    const appConfig = configDoc?.fields ? {
      minimumVersion: extractField(configDoc.fields, "minimumVersion"),
      recommendedVersion: extractField(configDoc.fields, "recommendedVersion"),
    } : null;

    // App Store Connect (graceful fallback)
    let appStore = null;
    if (ascToken) {
      try {
        appStore = await fetchASCData(ascToken);
      } catch {
        // ASC failed, continue without it
      }
    }

    return Response.json({
      counts: { users, rounds, tournaments, groups, polls },
      recentUsers,
      recentTournaments,
      appConfig,
      appStore,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
