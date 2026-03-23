import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: "ryan" | "wren" | "geoff" | "rigs";
  column: "backlog" | "in-progress" | "review" | "done";
  project: string;
  createdAt: string;
  updatedAt: string;
}

const COLUMNS: { id: Task["column"]; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

const ASSIGNEE_AVATAR: Record<string, string> = {
  ryan: "👤",
  wren: "🐦",
  geoff: "⛳",
  rigs: "🏌️",
};

const ASSIGNEES = ["ryan", "wren", "geoff", "rigs"] as const;

interface NewTaskForm {
  title: string;
  description: string;
  assignee: Task["assignee"];
  project: string;
  column: Task["column"];
}

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewTaskForm>({
    title: "",
    description: "",
    assignee: "wren",
    project: "",
    column: "backlog",
  });

  const fetchTasks = async () => {
    const r = await fetch("/api/tasks");
    const d = await r.json() as { tasks?: Task[]; activity?: string[] };
    setTasks(d.tasks || []);
    setActivity(d.activity || []);
  };

  useEffect(() => { fetchTasks(); }, []);

  const moveTask = async (taskId: string, column: Task["column"]) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "move", id: taskId, column }),
    });
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "delete", id: taskId }),
    });
    fetchTasks();
  };

  const createTask = async () => {
    if (!form.title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ title: "", description: "", assignee: "wren", project: "", column: "backlog" });
    fetchTasks();
  };

  return (
    <div className="flex h-full">
      {/* Left sidebar: activity feed */}
      <div className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Recent Activity</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {activity.length === 0 && (
            <div className="text-xs text-text-secondary p-2 text-center">No recent activity</div>
          )}
          {activity.map((line, i) => (
            <div key={i} className="text-xs text-text-secondary py-1.5 border-b border-border/40 last:border-0 leading-snug">
              {line.replace(/^[-*]\s*/, "")}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-text">Task Board</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors cursor-pointer"
          >
            + New Task
          </button>
        </div>
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full min-w-0" style={{ minWidth: "800px" }}>
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.column === col.id);
              return (
                <div key={col.id} className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{col.label}</span>
                    <span className="text-xs text-text-secondary bg-surface rounded px-1.5 py-0.5">{colTasks.length}</span>
                  </div>
                  <div className="flex-1 bg-surface/50 rounded-lg p-2 space-y-2 min-h-[200px]">
                    {colTasks.map((task) => (
                      <div key={task.id} className="bg-bg border border-border rounded-lg p-3 group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-text leading-snug">{task.title}</div>
                            {task.description && (
                              <div className="text-xs text-text-secondary mt-1 line-clamp-2">{task.description}</div>
                            )}
                            {task.project && (
                              <div className="text-xs text-text-secondary/60 mt-1">#{task.project}</div>
                            )}
                          </div>
                          <span title={task.assignee} className="text-base shrink-0">{ASSIGNEE_AVATAR[task.assignee]}</span>
                        </div>
                        {/* Move buttons */}
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                            <button
                              key={c.id}
                              onClick={() => moveTask(task.id, c.id)}
                              className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-text-secondary hover:text-text transition-colors cursor-pointer"
                            >
                              → {c.label}
                            </button>
                          ))}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-danger hover:bg-danger/10 transition-colors cursor-pointer ml-auto"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg border border-border rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-base font-semibold text-text mb-4">New Task</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-secondary block mb-1">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-accent"
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-accent resize-none"
                  placeholder="Optional description..."
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-text-secondary block mb-1">Assignee</label>
                  <select
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value as Task["assignee"] })}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-accent"
                  >
                    {ASSIGNEES.map((a) => (
                      <option key={a} value={a}>{ASSIGNEE_AVATAR[a]} {a}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-secondary block mb-1">Column</label>
                  <select
                    value={form.column}
                    onChange={(e) => setForm({ ...form, column: e.target.value as Task["column"] })}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-accent"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary block mb-1">Project tag</label>
                <input
                  type="text"
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-text focus:outline-none focus:border-accent"
                  placeholder="hitthepin, geoff, rigs..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text hover:bg-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                disabled={!form.title.trim()}
                className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
