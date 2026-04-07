import { ArrowRight, BookOpen, Library, Clock, ListChecks, Check, Calendar, Bell, X, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
import { format, isToday, isYesterday, formatDistanceToNow, isBefore, startOfDay } from "date-fns";

/* ─── Shared seeded data (must match Insights.tsx) ─── */

const fixedCourseData = [
  { module: "Module 4: Neural Networks", progress: 67, status: "in-progress" as const },
  { module: "Module 2: Regression Analysis", progress: 34, status: "in-progress" as const },
  { module: "Module 6: Consciousness", progress: 89, status: "in-progress" as const },
  { module: "Module 1: Vectors & Matrices", progress: 12, status: "in-progress" as const },
  { module: "Module 5: Memory & Learning", progress: 100, status: "complete" as const },
  { module: "Module 1: Research Design", progress: 5, status: "not-started" as const },
];

const seededFocusAreas = [
  { topic: "Backpropagation", course: "Foundations of Machine Learning", followUps: 5 },
  { topic: "Bayes' Theorem", course: "Advanced Statistical Methods", followUps: 3 },
  { topic: "Eigenvalue Decomposition", course: "Linear Algebra for Data Science", followUps: 2 },
  { topic: "Qualia & Consciousness", course: "Philosophy of Mind", followUps: 2 },
];

/** Seeded last-studied offsets per course index (hours ago) */
const lastStudiedOffsets = [2, 72, 18, 120, 168, 336];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatLastStudied(hoursAgo: number): string {
  if (hoursAgo < 1) return "Just now";
  if (hoursAgo < 24) return `${hoursAgo} hours ago`;
  const days = Math.floor(hoursAgo / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return `Last studied ${format(d, "MMM d")}`;
}

function formatNotificationDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

const priorityDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-accent",
  low: "bg-muted-foreground/40",
};

/* ─── Animated Progress Bar (matches Insights) ─── */
function MountAnimatedBar({ targetPercent }: { targetPercent: number }) {
  const [width, setWidth] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    if (!triggered.current) {
      triggered.current = true;
      const timer = setTimeout(() => setWidth(targetPercent), 50);
      return () => clearTimeout(timer);
    }
  }, [targetPercent]);

  return (
    <div
      className="h-full bg-accent/70 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${width}%` }}
    />
  );
}

/* ─── Notification Inbox ─── */
function NotificationInbox({
  announcements,
}: {
  announcements: { id: string; title: string; body: string; sentDate: string; audience: string }[];
}) {
  const { dismissedAnnouncementIds, dismissAnnouncement } = useWorkspace();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const items = announcements.map((a) => ({
      ...a,
      dismissed: dismissedAnnouncementIds.has(a.id),
    }));
    items.sort((a, b) => {
      if (a.dismissed !== b.dismissed) return a.dismissed ? 1 : -1;
      return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
    });
    return items;
  }, [announcements, dismissedAnnouncementIds]);

  const unreadCount = sorted.filter((n) => !n.dismissed).length;
  const allDismissed = unreadCount === 0;

  const handleDismiss = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dismissAnnouncement(id);
    toast("Notification dismissed", { duration: 2000 });
  }, [dismissAnnouncement]);

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
              className={`group relative flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                n.dismissed
                  ? "border-l-2 border-transparent opacity-60"
                  : "border-l-2 border-accent bg-accent/5 hover:bg-accent/[0.08] cursor-pointer"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-foreground truncate">{n.title}</span>
                {n.dismissed ? (
                  <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5">Dismissed</span>
                ) : (
                  <button
                    onClick={(e) => handleDismiss(e, n.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-0.5 rounded shrink-0 transition-opacity duration-150"
                  >
                    <X className="h-3 w-3" strokeWidth={2} />
                  </button>
                )}
              </div>
              {/* Animated expand/collapse using grid-rows */}
              <div
                className={`grid transition-all duration-200 ease-out ${
                  expandedIds.has(n.id) ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                </div>
              </div>
              {!expandedIds.has(n.id) && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.body}</p>
              )}
              <span className="text-[11px] text-muted-foreground/60 mt-0.5">{formatNotificationDate(n.sentDate)}</span>
            </div>
          ))}
        </div>
      )}

      {/* View all → Communication announcements tab */}
      <div className="text-right mt-2">
        <Link
          to="/communication"
          className="text-[11px] font-sans text-accent hover:text-accent/80 transition-colors duration-200"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
