import { promises as fs } from "fs";
import path from "path";

export const config = { runtime: "nodejs" };

const WORKSPACE = "/Users/dauzet/.openclaw/workspace";
const DOCS_DIR = path.join(WORKSPACE, "docs");

const SYSTEM_FILES = new Set([
  "AGENTS.md","SOUL.md","IDENTITY.md","USER.md","TOOLS.md",
  "MEMORY.md","HEARTBEAT.md","BOOTSTRAP.md","CONTENT_STRATEGY.md",
  "RULES.md","STYLE_GUIDE.md","SOURCES.md",
]);

function categorize(filename: string, subdir?: string): string {
  if (subdir) {
    if (subdir === "hitthepin") return "HITTHEPIN";
    if (subdir === "saturdaygame") return "SATURDAYGAME";
    if (subdir === "golfbooker") return "GOLFBOOKER";
    return subdir.toUpperCase();
  }
  if (SYSTEM_FILES.has(filename)) return "SYSTEM";
  const lower = filename.toLowerCase();
  if (lower.includes("content") || lower.includes("style") || lower.includes("rules")) return "CONTENT";
  if (lower.includes("tool") || lower.includes("skill")) return "TOOLS";
  return "OTHER";
}

async function collectDocs(dir: string, subdir?: string): Promise<any[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const docs: any[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath).catch(() => null);
    if (!stat) continue;

    if (stat.isDirectory() && !subdir) {
      // One level of subdirectory support
      const sub = await collectDocs(fullPath, entry);
      docs.push(...sub);
    } else if (entry.endsWith(".md") && stat.isFile()) {
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        const preview = content.slice(0, 150).replace(/\n/g, " ").trim();
        docs.push({
          filename: entry,
          path: subdir ? `${subdir}/${entry}` : entry,
          subdir: subdir || null,
          preview,
          lastModified: stat.mtime.toISOString(),
          category: categorize(entry, subdir),
          size: stat.size,
        });
      } catch {}
    }
  }
  return docs;
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const fileParam = url.searchParams.get("file");
  const searchParam = url.searchParams.get("search");

  // GET ?file=subdir/filename or ?file=filename
  if (fileParam) {
    const safePath = fileParam.replace(/\.\./g, "");
    // Try docs/ subdir first, then workspace root
    const candidates = [
      path.join(DOCS_DIR, safePath),
      path.join(WORKSPACE, safePath),
    ];
    for (const candidate of candidates) {
      try {
        const content = await fs.readFile(candidate, "utf-8");
        return Response.json({ content, filename: path.basename(fileParam) });
      } catch {}
    }
    return Response.json({ error: "File not found" }, { status: 404 });
  }

  // GET list — workspace root .md files + docs/ subdirs
  try {
    const [rootFiles, subDocs] = await Promise.all([
      collectDocs(WORKSPACE),
      collectDocs(DOCS_DIR),
    ]);

    // Merge, deduplicate by path
    const seen = new Set<string>();
    const all = [...subDocs, ...rootFiles].filter((d) => {
      if (seen.has(d.path)) return false;
      seen.add(d.path);
      return true;
    });

    let result = all;
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = all.filter(
        (d) => d.filename.toLowerCase().includes(q) ||
               d.preview.toLowerCase().includes(q) ||
               (d.subdir && d.subdir.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    return Response.json({ docs: result });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
