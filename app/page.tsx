"use client";

import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDot,
  Clapperboard,
  Clock3,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "Idea" | "Pre-production" | "Shooting" | "Editing" | "Done";

type Project = {
  id: number;
  title: string;
  client: string;
  status: Status;
  due: string;
  tasks: number;
  completed: number;
  accent: string;
};

const seedProjects: Project[] = [
  {
    id: 1,
    title: "Night Shift",
    client: "Personal film",
    status: "Shooting",
    due: "Oct 04",
    tasks: 8,
    completed: 5,
    accent: "from-violet-500/80 via-fuchsia-500/60 to-orange-400/70",
  },
  {
    id: 2,
    title: "Still moving",
    client: "NOIR studio",
    status: "Editing",
    due: "Sep 30",
    tasks: 12,
    completed: 9,
    accent: "from-zinc-500/80 via-slate-400/50 to-cyan-300/60",
  },
  {
    id: 3,
    title: "After 2AM",
    client: "Editorial",
    status: "Pre-production",
    due: "Oct 11",
    tasks: 10,
    completed: 3,
    accent: "from-red-500/75 via-orange-500/60 to-amber-300/65",
  },
  {
    id: 4,
    title: "Glassroom",
    client: "Aster",
    status: "Idea",
    due: "Oct 18",
    tasks: 6,
    completed: 1,
    accent: "from-emerald-400/65 via-teal-400/55 to-blue-500/65",
  },
];

