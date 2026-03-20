import { useState, useMemo } from "react";
import { useWorkspace, type StudyTask, type TaskPriority } from "@/context/WorkspaceContext";
import { Plus, Check, Circle, Trash2, Calendar, Flag, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

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

const StudyPlan = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useWorkspace();

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDue, setNewDue] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const sortedActive = useMemo(() => {
    const order: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
    return [...activeTasks].sort((a, b) => order[a.priority] - order[b.priority]);
  }, [activeTasks]);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      course: newCourse || undefined,
      priority: newPriority,
      completed: false,
      dueDate: newDue || undefined,
    });
    setNewTitle("");
    setNewCourse("");
    setNewPriority("medium");
    setNewDue("");
    setShowAdd(false);
    toast.success("Task added");
  };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 animate-fade-in">
        <div>
          <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Study Plan</h1>
          <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
            {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""} remaining
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add task
        </button>
      </div>

      {/* Add task form */}
      {showAdd && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5 animate-fade-in">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="What do you need to do?"
            autoFocus
            className="w-full text-[14px] font-sans text-foreground bg-transparent border-none outline-none mb-4 placeholder:text-muted-foreground/30"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
            >
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
            >
              <option value="">No course</option>
              {courseOptions.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              placeholder="Due date (e.g. Friday)"
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-[11px] font-sans text-muted-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
            />
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowAdd(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-muted-foreground hover:text-foreground transition-colors duration-200 active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
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
          <div className="text-center py-16">
            <Check className="h-10 w-10 text-accent/30 mx-auto mb-3" strokeWidth={1} />
            <p className="text-muted-foreground/70 font-sans text-sm">All caught up. Nice work.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sortedActive.map((task, i) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} delay={100 + i * 40} />
            ))}
          </div>
        )}
      </section>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <section className="animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground mb-3 transition-colors duration-200"
          >
            {showCompleted ? <ChevronDown className="h-3 w-3" strokeWidth={1.5} /> : <ChevronRight className="h-3 w-3" strokeWidth={1.5} />}
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-1 animate-fade-in">
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

function TaskRow({ task, onToggle, onDelete, delay }: { task: StudyTask; onToggle: (id: string) => void; onDelete: (id: string) => void; delay: number }) {
  const prio = priorityConfig[task.priority];

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border bg-card px-4 py-3.5 transition-all duration-200 ease-out animate-fade-in [animation-fill-mode:backwards] ${
        task.completed ? "border-border/50 opacity-60" : "border-border hover:border-accent/20 hover:shadow-soft"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 active:scale-[0.9] ${
          task.completed
            ? "bg-accent border-accent"
            : "border-border hover:border-accent/50"
        }`}
      >
        {task.completed && <Check className="h-3 w-3 text-accent-foreground" strokeWidth={2.5} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-sans leading-snug ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
          {/* Priority */}
          <span className={`flex items-center gap-1 text-[10px] font-sans ${prio.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${prio.dot}`} />
            {prio.label}
          </span>
          {/* Course */}
          {task.course && (
            <span className="text-[10px] font-sans text-muted-foreground/50 flex items-center gap-1">
              <BookOpen className="h-2.5 w-2.5" strokeWidth={1.5} />
              <span className="truncate max-w-[160px]">{task.course}</span>
            </span>
          )}
          {/* Due */}
          {task.dueDate && (
            <span className="text-[10px] font-sans text-muted-foreground/50 flex items-center gap-1">
              <Calendar className="h-2.5 w-2.5" strokeWidth={1.5} />
              {task.dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => {
          onDelete(task.id);
          toast.success("Task removed");
        }}
        className="mt-0.5 h-6 w-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all duration-200 shrink-0"
      >
        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default StudyPlan;
