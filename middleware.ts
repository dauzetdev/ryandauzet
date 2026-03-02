import { next } from "@vercel/edge";

const PASSWORD = process.env.DASHBOARD_PASSWORD || "changeme";
const COOKIE_NAME = "dash_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/login" && request.method === "POST") {
    return handleLogin(request);
  }

  const cookies = request.headers.get("cookie") || "";
  const token = getCookie(cookies, COOKIE_NAME);

  if (token === hashPassword(PASSWORD)) {
    return next();
  }

  return new Response(loginPage(), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function handleLogin(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const password = params.get("password") || "";

  if (password === PASSWORD) {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
        "set-cookie": `${COOKIE_NAME}=${hashPassword(PASSWORD)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
      },
    });
  }

  return new Response(loginPage("Wrong password"), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function hashPassword(pw: string): string {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    const char = pw.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return "v1_" + Math.abs(hash).toString(36);
}

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}

function loginPage(error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🐦 Login</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', 'Inter', sans-serif;
    background: #0a0b0f;
    color: #e4e4e7;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-box {
    background: #1a1d27;
    border: 1px solid #2a2d3a;
    border-radius: 16px;
    padding: 40px;
    width: min(400px, 90vw);
    text-align: center;
  }
  .logo { font-size: 2.5rem; margin-bottom: 8px; }
  h1 { font-size: 1.2rem; margin-bottom: 4px; }
  .sub { color: #71737e; font-size: 0.8rem; margin-bottom: 24px; }
  input {
    width: 100%;
    padding: 12px 16px;
    background: #12141c;
    border: 1px solid #2a2d3a;
    border-radius: 8px;
    color: #e4e4e7;
    font-size: 0.9rem;
    font-family: inherit;
    outline: none;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }
  input:focus { border-color: #3b82f6; }
  button {
    width: 100%;
    padding: 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }
  button:hover { background: #2563eb; }
  .error { color: #ef4444; font-size: 0.8rem; margin-bottom: 12px; }
</style>
</head>
<body>
<div class="login-box">
  <div class="logo">🐦</div>
  <h1>Command Center</h1>
  <div class="sub">Enter password to continue</div>
  ${error ? '<div class="error">' + error + '</div>' : ""}
  <form method="POST" action="/api/login">
    <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
    <button type="submit">Enter</button>
  </form>
</div>
</body>
</html>`;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
