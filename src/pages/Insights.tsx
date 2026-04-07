import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Library, ArrowRight } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useScrollReveal, revealProps } from "@/hooks/use-scroll-reveal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── Helpers ─── */

function seedHash(str: string, salt: number = 0): number {
  let h = salt;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return ((h >>> 0) % 1000) / 1000;
}

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 1.8 },
  { day: "Fri", hours: 4.1 },
  { day: "Sat", hours: 0.5 },
  { day: "Sun", hours: 0 },
];

const moduleLabels = [
  "Neural Networks", "Bayesian Inference", "Consciousness", "Matrix Fundamentals",
  "Attention & Memory", "Research Design", "Optimization", "Data Modeling",
];

type InsightsTab = "overview" | "focus" | "progress" | "patterns";

const tabConfig: { id: InsightsTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "focus", label: "Focus Areas" },
  { id: "progress", label: "Progress" },
  { id: "patterns", label: "Patterns" },
];

/* ─── Topic detection (shared by Focus Areas & Patterns) ─── */

const topicPatterns: { pattern: RegExp; topic: string; course: string }[] = [
  { pattern: /backpropagation|backward pass|chain rule/i, topic: "Backpropagation", course: "Foundations of Machine Learning" },
  { pattern: /gradient descent|learning rate|sgd/i, topic: "Gradient Descent", course: "Foundations of Machine Learning" },
  { pattern: /bayes|posterior|prior|likelihood/i, topic: "Bayes' Theorem", course: "Bayesian Statistics" },
  { pattern: /activation function|relu|sigmoid/i, topic: "Activation Functions", course: "Foundations of Machine Learning" },
  { pattern: /regularization|overfitting|l1|l2/i, topic: "Regularization", course: "Foundations of Machine Learning" },
  { pattern: /loss function|cost function/i, topic: "Loss Functions", course: "Foundations of Machine Learning" },
];

function useFocusAreas(chatMessages: Record<string, { role: string; content: string }[]>) {
  return useMemo(() => {
    const allMsgs = Object.values(chatMessages).flat();
    return topicPatterns
      .map((tp) => {
        const userHits = allMsgs.filter((m) => m.role === "user" && tp.pattern.test(m.content)).length;
        const nexiHits = allMsgs.filter((m) => m.role === "nexi" && tp.pattern.test(m.content)).length;
        const followUps = userHits + Math.min(nexiHits, 2);
        return { topic: tp.topic, course: tp.course, followUps };
      })
      .filter((t) => t.followUps > 0)
      .sort((a, b) => b.followUps - a.followUps)
      .slice(0, 4);
  }, [chatMessages]);
}

/* ─── Custom Recharts Tooltip ─── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg shadow-md px-3 py-2">
      <p className="text-sm text-foreground font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}h studied</p>
    </div>
  );
}

/* ─── Overview Tab ─── */

