import { next } from "@vercel/edge";

export default async function middleware(request: Request): Promise<Response | undefined> {
  const PASSWORD = process.env.DASHBOARD_PASSWORD || "changeme";
  const COOKIE_NAME = "dash_auth";
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
  const url = new URL(request.url);

  const hashPw = (pw: string) => {
    let h = 0;
    for (let i = 0; i < pw.length; i++) h = ((h << 5) - h + pw.charCodeAt(i)) | 0;
    return "v1_" + Math.abs(h).toString(36);
  };

  const getCookie = (cookies: string, name: string) => {
    const m = cookies.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return m ? m[1] : null;
  };

  // Handle login
  if (url.pathname === "/api/login" && request.method === "POST") {
    const body = await request.text();
    const pw = new URLSearchParams(body).get("password") || "";
    if (pw === PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
          "set-cookie": `${COOKIE_NAME}=${hashPw(PASSWORD)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
        },
      });
    }
    return new Response(loginHTML("Wrong password"), { status: 401, headers: { "content-type": "text/html; charset=utf-8" } });
  }

  // Check auth
  const token = getCookie(request.headers.get("cookie") || "", COOKIE_NAME);
  if (token === hashPw(PASSWORD)) return next();

  return new Response(loginHTML(), { status: 401, headers: { "content-type": "text/html; charset=utf-8" } });
}

function loginHTML(error?: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>🐦 Login</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0a0b0f;color:#e4e4e7;min-height:100vh;display:flex;align-items:center;justify-content:center}.b{background:#1a1d27;border:1px solid #2a2d3a;border-radius:16px;padding:40px;width:min(400px,90vw);text-align:center}.l{font-size:2.5rem;margin-bottom:8px}h1{font-size:1.2rem;margin-bottom:4px}.s{color:#71737e;font-size:.8rem;margin-bottom:24px}input{width:100%;padding:12px 16px;background:#12141c;border:1px solid #2a2d3a;border-radius:8px;color:#e4e4e7;font-size:.9rem;font-family:inherit;outline:none;margin-bottom:12px}input:focus{border-color:#3b82f6}button{width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:.9rem;font-weight:600;cursor:pointer}button:hover{background:#2563eb}.e{color:#ef4444;font-size:.8rem;margin-bottom:12px}</style></head><body><div class="b"><div class="l">🐦</div><h1>Command Center</h1><div class="s">Enter password to continue</div>${error ? '<div class="e">' + error + '</div>' : ''}<form method="POST" action="/api/login"><input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password"/><button type="submit">Enter</button></form></div></body></html>`;
}

export const config = { matcher: ["/((?!_next|favicon\\.ico).*)"] };
