import { promises as fs } from "fs";
import path from "path";

export const config = { runtime: "nodejs" };

const TASKS_FILE = "/Users/dauzet/.openclaw/workspace/tasks.json";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: "ryan" | "wren" | "geoff" | "rigs";
  column: "backlog" | "in-progress" | "review" | "done";
  project: string;
  createdAt: string;
  updatedAt: string;
}

interface TasksFile {
  tasks: Task[];
}

async function readTasks(): Promise<TasksFile> {
  try {
    const raw = await fs.readFile(TASKS_FILE, "utf-8");
    return JSON.parse(raw) as TasksFile;
  } catch {
    return { tasks: [] };
  }
}

async function writeTasks(data: TasksFile): Promise<void> {
  await fs.writeFile(TASKS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export default async function handler(request: Request): Promise<Response> {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("dash_auth=")) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (request.method === "GET") {
    const data = await readTasks();
    let activity: string[] = [];
    try {
      const memDir = "/Users/dauzet/.openclaw/workspace/memory";
      const files = await fs.readdir(memDir);
      const datFiles = files
        .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
        .sort()
        .reverse();
      if (datFiles.length > 0) {
        const latest = await fs.readFile(path.join(memDir, datFiles[0]), "utf-8");
        const lines = latest.split("\n").filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*"));
        activity = lines.slice(0, 10);
      }
    } catch {
      // ignore
    }
    return Response.json({ tasks: data.tasks, activity });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as Partial<Task> & { action?: string };
    const data = await readTasks();

    if (body.action === "move" && body.id && body.column) {
      const task = data.tasks.find((t) => t.id === body.id);
      if (task) {
        task.column = body.column;
        task.updatedAt = new Date().toISOString();
      }
      await writeTasks(data);
      return Response.json({ ok: true, tasks: data.tasks });
    }

    if (body.action === "delete" && body.id) {
      data.tasks = data.tasks.filter((t) => t.id !== body.id);
      await writeTasks(data);
      return Response.json({ ok: true, tasks: data.tasks });
    }

    if (body.action === "update" && body.id) {
      const task = data.tasks.find((t) => t.id !== body.id);
      if (task) {
        if (body.title) task.title = body.title;
        if (body.description !== undefined) task.description = body.description;
        if (body.assignee) task.assignee = body.assignee;
        if (body.column) task.column = body.column;
        if (body.project !== undefined) task.project = body.project;
        task.updatedAt = new Date().toISOString();
      }
      await writeTasks(data);
      return Response.json({ ok: true, tasks: data.tasks });
    }

    // Create new task
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: body.title || "Untitled",
      description: body.description || "",
      assignee: body.assignee || "ryan",
      column: body.column || "backlog",
      project: body.project || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    await writeTasks(data);
    return Response.json({ ok: true, task: newTask, tasks: data.tasks });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