function OverviewTab() {
  const { adminCourses, notebookEntries, reflections } = useWorkspace();

  const publishedCourses = useMemo(
    () => adminCourses.filter((c) => c.status === "published"),
    [adminCourses]
  );

  const courseProgress = useMemo(
    () =>
      publishedCourses.map((c) => ({
        id: c.id,
        title: c.title,
        module: moduleLabels[Math.floor(seedHash(c.id, 3) * moduleLabels.length)],
        progress: Math.floor(seedHash(c.id, 2) * 70 + 15),
        timeMinutes: Math.floor(seedHash(c.id, 10) * 1400 + 200),
      })),
    [publishedCourses]
  );

  const totalHours = Math.floor(courseProgress.reduce((s, c) => s + c.timeMinutes, 0) / 60);

  const metrics = [
    { value: publishedCourses.length, label: "Active Courses" },
    { value: `${totalHours}h`, label: "Study Hours" },
    { value: notebookEntries.length, label: "Notes Created" },
    { value: reflections.length, label: "Reflections Written" },
  ];

  return (
    <div className="space-y-8">
      {/* Metric tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-xl px-5 py-4">
            <div className="font-serif text-3xl text-foreground">{m.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">This week</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyActivity} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--accent) / 0.08)" }} />
            <Bar dataKey="hours" fill="hsl(var(--accent))" opacity={0.85} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Course Progress List */}
      <div className="bg-card border border-border rounded-xl px-5 py-2">
        {courseProgress.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <div className="text-sm font-medium text-foreground">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.module}</div>
            </div>
            <div className="flex flex-col items-end gap-1 min-w-[120px]">
              <span className="text-sm text-muted-foreground tabular-nums">{c.progress}%</span>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent/70 rounded-full" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Focus Areas Tab ─── */

function FocusAreasTab() {
  const { chatMessages } = useWorkspace();
  const focusAreas = useFocusAreas(chatMessages);
  const maxFollowUps = Math.max(...focusAreas.map((f) => f.followUps), 1);

  if (focusAreas.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground italic">
          Keep studying — Nexi will highlight patterns as you go.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-serif text-2xl text-foreground">Nexi noticed</h2>
        <Sparkles className="h-5 w-5 text-accent" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Topics worth revisiting based on your recent sessions
      </p>

      <div className="space-y-3">
        {focusAreas.map((area) => (
          <Link
            key={area.topic}
            to="/library"
            className="block bg-card border border-border rounded-xl px-5 py-4 hover:bg-accent/[0.08] hover:border-accent/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{area.topic}</span>
              <span className="text-[11px] text-muted-foreground/70 bg-muted rounded-full px-2 py-0.5">
                {area.course}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {area.followUps} follow-up question{area.followUps !== 1 ? "s" : ""}
            </p>
            <div className="h-1 rounded-full bg-muted mt-3 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(area.followUps / maxFollowUps) * 100}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Progress Tab ─── */

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
      className="h-full bg-accent/80 rounded-full transition-all duration-700 ease-smooth"
      style={{ width: `${width}%` }}
    />
  );
}

function ProgressTab() {
  const { adminCourses } = useWorkspace();

  const courseProgress = useMemo(
    () =>
      adminCourses
        .filter((c) => c.status === "published")
        .map((c) => {
          const progress = Math.floor(seedHash(c.id, 2) * 70 + 15);
          return {
            id: c.id,
            title: c.title,
            module: moduleLabels[Math.floor(seedHash(c.id, 3) * moduleLabels.length)],
            progress,
            status: progress >= 95 ? "complete" : progress > 0 ? "in-progress" : "not-started",
          };
        }),
    [adminCourses]
  );

  if (courseProgress.length === 0) {
    return (
      <div className="text-center py-24">
        <BookOpen className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
        <p className="text-muted-foreground/70 font-sans text-sm mb-4">No courses started yet.</p>
        <Link to="/library" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:text-accent/80 transition-colors">
          <Library className="h-4 w-4" strokeWidth={1.5} />
          Browse Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {courseProgress.map((course, i) => (
        <ProgressCourseCard key={course.id} course={course} index={i} />
      ))}
    </div>
  );
}

function ProgressCourseCard({
  course,
  index,
}: {
  course: { id: string; title: string; module: string; progress: number; status: string };
  index: number;
}) {
  const reveal = useScrollReveal();
  const props = revealProps(reveal.isVisible, 60 + index * 70);

  const statusStyles: Record<string, string> = {
    complete: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "in-progress": "bg-accent/15 text-accent",
    "not-started": "bg-muted text-muted-foreground",
  };
  const statusLabels: Record<string, string> = {
    complete: "Complete",
    "in-progress": "In Progress",
    "not-started": "Not Started",
  };

  return (
    <div
      ref={reveal.ref}
      className={`bg-card border border-border rounded-xl px-5 py-4 relative ${props.className}`}
      style={props.style}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-medium text-foreground">{course.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{course.module}</p>
        </div>
        <span className={`text-[11px] rounded-full px-2 py-0.5 font-medium ${statusStyles[course.status]}`}>
          {statusLabels[course.status]}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted mt-3 mb-1 overflow-hidden">
        <AnimatedProgressBar targetPercent={course.progress} isVisible={reveal.isVisible} delay={200 + index * 70} />
      </div>
      <p className="text-xs text-muted-foreground text-right tabular-nums">{course.progress}%</p>
    </div>
  );
}

/* ─── Patterns Tab ─── */

function PatternsTab() {
  const { chatMessages, adminCourses, notebookEntries, reflections, tasks } = useWorkspace();
  const focusAreas = useFocusAreas(chatMessages);

  const publishedCourses = adminCourses.filter((c) => c.status === "published");
  const totalQuestions = Object.values(chatMessages).flat().filter((m) => m.role === "user").length;

  const courseMsgCounts = publishedCourses
    .map((c) => ({
      title: c.title,
      count: (chatMessages[c.id] || []).filter((m) => m.role === "user").length,
    }))
    .sort((a, b) => b.count - a.count);

  const mostActiveCourse = courseMsgCounts[0]?.title || "—";
  const topFocus = focusAreas[0];
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Most used mood from reflections
  const moodCounts: Record<string, number> = {};
  reflections.forEach((r) => {
    if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
  });
  const mostUsedMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="space-y-8">
      {/* Nexi Usage */}
      <div>
        <SectionLabel>Nexi Usage</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Most active course" value={mostActiveCourse} />
          <SettingRow label="Questions asked" value={String(totalQuestions)} />
          {topFocus && (
            <SettingRow
              label="Top focus area"
              value={`${topFocus.topic} · ${topFocus.followUps} follow-up${topFocus.followUps !== 1 ? "s" : ""}`}
            />
          )}
        </div>
      </div>

      {/* Study Habits */}
      <div>
        <SectionLabel>Study Habits</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Notes created" value={String(notebookEntries.length)} />
          <SettingRow label="Reflections written" value={String(reflections.length)} />
          <SettingRow label="Tasks completed" value={String(completedTasks)} />
          <SettingRow label="Most used mood" value={mostUsedMood} />
        </div>
      </div>
    </div>
  );
}

/* ─── Primitives ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-sans text-muted-foreground uppercase tracking-widest mb-2">
      {children}
    </h3>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] font-sans text-foreground">{label}</span>
      <span className="text-[13px] font-sans text-muted-foreground">{value}</span>
    </div>
  );
}

/* ─── Main Page ─── */

const Insights = () => {
  const [activeTab, setActiveTab] = useState<InsightsTab>("overview");

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Insights</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
          Your learning patterns, surfaced by Nexi
        </p>
      </div>

      {/* Left nav + right content */}
      <div className="flex gap-8 lg:gap-12 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <nav className="w-44 shrink-0 sticky top-8 self-start">
          <ul className="space-y-0.5">
            {tabConfig.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans transition-all duration-200 active:scale-[0.97] ${
                    activeTab === tab.id
                      ? "bg-primary/8 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "focus" && <FocusAreasTab />}
          {activeTab === "progress" && <ProgressTab />}
          {activeTab === "patterns" && <PatternsTab />}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default Insights;
