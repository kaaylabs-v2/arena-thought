import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BookOpen, Library, ArrowRight, BarChart3, Activity, Sparkles } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { fixedCourseData } from "@/lib/course-progress-data";
import { useScrollReveal, revealProps } from "@/hooks/use-scroll-reveal";
import {
  getTopInsights, getInsightIcon, getInsightTypeLabel,
  getSeverityColor, getSeverityBorderColor,
  type NexiInsight,
} from "@/lib/nexi-insights-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── Realistic mock data ─── */

const weeklyActivity = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1 },
  { day: "Sun", hours: 0.5 },
];

const weeklyTotalHours = weeklyActivity.reduce((s, d) => s + d.hours, 0);

/** Fixed per-course progress data keyed by course id index */
const fixedCourseData: {
  module: string;
  progress: number;
  status: "complete" | "in-progress" | "not-started";
}[] = [
  { module: "Module 4: Neural Networks", progress: 67, status: "in-progress" },
  { module: "Module 2: Regression Analysis", progress: 34, status: "in-progress" },
  { module: "Module 6: Consciousness", progress: 89, status: "in-progress" },
  { module: "Module 1: Vectors & Matrices", progress: 12, status: "in-progress" },
  { module: "Module 5: Memory & Learning", progress: 100, status: "complete" },
  { module: "Module 1: Research Design", progress: 5, status: "not-started" },
];

/** Seeded focus areas */
const seededFocusAreas = [
  { topic: "Backpropagation", course: "Foundations of Machine Learning", followUps: 5 },
  { topic: "Bayes' Theorem", course: "Advanced Statistical Methods", followUps: 3 },
  { topic: "Eigenvalue Decomposition", course: "Linear Algebra for Data Science", followUps: 2 },
  { topic: "Qualia & Consciousness", course: "Philosophy of Mind", followUps: 2 },
];

type InsightsTab = "overview" | "progress" | "patterns";

