import { ArrowRight, BookOpen, Clock, Library, TrendingUp, Target, AlertCircle, Flame, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { useScrollReveal, revealProps } from "@/hooks/use-scroll-reveal";
import { useWorkspace } from "@/context/WorkspaceContext";

// Simple deterministic hash
function seedHash(str: string, salt: number = 0): number {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return (((h >>> 0) % 1000) / 1000);
}

const lastStudiedOptions = ["2 hours ago", "Yesterday", "3 days ago", "5 days ago", "1 week ago"];
const nextTopics = [
  "Backpropagation practice", "Prior selection strategies", "Qualia and zombie arguments",
  "Eigenvalue decomposition", "Working memory models", "Experimental design critique",
  "Gradient checking", "Data normalization",
];

// Simulated weekly activity (last 7 days, hours studied)
const weeklyActivity = [
  { day: "Mon", hours: 2.5, active: true },
  { day: "Tue", hours: 3.2, active: true },
  { day: "Wed", hours: 0, active: false },
  { day: "Thu", hours: 1.8, active: true },
  { day: "Fri", hours: 4.1, active: true },
  { day: "Sat", hours: 0.5, active: true },
  { day: "Sun", hours: 0, active: false },
];

const streakDays = 5;
const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

const Progress = () => {
  const { adminCourses } = useWorkspace();

  const courseProgress = useMemo(() => {
    return adminCourses
      .filter((c) => c.status === "published")
      .map((c) => {
        const progress = Math.floor(seedHash(c.id, 2) * 70 + 15);
        const timeMinutes = Math.floor(seedHash(c.id, 10) * 1400 + 200);
        const totalModules = Math.floor(seedHash(c.id, 11) * 12 + 4);
        const completedModules = Math.floor(totalModules * (progress / 100));
        const needsAttention = seedHash(c.id, 12) > 0.6;
        return {
          id: c.id,
          title: c.title,
          progress,
          lastStudied: lastStudiedOptions[Math.floor(seedHash(c.id, 1) * lastStudiedOptions.length)],
          timeSpent: `${Math.floor(timeMinutes / 60)}h ${timeMinutes % 60}m`,
          timeMinutes,
          modules: totalModules,
          completed: completedModules,
          nextTopic: nextTopics[Math.floor(seedHash(c.id, 13) * nextTopics.length)],
          needsAttention,
        };
      });
  }, [adminCourses]);

  const activeCourses = courseProgress.filter((c) => c.progress < 100).length;
  const totalMinutes = courseProgress.reduce((s, c) => s + c.timeMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;
  const totalTime = `${totalHours}h ${totalMins}m`;
  const needsAttention = courseProgress.filter((c) => c.needsAttention);

  const headerReveal = useScrollReveal();
  const summaryReveal = useScrollReveal();
  const activityReveal = useScrollReveal();

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-4xl mx-auto">
      {/* Header */}
      <div ref={headerReveal.ref} className={headerReveal.isVisible ? "mb-8 animate-fade-in" : "mb-8 opacity-0"}>
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Progress</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your learning journey at a glance.</p>
      </div>

      {/* Hero Summary */}
      <div
        ref={summaryReveal.ref}
        className={`rounded-xl border border-border bg-card p-6 lg:p-8 mb-6 ${summaryReveal.isVisible ? "animate-fade-in [animation-delay:60ms] [animation-fill-mode:backwards]" : "opacity-0"}`}
      >
        <div className="flex items-start gap-8 flex-wrap">
          {/* Streak */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
              <span className="text-[10px] font-sans text-muted-foreground/80 uppercase tracking-widest">Streak</span>
            </div>
            <span className="text-3xl font-serif text-foreground font-medium tabular-nums">{streakDays}</span>
            <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5">days in a row</p>
          </div>
          <div className="w-px h-14 bg-border self-center hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
              <span className="text-[10px] font-sans text-muted-foreground/80 uppercase tracking-widest">Active</span>
            </div>
            <span className="text-3xl font-serif text-foreground font-medium">{activeCourses}</span>
            <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5">courses</p>
          </div>
          <div className="w-px h-14 bg-border self-center hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80" strokeWidth={1.5} />
              <span className="text-[10px] font-sans text-muted-foreground/80 uppercase tracking-widest">Total time</span>
            </div>
            <span className="text-3xl font-serif text-foreground font-medium tabular-nums">{totalTime}</span>
            <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5">studied</p>
          </div>
          {needsAttention.length > 0 && (
            <>
              <div className="w-px h-14 bg-border self-center hidden sm:block" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
                  <span className="text-[10px] font-sans text-muted-foreground/80 uppercase tracking-widest">Needs attention</span>
                </div>
                <span className="text-3xl font-serif text-foreground font-medium">{needsAttention.length}</span>
                <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5">courses behind</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weekly Activity */}
      <div
        ref={activityReveal.ref}
        className={`rounded-xl border border-border bg-card p-5 lg:p-6 mb-8 ${activityReveal.isVisible ? "animate-fade-in [animation-delay:120ms] [animation-fill-mode:backwards]" : "opacity-0"}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" strokeWidth={1.5} />
          <span className="text-[10px] font-sans text-muted-foreground/80 uppercase tracking-widest">This week</span>
        </div>
        <div className="flex items-end gap-2 h-20">
          {weeklyActivity.map((day, i) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end justify-center" style={{ height: 52 }}>
                <div
                  className="w-full max-w-[28px] rounded-md transition-all duration-700 ease-smooth"
                  style={{
                    height: activityReveal.isVisible
                      ? `${Math.max(day.hours > 0 ? 8 : 2, (day.hours / maxHours) * 52)}px`
                      : "2px",
                    backgroundColor: day.hours > 0 ? "hsl(var(--accent) / 0.65)" : "hsl(var(--accent) / 0.15)",
                    borderRadius: day.hours === 0 ? "1px" : undefined,
                    transitionDelay: activityReveal.isVisible ? `${200 + i * 80}ms` : "0ms",
                  }}
                />
              </div>
              <span className="text-[9px] font-sans text-muted-foreground/70 tabular-nums">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
          <span className="text-[10px] font-sans text-muted-foreground/70">
            {weeklyActivity.filter((d) => d.active).length} of 7 days active
          </span>
          <span className="text-[10px] font-sans text-muted-foreground/70 tabular-nums">
            {weeklyActivity.reduce((s, d) => s + d.hours, 0).toFixed(1)}h this week
          </span>
        </div>
      </div>

      {/* Course Progress Cards */}
      {courseProgress.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          {courseProgress.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

function EmptyState() {
  const reveal = useScrollReveal();
  return (
    <div
      ref={reveal.ref}
      className={`text-center py-24 ${reveal.isVisible ? "animate-fade-in" : "opacity-0"}`}
    >
      <BookOpen className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
      <p className="text-muted-foreground/70 font-sans text-sm mb-4">No courses started yet.</p>
      <Link to="/library" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:text-accent/80 transition-colors">
        <Library className="h-4 w-4" strokeWidth={1.5} />
        Browse Library
      </Link>
    </div>
  );
}

function CourseCard({ course, index }: { course: { id: string; title: string; progress: number; lastStudied: string; timeSpent: string; modules: number; completed: number; nextTopic: string; needsAttention: boolean }; index: number }) {
  const reveal = useScrollReveal<HTMLAnchorElement>();
  const props = revealProps(reveal.isVisible, 60 + index * 70);

  return (
    <Link
      ref={reveal.ref}
      to={`/workspace/${course.id}`}
      className={`group flex items-center gap-5 rounded-xl border border-border bg-card p-5 hover:border-accent/20 hover:shadow-lifted transition-all duration-250 ease-out active:scale-[0.998] ${props.className}`}
      style={props.style}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-serif text-base text-foreground leading-snug font-medium">{course.title}</h3>
          {course.needsAttention && (
            <AlertCircle className="h-3.5 w-3.5 text-accent/70 shrink-0" strokeWidth={1.5} />
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground/80">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {course.lastStudied}
          </span>
          <span className="text-border">·</span>
          <span>{course.timeSpent} studied</span>
          <span className="text-border">·</span>
          <span>{course.completed}/{course.modules} modules</span>
        </div>
        <p className="text-[11px] font-sans text-accent/80 mt-2 flex items-center gap-1">
          <Target className="h-3 w-3" strokeWidth={1.5} />
          Next: {course.nextTopic}
        </p>
        <div className="flex items-center gap-3 mt-2.5">
          <div className="flex-1 h-[4px] bg-secondary rounded-full overflow-hidden">
            <AnimatedProgressBar
              targetPercent={course.progress}
              isVisible={reveal.isVisible}
              delay={200 + index * 70}
            />
          </div>
          <span className="text-[11px] font-sans text-muted-foreground/80 w-8 text-right tabular-nums">{course.progress}%</span>
        </div>
      </div>
      <div className="shrink-0">
        <span className="flex items-center gap-1 text-[12px] font-sans text-muted-foreground/70 group-hover:text-accent transition-colors duration-200">
          Continue
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}

function AnimatedProgressBar({ targetPercent, isVisible, delay }: { targetPercent: number; isVisible: boolean; delay: number }) {
  const [width, setWidth] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    if (isVisible && !triggered.current) {
      triggered.current = true;
      const timer = setTimeout(() => setWidth(targetPercent), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, targetPercent, delay]);

  return (
    <div
      className="h-full bg-accent/70 rounded-full transition-all duration-700 ease-smooth"
      style={{ width: `${width}%` }}
    />
  );
}

export default Progress;