const Index = () => {
  const { userProfile, tasks, toggleTask, adminCourses, studioAnnouncements } = useWorkspace();
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set());

  /* Build course data from published courses, synced with Insights seeded data */
  const recentCourses = useMemo(() => {
    return adminCourses
      .filter((c) => c.status === "published")
      .map((c, i) => {
        const data = fixedCourseData[i % fixedCourseData.length];
        const hoursAgo = lastStudiedOffsets[i % lastStudiedOffsets.length];
        return {
          id: c.id,
          title: c.title,
          module: data.module,
          progress: data.progress,
          status: data.status,
          lastActive: formatLastStudied(hoursAgo),
          lastStudiedLabel: hoursAgo < 24 ? `${hoursAgo} hours ago` : formatLastStudied(hoursAgo),
        };
      });
  }, [adminCourses]);

  const activeCourse = recentCourses[0]; // First published = continue learning

  /* ─── Fix 1: Context-aware greeting subtitle ─── */
  const greetingSubtitle = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);

    const hasOverdue = tasks.some(
      (t) => !t.completed && t.dueDate && isBefore(new Date(t.dueDate), todayStart)
    );
    if (hasOverdue) {
      return { text: "You have overdue tasks to catch up on.", className: "text-sm text-destructive" };
    }

    const allDone = tasks.length === 0 || tasks.every((t) => t.completed);
    if (allDone) {
      return { text: "You're all caught up. Keep it going.", className: "text-sm text-muted-foreground" };
    }

    const hasCompletedToday = tasks.some(
      (t) => t.completed && t.dueDate && !isBefore(new Date(t.dueDate), todayStart)
    );
    if (!hasCompletedToday) {
      return { text: "Ready to study? Here's where you left off.", className: "text-sm text-muted-foreground" };
    }

    return { text: "Continue where you left off.", className: "text-sm text-muted-foreground" };
  }, [tasks]);

  /* ─── Fix 2: Nexi suggestion from focus areas ─── */
  const topFocus = seededFocusAreas.length > 0 ? seededFocusAreas[0] : null;
  const focusCourseId = useMemo(() => {
    if (!topFocus) return null;
    const match = recentCourses.find((c) => c.title === topFocus.course);
    return match?.id || recentCourses[0]?.id || null;
  }, [topFocus, recentCourses]);

  // Show recently-completed tasks with fade-out, then remove after delay
  const handleToggleTask = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      setRecentlyCompleted((prev) => new Set(prev).add(id));
      setTimeout(() => {
        toggleTask(id);
        setRecentlyCompleted((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 500);
    } else {
      toggleTask(id);
    }
  }, [tasks, toggleTask]);

  const incompleteTasks = tasks.filter((t) => !t.completed || recentlyCompleted.has(t.id));
  const upcomingTasks = incompleteTasks.slice(0, 4);
  const todayStart = startOfDay(new Date());

  /* Empty state */
  if (recentCourses.length === 0) {
    return (
      <div className="h-full flex-1 p-8 lg:p-12 xl:p-16 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
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
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">
          {getGreeting()}, {userProfile.name}
        </h1>
        <p className={`font-sans tracking-[-0.01em] ${greetingSubtitle.className}`}>
          {greetingSubtitle.text}
        </p>

        {/* Fix 2 — Nexi suggestion line */}
        {topFocus && focusCourseId && (
          <div className="flex items-center gap-2 mt-3 mb-1 animate-fade-in [animation-delay:120ms] [animation-fill-mode:backwards]">
            <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              Nexi suggests reviewing <span className="text-foreground font-medium">{topFocus.topic}</span> today based on your recent sessions.{" "}
              <Link
                to={`/workspace/${focusCourseId}`}
                className="text-sm text-accent hover:underline"
              >
                Review →
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ─── Left Column ─── */}
        <div className="space-y-14">
          {/* Continue Learning */}
          <section className="animate-fade-in [animation-delay:100ms] [animation-fill-mode:backwards]">
            <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70 mb-4">Continue learning</h2>
            <Link
              to={`/workspace/${activeCourse.id}`}
              className="group block card-interactive p-6 lg:p-8"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans uppercase tracking-widest">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {activeCourse.lastActive}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors duration-150 icon-hover-rotate" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl lg:text-[1.75rem] text-foreground mb-1.5 leading-snug font-medium">{activeCourse.title}</h3>
              <p className="text-muted-foreground font-sans text-sm mb-6 tracking-[-0.01em]">{activeCourse.module}</p>
              <div className="flex items-center gap-3 progress-glow">
                <div className="flex-1 h-[5px] bg-secondary rounded-full overflow-hidden">
                  <MountAnimatedBar targetPercent={activeCourse.progress} />
                </div>
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{activeCourse.progress}%</span>
              </div>
            </Link>
          </section>

          {/* Upcoming Tasks */}
          <section className="animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70">Upcoming tasks</h2>
              {incompleteTasks.length > 4 && (
                <Link to="/study-plan" className="text-[11px] font-sans text-accent hover:text-accent/80 transition-colors duration-200">
                  View all →
                </Link>
              )}
            </div>
            {upcomingTasks.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground italic">No upcoming tasks — add one in Study Plan.</p>
                <Link to="/study-plan" className="text-sm text-accent hover:underline mt-1 inline-block">
                  Go to Study Plan →
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {upcomingTasks.map((task, i) => {
                  const isCompleting = recentlyCompleted.has(task.id);
                  const isOverdue = !task.completed && task.dueDate && isBefore(new Date(task.dueDate), todayStart);
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-center gap-3 px-4 py-3 setting-row transition-all duration-300 ${
                        isCompleting ? "opacity-40 line-through scale-[0.98]" : ""
                      }`}
                      style={{ animationDelay: `${200 + i * 60}ms` }}
                    >
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="h-[18px] w-[18px] rounded-full border-2 border-muted-foreground/40 hover:border-accent flex items-center justify-center shrink-0 transition-colors duration-150 checkbox-apple"
                      >
                        {(task.completed || isCompleting) && <Check className="h-2.5 w-2.5 text-accent animate-check-pop" strokeWidth={2.5} />}
                      </button>
                      <span className={`flex-1 text-[13px] font-sans text-foreground truncate transition-all duration-300 ${isCompleting ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[task.priority]} transition-transform duration-300 ease-spring group-hover:scale-125`} />
                      <span className={`text-[11px] font-sans shrink-0 ${
                        task.priority === "high" ? "text-destructive/70" : task.priority === "medium" ? "text-accent/70" : "text-muted-foreground/80"
                      }`}>
                        {task.priority === "high" ? "High" : task.priority === "medium" ? "Medium" : "Low"}
                      </span>
                      {task.dueDate && (
                        <span className={`text-[10px] font-sans shrink-0 flex items-center gap-1 ${isOverdue ? "text-destructive" : "text-muted-foreground/70"}`}>
                          {isOverdue && <AlertCircle className="h-3 w-3 text-destructive" strokeWidth={1.5} />}
                          <Calendar className="h-2.5 w-2.5" strokeWidth={1.5} />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Courses — capped at 3 */}
          {recentCourses.length > 1 && (
            <section className="animate-fade-in [animation-delay:300ms] [animation-fill-mode:backwards]">
              <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70 mb-4">Recent courses</h2>
              <div className="space-y-2">
                {recentCourses.slice(1, 4).map((course, i) => (
                  <Link
                    key={course.id}
                    to={`/workspace/${course.id}`}
                    className="group block card-interactive px-5 py-4 border border-border"
                    style={{ animationDelay: `${300 + i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base text-foreground truncate leading-snug font-medium">{course.title}</h3>
                        <p className="text-[12px] text-muted-foreground font-sans mt-0.5 tracking-[-0.01em]">{course.module}</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{course.lastStudiedLabel}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70 opacity-0 group-hover:opacity-100 icon-hover-rotate ml-4 shrink-0 mt-1" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <MountAnimatedBar targetPercent={course.progress} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right flex-shrink-0 tabular-nums">{course.progress}%</span>
                    </div>
                  </Link>
                ))}
              </div>
              {recentCourses.length > 4 && (
                <div className="text-right mt-2">
                  <Link to="/library" className="text-sm text-accent hover:underline">
                    View all in Library →
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>

        {/* ─── Right Column ─── */}
        <div className="space-y-6 animate-fade-in [animation-delay:150ms] [animation-fill-mode:backwards] order-first min-[900px]:order-none">
          {/* Notification Inbox */}
          <NotificationInbox announcements={studioAnnouncements} />

          {/* Quick Actions — reordered by priority */}
          <div>
            <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground/70 mb-3">Quick actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { to: "/study-plan", icon: ListChecks, label: "Study Plan" },
                { to: "/library", icon: Library, label: "Open Library" },
                { to: "/notebook", icon: BookOpen, label: "Go to Notebook" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 w-full rounded-lg bg-transparent hover:bg-muted/50 px-3 py-2.5 text-sm font-sans text-foreground transition-colors duration-150"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
