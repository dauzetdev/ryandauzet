import { next } from "@vercel/edge";

export default function middleware(): ReturnType<typeof next> {
  return next();
}

export const config = { matcher: ["/((?!_next|favicon\\.ico).*)"] };