const statusStyle: Record<Status, string> = {
  Idea: "bg-white/5 text-zinc-300",
  "Pre-production": "bg-violet-400/10 text-violet-200",
  Shooting: "bg-orange-400/10 text-orange-200",
  Editing: "bg-cyan-400/10 text-cyan-200",
  Done: "bg-emerald-400/10 text-emerald-200",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [active, setActive] = useState("Overview");

  useEffect(() => {
    const saved = window.localStorage.getItem("frameflow-projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch {
        // Keep seeded demo content if local state is malformed.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("frameflow-projects", JSON.stringify(projects));
  }, [projects]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return projects;
    return projects.filter((project) =>
      [project.title, project.client, project.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [projects, query]);

  const openTasks = projects.reduce(
    (total, project) => total + project.tasks - project.completed,
    0
  );

  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const client = String(form.get("client") || "").trim() || "Personal";
    const status = String(form.get("status") || "Idea") as Status;

    if (!title) return;

    const accents = [
      "from-violet-500/80 via-fuchsia-500/60 to-orange-400/70",
      "from-emerald-400/65 via-teal-400/55 to-blue-500/65",
      "from-red-500/75 via-orange-500/60 to-amber-300/65",
      "from-zinc-500/80 via-slate-400/50 to-cyan-300/60",
    ];

    setProjects((current) => [
      {
        id: Date.now(),
        title,
        client,
        status,
        due: "No date",
        tasks: 5,
        completed: 0,
        accent: accents[current.length % accents.length],
      },
      ...current,
    ]);
    setShowNew(false);
  }

  function toggleTask(projectId: number) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              completed:
                project.completed < project.tasks
                  ? project.completed + 1
                  : 0,
              status:
                project.completed + 1 >= project.tasks ? "Done" : project.status,
            }
          : project
      )
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1700px]">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[.07] bg-[#0b0b0e]/95 p-4 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            sidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-2 py-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-white text-black shadow-panel">
                  <Clapperboard size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">FrameFlow</div>
                  <div className="text-[11px] text-zinc-500">creative workspace</div>
                </div>
              </div>
              <button
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 lg:hidden"
                onClick={() => setSidebar(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7 space-y-1">
              {[
                ["Overview", LayoutDashboard],
                ["Projects", FolderKanban],
                ["Moodboards", Grid2X2],
                ["Tasks", CircleDot],
              ].map(([label, Icon]) => (
                <button
                  key={label as string}
                  onClick={() => setActive(label as string)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active === label
                      ? "bg-white/[.08] text-white"
                      : "text-zinc-500 hover:bg-white/[.04] hover:text-zinc-300"
                  }`}
                >
                  <Icon size={17} />
                  {label as string}
                </button>
              ))}
            </div>

            <div className="mt-8 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-600">
              Workspace
            </div>
            <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-sm font-medium">Personal studio</p>
                  <p className="mb-0 mt-1 text-xs text-zinc-600">4 active projects</p>
                </div>
                <ChevronDown size={15} className="text-zinc-600" />
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-orange-300/10 bg-gradient-to-br from-orange-500/[.10] to-transparent p-4">
              <div className="mb-3 grid size-8 place-items-center rounded-lg bg-orange-400/10 text-orange-200">
                <Sparkles size={16} />
              </div>
              <p className="m-0 text-sm font-medium">FrameFlow Pro</p>
              <p className="mb-4 mt-1 text-xs leading-5 text-zinc-500">
                AI search, cloud sync and client review links.
              </p>
              <button className="text-xs font-medium text-orange-200">
                Join waitlist <ArrowUpRight className="ml-1 inline" size={12} />
              </button>
            </div>
          </div>
        </aside>

        {sidebar && (
          <button
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebar(false)}
            aria-label="Close navigation"
          />
        )}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[.06] bg-[#09090b]/75 px-4 py-3 backdrop-blur-xl sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-white/[.08] p-2.5 text-zinc-400 lg:hidden"
                onClick={() => setSidebar(true)}
              >
                <Menu size={17} />
              </button>

              <div className="relative max-w-md flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects, clients, status..."
                  className="w-full rounded-xl border border-white/[.07] bg-white/[.035] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/[.14] focus:bg-white/[.05]"
                />
              </div>

              <div className="ml-auto hidden items-center gap-2 sm:flex">
                <div className="grid size-9 place-items-center rounded-full border border-white/10 bg-zinc-800 text-[11px] font-semibold">
                  99
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[.16em] text-zinc-600">
                  Sunday · Creative HQ
                </p>
                <h1 className="m-0 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                  Keep the work moving.
                </h1>
                <p className="mb-0 mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                  One place for ideas, references, shoot planning and post-production.
                </p>
              </div>

              <button
                onClick={() => setShowNew(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                <Plus size={16} strokeWidth={2.5} />
                New project
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Active projects", projects.filter((p) => p.status !== "Done").length, "Live workspace"],
                ["Open tasks", openTasks, "Across all projects"],
                ["Completion", `${Math.round(
                  (projects.reduce((sum, p) => sum + p.completed, 0) /
                    Math.max(projects.reduce((sum, p) => sum + p.tasks, 0), 1)) *
                    100
                )}%`, "Current pipeline"],
              ].map(([label, value, detail]) => (
                <div
                  key={label as string}
                  className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"
                >
                  <div className="text-xs text-zinc-600">{label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
                  <div className="mt-1 text-[11px] text-zinc-700">{detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div>
                <h2 className="m-0 text-base font-semibold">Current projects</h2>
                <p className="mb-0 mt-1 text-xs text-zinc-600">
                  {filtered.length} project{filtered.length === 1 ? "" : "s"} shown
                </p>
              </div>
              <button className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-zinc-300">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => {
                const progress = Math.round((project.completed / project.tasks) * 100);

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-[20px] border border-white/[.07] bg-[#111115] transition duration-300 hover:-translate-y-0.5 hover:border-white/[.12] hover:shadow-panel"
                  >
                    <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.25),transparent_22%),linear-gradient(to_top,rgba(0,0,0,.46),transparent_60%)]" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.12em] text-white/80 backdrop-blur-md">
                        {project.client}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-2xl font-semibold tracking-[-.04em] text-white">
                          {initials(project.title)}
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="m-0 text-base font-semibold tracking-tight">
                            {project.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-600">
                            <Clock3 size={12} />
                            Due {project.due}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyle[project.status]}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-600">Tasks</span>
                          <span className="text-zinc-400">
                            {project.completed}/{project.tasks}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                          <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => toggleTask(project.id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[.07] bg-white/[.025] py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[.06] hover:text-white"
                      >
                        {project.status === "Done" ? (
                          <>
                            <Check size={14} /> Completed
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Complete next task
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}

              <button
                onClick={() => setShowNew(true)}
                className="min-h-[354px] rounded-[20px] border border-dashed border-white/[.10] bg-white/[.015] text-zinc-600 transition hover:border-white/[.18] hover:bg-white/[.025] hover:text-zinc-300"
              >
                <div className="mx-auto grid size-10 place-items-center rounded-full border border-white/[.08] bg-white/[.025]">
                  <Plus size={17} />
                </div>
                <div className="mt-3 text-sm font-medium">Create a project</div>
                <div className="mt-1 text-xs text-zinc-700">Start from a blank workspace</div>
              </button>
            </div>

            <div className="mt-12 rounded-[24px] border border-white/[.07] bg-white/[.02] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-orange-300" />
                    <h2 className="m-0 text-sm font-semibold">Product direction</h2>
                  </div>
                  <p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-zinc-600">
                    This MVP is intentionally local-first. The next product layer is authentication,
                    cloud sync, shareable client review pages, AI-assisted reference tagging and a Pro plan.
                  </p>
                </div>
                <div className="shrink-0 rounded-xl border border-white/[.07] bg-black/20 px-3 py-2 text-[11px] text-zinc-500">
                  MVP · v0.1
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <button
            className="absolute inset-0 cursor-default"
            onClick={() => setShowNew(false)}
            aria-label="Close modal"
          />
          <form
            onSubmit={createProject}
            className="relative z-10 w-full max-w-md rounded-[24px] border border-white/[.10] bg-[#121216] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold tracking-tight">New project</h2>
                <p className="mb-0 mt-1 text-xs text-zinc-600">
                  Add a project to your creative pipeline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
              >
                <X size={17} />
              </button>
            </div>

            <label className="mt-6 block text-xs text-zinc-500">
              Project name
              <input
                name="title"
                autoFocus
                required
                placeholder="e.g. Parallel Lines"
                className="mt-2 w-full rounded-xl border border-white/[.08] bg-white/[.035] px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/[.16]"
              />
            </label>

            <label className="mt-4 block text-xs text-zinc-500">
              Client / type
              <input
                name="client"
                placeholder="Personal"
                className="mt-2 w-full rounded-xl border border-white/[.08] bg-white/[.035] px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/[.16]"
              />
            </label>

            <label className="mt-4 block text-xs text-zinc-500">
              Status
              <select
                name="status"
                defaultValue="Idea"
                className="mt-2 w-full rounded-xl border border-white/[.08] bg-[#17171c] px-3.5 py-3 text-sm text-white outline-none focus:border-white/[.16]"
              >
                <option>Idea</option>
                <option>Pre-production</option>
                <option>Shooting</option>
                <option>Editing</option>
                <option>Done</option>
              </select>
            </label>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="flex-1 rounded-xl border border-white/[.08] py-3 text-sm text-zinc-400 hover:bg-white/[.04]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Create project
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
