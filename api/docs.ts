import { promises as fs } from "fs";
import path from "path";

export const config = { runtime: "nodejs" };

const WORKSPACE = "/Users/dauzet/.openclaw/workspace";

const CATEGORY_MAP: Record<string, string> = {
  "AGENTS.md": "SYSTEM",
  "SOUL.md": "SYSTEM",
  "IDENTITY.md": "SYSTEM",
  "USER.md": "SYSTEM",
  "TOOLS.md": "SYSTEM",
  "MEMORY.md": "SYSTEM",
  "HEARTBEAT.md": "SYSTEM",
  "BOOTSTRAP.md": "SYSTEM",
};

function categorize(filename: string): string {
  if (CATEGORY_MAP[filename]) return CATEGORY_MAP[filename];
  const lower = filename.toLowerCase();
  if (lower.includes("agent") || lower.includes("soul") || lower.includes("identity") || lower.includes("user") || lower.includes("memory")) return "SYSTEM";
  if (lower.includes("content") || lower.includes("geoff") || lower.includes("rigs")) return "CONTENT";
  if (lower.includes("tool") || lower.includes("skill") || lower.includes("api")) return "TOOLS";
  return "OTHER";
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const fileParam = url.searchParams.get("file");
  const searchParam = url.searchParams.get("search");

  // GET ?file=filename — fetch file content
  if (fileParam) {
    const filePath = path.join(WORKSPACE, path.basename(fileParam));
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return Response.json({ content, filename: path.basename(fileParam) });
    } catch {
      return Response.json({ error: "File not found" }, { status: 404 });
    }
  }

  // GET list
  try {
    const files = await fs.readdir(WORKSPACE);
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    const docs = await Promise.all(
      mdFiles.map(async (f) => {
        const filePath = path.join(WORKSPACE, f);
        const stat = await fs.stat(filePath);
        const content = await fs.readFile(filePath, "utf-8");
        const preview = content.slice(0, 150).replace(/\n/g, " ").trim();
        return {
          filename: f,
          preview,
          lastModified: stat.mtime.toISOString(),
          category: categorize(f),
          size: stat.size,
        };
      })
    );

    if (searchParam) {
      const q = searchParam.toLowerCase();
      const filtered = docs.filter(
        (d) => d.filename.toLowerCase().includes(q) || d.preview.toLowerCase().includes(q)
      );
      return Response.json({ docs: filtered });
    }

    docs.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    return Response.json({ docs });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
