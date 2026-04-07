import { ArrowRight, BookOpen, Library, Clock, ListChecks, Check, Calendar, Bell, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";


function seedHash(str: string, salt: number = 0): number {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return (((h >>> 0) % 1000) / 1000);
}

const lastActiveOptions = ["2 hours ago", "Yesterday", "3 days ago", "5 days ago", "1 week ago"];
const moduleLabels = [
  "Neural Networks", "Bayesian Inference", "Consciousness", "Matrix Fundamentals",
  "Attention & Memory", "Research Design", "Optimization", "Data Modeling",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const priorityDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-accent",
  low: "bg-muted-foreground/40",
};

/* ─── Notification Inbox ─── */
function NotificationInbox({
  announcements,
}: {
  announcements: { id: string; title: string; body: string; sentDate: string; audience: string }[];
}) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const items = announcements.map((a) => ({
      ...a,
      dismissed: dismissedIds.has(a.id),
    }));
    items.sort((a, b) => {
      if (a.dismissed !== b.dismissed) return a.dismissed ? 1 : -1;
      return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
    });
    return items;
  }, [announcements, dismissedIds]);

  const unreadCount = sorted.filter((n) => !n.dismissed).length;
  const allDismissed = unreadCount === 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-foreground">Notifications</span>
        </div>
        {unreadCount > 0 && (
          <span className="bg-accent text-accent-foreground text-[10px] rounded-full px-1.5 py-0.5 font-medium tabular-nums">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Items */}
      {allDismissed ? (
        <p className="text-xs text-muted-foreground italic text-center py-4">You're all caught up.</p>
      ) : (
        <div className="space-y-1 max-h-[320px] overflow-y-auto scrollbar-thin">
          {sorted.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.dismissed) {
                  setExpandedIds((prev) => {
                    const next = new Set(prev);
                    next.has(n.id) ? next.delete(n.id) : next.add(n.id);
                    return next;
                  });
                }
              }}
              className={`group relative flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                n.dismissed
                  ? "border-l-2 border-transparent opacity-50"
                  : "border-l-2 border-accent bg-accent/5 hover:bg-accent/[0.08] cursor-pointer"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-foreground truncate">{n.title}</span>
                {n.dismissed ? (
                  <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5">Dismissed</span>
                ) : (
                  <button
                    onClick={() => setDismissedIds((prev) => new Set(prev).add(n.id))}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-0.5 rounded shrink-0 transition-opacity duration-150"
                  >
                    <X className="h-3 w-3" strokeWidth={2} />
                  </button>
                )}
              </div>
              <p className={`text-xs text-muted-foreground ${expandedIds.has(n.id) ? '' : 'line-clamp-2'}`}>{n.body}</p>
              <span className="text-[11px] text-muted-foreground/60 mt-0.5">{n.sentDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* View all → Communication announcements tab */}
      <div className="text-right mt-2">
        <Link
          to="/communication"
          className="text-xs text-accent hover:underline"
        >
          View all
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const Index = () => {
  const { userProfile, tasks, toggleTask, adminCourses, studioAnnouncements } = useWorkspace();

  const recentCourses = useMemo(() => {
    return adminCourses
      .filter((c) => c.status === "published")
      .map((c) => ({
        id: c.id,
        title: c.title,
        lastActive: lastActiveOptions[Math.floor(seedHash(c.id, 1) * lastActiveOptions.length)],
        progress: Math.floor(seedHash(c.id, 2) * 70 + 15),
        module: moduleLabels[Math.floor(seedHash(c.id, 3) * moduleLabels.length)],
      }));
  }, [adminCourses]);

  const activeCourse = recentCourses[0];
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  /* Empty state */
  if (recentCourses.length === 0) {
    return (
      <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl mx-auto flex flex-col items-center justify-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" strokeWidth={1} />
        <h2 className="font-serif text-xl text-foreground mb-2 font-medium">No courses yet</h2>
        <p className="text-muted-foreground font-sans text-sm mb-6 text-center max-w-md">
          Published courses will appear here. Browse the library to get started.
        </p>
        <Link
          to="/library"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-sans font-medium btn-apple"
        >
          <Library className="h-4 w-4" strokeWidth={1.5} />
          Open Library
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen px-8 py-8 max-w-6xl mx-auto">
      {/* Greeting — full width */}
      <div className="mb-6 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">
          {getGreeting()}, {userProfile.name}
        </h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Continue where you left off.</p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ─── Left Column ─── */}
        <div className="space-y-14">
          {/* Continue Learning */}
          <section className="animate-fade-in [animation-delay:100ms] [animation-fill-mode:backwards]">
            <Link
              to={`/workspace/${activeCourse.id}`}
              className="group block card-interactive p-6 lg:p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans uppercase tracking-widest">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {activeCourse.lastActive}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/80 group-hover:text-foreground icon-hover-rotate" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-2xl lg:text-[1.75rem] text-foreground mb-1.5 leading-snug font-medium">{activeCourse.title}</h2>
              <p className="text-muted-foreground font-sans text-sm mb-6 tracking-[-0.01em]">{activeCourse.module}</p>
              <div className="flex items-center gap-3 progress-glow">
                <div className="flex-1 h-[5px] bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent/80 rounded-full transition-all duration-1000 ease-spring"
                    style={{ width: `${activeCourse.progress}%` }}
                  />
                </div>
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{activeCourse.progress}%</span>
              </div>
            </Link>
          </section>

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <section className="animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">Upcoming tasks</h2>
                <Link to="/study-plan" className="text-[11px] font-sans text-accent hover:text-accent/80 transition-colors duration-250 ease-apple">
                  View all →
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {upcomingTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 setting-row"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="h-[18px] w-[18px] rounded-full border-[1.5px] border-border flex items-center justify-center shrink-0 checkbox-apple"
                    >
                      {task.completed && <Check className="h-2.5 w-2.5 text-accent animate-check-pop" strokeWidth={2.5} />}
                    </button>
                    <span className="flex-1 text-[13px] font-sans text-foreground truncate">{task.title}</span>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[task.priority]} transition-transform duration-300 ease-spring group-hover:scale-125`} />
                    <span className={`text-[11px] font-sans shrink-0 ${
                      task.priority === "high" ? "text-destructive/70" : task.priority === "medium" ? "text-accent/70" : "text-muted-foreground/80"
                    }`}>
                      {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] font-sans text-muted-foreground/70 shrink-0 flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" strokeWidth={1.5} />
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Courses */}
          {recentCourses.length > 1 && (
            <section className="animate-fade-in [animation-delay:300ms] [animation-fill-mode:backwards]">
              <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Recent courses</h2>
              <div className="space-y-2">
                {recentCourses.slice(1).map((course, i) => (
                  <Link
                    key={course.id}
                    to={`/workspace/${course.id}`}
                    className="group flex items-center justify-between card-interactive px-5 py-4"
                    style={{ animationDelay: `${300 + i * 80}ms` }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base text-foreground truncate leading-snug font-medium">{course.title}</h3>
                      <p className="text-[12px] text-muted-foreground font-sans mt-0.5 tracking-[-0.01em]">{course.module}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4 shrink-0">
                      <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{course.progress}%</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70 opacity-0 group-hover:opacity-100 icon-hover-rotate" strokeWidth={1.5} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-6 animate-fade-in [animation-delay:150ms] [animation-fill-mode:backwards]">
          {/* Notification Inbox */}
          <NotificationInbox announcements={studioAnnouncements} />

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            {[
              { to: "/library", icon: Library, label: "Open Library" },
              { to: "/notebook", icon: BookOpen, label: "Go to Notebook" },
              { to: "/study-plan", icon: ListChecks, label: "Study Plan" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2.5 w-full rounded-lg bg-muted/50 hover:bg-muted px-3 py-2.5 text-sm font-sans text-foreground transition-colors duration-200"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
