import { useState, useMemo, useEffect, useRef } from "react";
import { useWorkspace, type StudyTask, type TaskPriority } from "@/context/WorkspaceContext";
import { Plus, Check, Trash2, Calendar as CalendarIcon, BookOpen, ChevronRight, Clock, ExternalLink, RefreshCw, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GoogleCalendarLogo, NotionLogo } from "@/components/IntegrationLogos";

const priorityConfig: Record<TaskPriority, { label: string; color: string; dot: string }> = {
  high: { label: "High", color: "text-destructive", dot: "bg-destructive" },
  medium: { label: "Medium", color: "text-accent", dot: "bg-accent" },
  low: { label: "Low", color: "text-muted-foreground", dot: "bg-muted-foreground/40" },
};

const courseOptions = [
  "",
  "Foundations of Machine Learning",
  "Advanced Statistical Methods",
  "Philosophy of Mind",
];

const syncPlatforms = [
  { id: "google-cal", name: "Google Calendar", logo: <GoogleCalendarLogo className="h-4 w-4" />, connected: false },
  { id: "notion", name: "Notion", logo: <NotionLogo className="h-4 w-4" />, connected: false },
];

const StudyPlan = () => {
  const { tasks, addTask, toggleTask, deleteTask, reorderTasks } = useWorkspace();

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);
  const [newDueTime, setNewDueTime] = useState("09:00");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [platformStates, setPlatformStates] = useState<Record<string, boolean>>({});

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const sortedActive = useMemo(() => {
    const order: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
    return [...activeTasks].sort((a, b) => order[a.priority] - order[b.priority]);
  }, [activeTasks]);

  // Listen for keyboard shortcut
  useEffect(() => {
    const handler = () => setShowAdd(true);
    window.addEventListener("shortcut:new-task", handler);
    return () => window.removeEventListener("shortcut:new-task", handler);
  }, []);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const dueStr = newDueDate
      ? `${format(newDueDate, "MMM d, yyyy")} at ${newDueTime}`
      : undefined;
    addTask({
      title: newTitle.trim(),
      course: newCourse || undefined,
      priority: newPriority,
      completed: false,
      dueDate: dueStr,
    });
    setNewTitle("");
    setNewCourse("");
    setNewPriority("medium");
    setNewDueDate(undefined);
    setNewDueTime("09:00");
    setShowAdd(false);
    toast.success("Task added");
  };

  const togglePlatform = (id: string) => {
    const next = !platformStates[id];
    setPlatformStates((prev) => ({ ...prev, [id]: next }));
    const name = syncPlatforms.find((p) => p.id === id)?.name;
    if (next) {
      toast.success(`${name} sync enabled`, { description: "Tasks with due dates will sync automatically." });
    } else {
      toast.success(`${name} sync disabled`);
    }
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const ids = sortedActive.map((t) => t.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); setDragOverId(null); return; }
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragId);
    reorderTasks(ids);
    setDragId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => { setDragId(null); setDragOverId(null); };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Study Plan</h1>
          <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
            {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""} remaining
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSync(!showSync)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-sans btn-ghost border border-border",
              showSync && "bg-muted/50 border-accent/20"
            )}
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sync
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-sans font-medium btn-apple"
          >
            <Plus className={`h-4 w-4 transition-transform duration-300 ease-spring ${showAdd ? "rotate-45" : ""}`} strokeWidth={1.5} />
            Add task
          </button>
        </div>
      </div>

      {/* Sync panel */}
      {showSync && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/80" strokeWidth={1.5} />
            <h3 className="text-[12px] font-sans font-medium text-foreground">Sync tasks to external platforms</h3>
          </div>
          <p className="text-[11px] font-sans text-muted-foreground/80 mb-4">
            Connect a platform to automatically sync tasks with due dates. You'll receive reminders on your mobile device.
          </p>
          <div className="space-y-1.5">
            {syncPlatforms.map((p) => {
              const isOn = platformStates[p.id] || false;
              return (
                <div key={p.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg setting-row">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center shrink-0 overflow-hidden bg-muted/50">
                      {p.logo}
                    </div>
                    <span className="text-[12px] font-sans text-foreground">{p.name}</span>
                  </div>
                  <button
                    onClick={() => togglePlatform(p.id)}
                    className={`toggle-apple h-[24px] w-[42px] ${isOn ? "bg-accent" : "bg-muted"}`}
                  >
                    <span className={`toggle-thumb top-[2.5px] left-[2.5px] h-[19px] w-[19px] ${isOn ? "translate-x-[18px]" : "translate-x-0"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add task form */}
      {showAdd && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5 animate-slide-up">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What do you need to do?"
            autoFocus
            className="w-full text-[14px] font-sans text-foreground bg-transparent border-none outline-none mb-4 placeholder:text-muted-foreground/70"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-200"
            >
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-200"
            >
              <option value="">No course</option>
              {courseOptions.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans flex items-center gap-1.5 btn-ghost",
                    newDueDate ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-3 w-3" strokeWidth={1.5} />
                  {newDueDate ? format(newDueDate, "MMM d, yyyy") : "Due date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Time picker */}
            {newDueDate && (
              <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border bg-background animate-fade-in-fast">
                <Clock className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="time"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  className="text-[11px] font-sans text-foreground bg-transparent border-none outline-none w-[70px] focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-muted-foreground btn-ghost hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium btn-apple"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active tasks */}
      <section className="mb-10 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        {sortedActive.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Check className="h-10 w-10 text-accent/30 mx-auto mb-3" strokeWidth={1} />
            <p className="text-muted-foreground/70 font-sans text-sm">All caught up. Nice work.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedActive.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                delay={100 + i * 50}
                isDragOver={dragOverId === task.id}
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={(e) => handleDragOver(e, task.id)}
                onDrop={(e) => handleDrop(e, task.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <section className="animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-muted-foreground/80 hover:text-muted-foreground mb-3 btn-ghost rounded-lg px-2 py-1 -ml-2"
          >
            <ChevronRight className={`h-3 w-3 transition-transform duration-300 ease-spring ${showCompleted ? "rotate-90" : ""}`} strokeWidth={1.5} />
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-1.5 stagger-children">
              {completedTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} delay={0} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

function TaskRow({
  task, onToggle, onDelete, delay,
  isDragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}: {
  task: StudyTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay: number;
  isDragOver?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}) {
  const prio = priorityConfig[task.priority];
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      draggable={!task.completed}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex items-start gap-3 card-interactive pl-5 pr-4 py-3.5 animate-fade-in [animation-fill-mode:backwards]",
        task.completed && "!border-border/50 opacity-60 hover:!shadow-none hover:!translate-y-0",
        isDragOver && "border-accent/40 bg-accent/5",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Drag handle */}
      {!task.completed && (
        <div className="mt-1 cursor-grab opacity-0 group-hover:opacity-60 transition-opacity duration-200 shrink-0">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 checkbox-apple ${
          task.completed
            ? "bg-accent border-accent"
            : "border-border"
        }`}
      >
        {task.completed && <Check className="h-3 w-3 text-accent-foreground animate-check-pop" strokeWidth={2.5} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-sans leading-snug transition-all duration-300 ease-spring ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
          <span className={`flex items-center gap-1 text-[10px] font-sans ${prio.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
            {prio.label}
          </span>
          {task.course && (
            <span className="text-[10px] font-sans text-muted-foreground/70 flex items-center gap-1">
              <BookOpen className="h-2.5 w-2.5" strokeWidth={1.5} />
              <span className="truncate max-w-[160px]">{task.course}</span>
            </span>
          )}
          {task.dueDate && (
            <span className="text-[10px] font-sans text-muted-foreground/70 flex items-center gap-1">
              <CalendarIcon className="h-2.5 w-2.5" strokeWidth={1.5} />
              {task.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Delete with confirmation */}
      {confirmDelete ? (
        <div className="flex items-center gap-1.5 shrink-0 animate-fade-in">
          <span className="text-[11px] font-sans text-destructive">Delete?</span>
          <button
            onClick={() => { onDelete(task.id); toast.success("Task removed"); }}
            className="px-2 py-0.5 rounded-md bg-destructive text-destructive-foreground text-[10px] font-sans font-medium hover:bg-destructive/90 transition-colors active:scale-[0.97]"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="px-2 py-0.5 rounded-md border border-border text-[10px] font-sans text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="mt-0.5 h-7 w-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground/80 hover:text-destructive hover:bg-destructive/5 transition-all duration-250 ease-spring shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

export default StudyPlan;
