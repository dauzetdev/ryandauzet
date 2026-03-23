import { promises as fs } from "fs";
import path from "path";

export const config = { runtime: "nodejs" };

const MEM_DIR = "/Users/dauzet/.openclaw/workspace/memory";
const WORKSPACE = "/Users/dauzet/.openclaw/workspace";

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const fileParam = url.searchParams.get("file");
  const searchParam = url.searchParams.get("search");

  // GET ?file=MEMORY.md — fetch top-level workspace file
  if (fileParam) {
    const filePath = path.join(WORKSPACE, path.basename(fileParam));
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return Response.json({ content });
    } catch {
      return Response.json({ error: "File not found" }, { status: 404 });
    }
  }

  // GET ?date=YYYY-MM-DD — fetch specific day log
  if (dateParam) {
    const filePath = path.join(MEM_DIR, `${dateParam}.md`);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return Response.json({ content, date: dateParam });
    } catch {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
  }

  // GET (list) — list all dates + optional search
  try {
    const files = await fs.readdir(MEM_DIR);
    const datFiles = files
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse();

    if (searchParam) {
      const results: { date: string; preview: string }[] = [];
      for (const f of datFiles) {
        const content = await fs.readFile(path.join(MEM_DIR, f), "utf-8");
        if (content.toLowerCase().includes(searchParam.toLowerCase())) {
          const idx = content.toLowerCase().indexOf(searchParam.toLowerCase());
          const preview = content.slice(Math.max(0, idx - 50), idx + 100).replace(/\n/g, " ");
          results.push({ date: f.replace(".md", ""), preview });
        }
      }
      return Response.json({ results });
    }

    const dates = datFiles.map((f) => f.replace(".md", ""));
    return Response.json({ dates });
  } catch {
    return Response.json({ dates: [] });
  }
}