const tabConfig: { id: InsightsTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "patterns", label: "Patterns", icon: Activity },
];

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
      publishedCourses.map((c, i) => {
        const data = fixedCourseData[i % fixedCourseData.length];
        return {
          id: c.id,
          title: c.title,
          module: data.module,
          progress: data.progress,
          status: data.status,
        };
      }),
    [publishedCourses]
  );

  // "Continue Learning" nudge — pick first in-progress course
  const continueCourse = courseProgress.find((c) => c.status === "in-progress");

  const metrics = [
    { value: publishedCourses.length, label: "Active Courses" },
    { value: `${weeklyTotalHours}h`, label: "Study Hours" },
    { value: Math.max(notebookEntries.length, 8), label: "Notes Created" },
    { value: Math.max(reflections.length, 4), label: "Reflections Written" },
  ];

  return (
    <div className="space-y-8">
      {/* Metric tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="bg-card border border-border rounded-xl px-5 py-4 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            <div className="font-serif text-3xl text-foreground">{m.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-card border border-border rounded-xl p-5 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
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

      {/* Nexi Insights card */}
      <NexiInsightsCard publishedCourses={publishedCourses} delay={250} />

      {/* Continue Learning nudge */}
      {continueCourse && (
        <Link
          to={`/workspace/${continueCourse.id}`}
          className="block bg-card border border-border rounded-xl px-5 py-4 hover:bg-accent/[0.06] hover:border-accent/30 transition-all duration-200 animate-fade-in"
          style={{ animationDelay: "350ms", animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Pick up where you left off</p>
              <p className="text-base font-medium text-foreground">{continueCourse.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{continueCourse.module}</p>
            </div>
            <span className="text-sm text-accent hover:underline flex items-center gap-1 shrink-0">
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}

/* ─── Nexi Insights Card (shared) ─── */

function NexiInsightsCard({ publishedCourses, delay }: { publishedCourses: { id: string; title: string }[]; delay: number }) {
  const insights = useMemo(() => getTopInsights(3), []);

  const findCourseId = (courseName: string) => {
    const match = publishedCourses.find((c) => c.title === courseName);
    return match?.id || publishedCourses[0]?.id;
  };

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="px-5 py-3 border-b border-border flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
        <h3 className="text-[11px] font-sans text-muted-foreground uppercase tracking-widest">Nexi Insights</h3>
      </div>
      <div className="divide-y divide-border">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          const severityColor = getSeverityColor(insight.severity);
          const courseId = findCourseId(insight.course);

          return (
            <div key={insight.id} className="px-5 py-3.5 flex items-start gap-3">
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${severityColor}`} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{insight.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{insight.suggestion}</p>
                {courseId && (
                  <Link
                    to={`/workspace/${courseId}`}
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2"
                  >
                    Review in Nexi <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
              <span className={`text-[11px] font-medium shrink-0 tabular-nums ${severityColor}`}>
                {insight.metric}
              </span>
            </div>
          );
        })}
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
        .map((c, i) => {
          const data = fixedCourseData[i % fixedCourseData.length];
          return {
            id: c.id,
            title: c.title,
            module: data.module,
            progress: data.progress,
            status: data.status,
          };
        }),
    [adminCourses]
  );

  if (courseProgress.length === 0) {
    return (
      <div className="text-center py-24">
        <BarChart3 className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
        <p className="text-muted-foreground/70 font-sans text-sm mb-4">Start a course to see your progress here.</p>
        <Link to="/library" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:text-accent/80 transition-colors">
          <Library className="h-4 w-4" strokeWidth={1.5} />
          Browse Library
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
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
      className={`bg-card border border-border rounded-xl px-5 py-3 relative ${props.className}`}
      style={props.style}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">{course.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{course.module}</p>
        </div>
        <span className={`text-[11px] rounded-full px-2 py-0.5 font-medium shrink-0 ${statusStyles[course.status]}`}>
          {statusLabels[course.status]}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <AnimatedProgressBar targetPercent={course.progress} isVisible={reveal.isVisible} delay={200 + index * 70} />
        </div>
        <span className="text-xs text-muted-foreground w-8 text-right flex-shrink-0 tabular-nums">{course.progress}%</span>
      </div>
    </div>
  );
}

/* ─── Patterns Tab (merged with Focus Areas) ─── */

function PatternsTab() {
  const { chatMessages, adminCourses, notebookEntries, reflections, tasks } = useWorkspace();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const publishedCourses = adminCourses.filter((c) => c.status === "published");
  const totalQuestions = Math.max(
    Object.values(chatMessages).flat().filter((m) => m.role === "user").length,
    14
  );

  const courseMsgCounts = publishedCourses
    .map((c) => ({
      title: c.title,
      count: (chatMessages[c.id] || []).filter((m) => m.role === "user").length,
    }))
    .sort((a, b) => b.count - a.count);

  const mostActiveCourse = courseMsgCounts[0]?.title || "Foundations of Machine Learning";
  const topInsights = useMemo(() => getTopInsights(2), []);
  const completedTasks = Math.max(tasks.filter((t) => t.completed).length, 3);

  // Most used mood from reflections
  const moodCounts: Record<string, number> = {};
  reflections.forEach((r) => {
    if (r.mood) moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
  });
  const rawMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "focused";
  const mostUsedMood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);

  const maxFollowUps = Math.max(...seededFocusAreas.map((f) => f.followUps), 1);

  return (
    <div className="space-y-6">
      {/* Nexi Usage */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: "0ms", animationFillMode: "both" }}>
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-[11px] font-sans text-muted-foreground uppercase tracking-widest">Nexi Usage</h3>
        </div>
        <div className="divide-y divide-border">
          <PatternRow label="Most active course" value={mostActiveCourse} />
          <PatternRow label="Questions asked" value={String(totalQuestions)} />
        </div>
      </div>

      {/* Learning Signals from Nexi */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: "60ms", animationFillMode: "both" }}>
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
          <h3 className="text-[11px] font-sans text-muted-foreground uppercase tracking-widest">Learning Signals</h3>
        </div>
        <div className="divide-y divide-border">
          {topInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const severityColor = getSeverityColor(insight.severity);
            return (
              <div key={insight.id} className="px-5 py-3 flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${severityColor}`} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground">{insight.topic}</span>
                  <span className="text-xs text-muted-foreground ml-2">{getInsightTypeLabel(insight.type)}</span>
                </div>
                <span className={`text-[11px] shrink-0 tabular-nums ${severityColor}`}>{insight.metric}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Habits */}
      <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "both" }}>
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-[11px] font-sans text-muted-foreground uppercase tracking-widest">Study Habits</h3>
        </div>
        <div className="divide-y divide-border">
          <PatternRow label="Notes created" value={String(Math.max(notebookEntries.length, 8))} />
          <PatternRow label="Reflections written" value={String(Math.max(reflections.length, 4))} />
          <PatternRow label="Tasks completed" value={String(completedTasks)} />
          <PatternRow label="Most used mood" value={mostUsedMood} />
        </div>
      </div>

      {/* Topics to Revisit with severity borders */}
      <div className="animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-serif text-2xl text-foreground">Topics to revisit</h2>
          <BookOpen className="h-5 w-5 text-accent" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-muted-foreground mt-1 mb-4 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent flex-shrink-0" strokeWidth={1.5} />
          Nexi noticed these topics worth revisiting
        </p>

        <div className="space-y-3">
          {seededFocusAreas.map((area, i) => {
            // Match severity from insights if available
            const matchingInsight = topInsights.find((ins) => ins.topic === area.topic);
            const borderClass = matchingInsight
              ? getSeverityBorderColor(matchingInsight.severity)
              : "border-l-border";

            return (
              <div
                key={area.topic}
                className={`bg-card border border-border border-l-2 ${borderClass} rounded-xl px-5 py-4 animate-fade-in`}
                style={{ animationDelay: `${240 + i * 50}ms`, animationFillMode: "both" }}
              >
                <div>
                  <span className="text-sm font-medium text-foreground">{area.topic}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 inline-block">
                    {area.course}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {area.followUps} follow-up question{area.followUps !== 1 ? "s" : ""}
                </p>
                <div className="h-1 rounded-full bg-muted mt-3 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700 ease-smooth"
                    style={{ width: mounted ? `${(area.followUps / maxFollowUps) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {seededFocusAreas.length < 4 && (
          <p className="mt-6 text-xs text-muted-foreground italic">
            Nexi surfaces more patterns the more you study.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Primitives ─── */

function PatternRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-sm text-foreground">{label}</span>
      <span className="text-sm text-muted-foreground">{value}</span>
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
                  <tab.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="transition-opacity duration-150">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "progress" && <ProgressTab />}
            {activeTab === "patterns" && <PatternsTab />}
          </div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

export default Insights;
