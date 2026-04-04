import { useState, useMemo } from "react";
import { BarChart3, Users, TrendingUp, Clock, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AMBER = "#C9963A";
const AMBER_LIGHT = "hsl(var(--accent) / 0.15)";

type TimeRange = "7d" | "30d" | "90d" | "all";
type DeptFilter = "all" | string;

// Richer mock data keyed by time range
// weeklyDataByRange is built inside the component to access workspace state

const completionDataByRange: Record<TimeRange, { month: string; completions: number }[]> = {
  "7d": [{ month: "This Week", completions: 3 }],
  "30d": [
    { month: "Week 1", completions: 2 }, { month: "Week 2", completions: 4 },
    { month: "Week 3", completions: 1 }, { month: "Week 4", completions: 3 },
  ],
  "90d": [
    { month: "Jan", completions: 7 }, { month: "Feb", completions: 4 }, { month: "Mar", completions: 8 },
  ],
  "all": [
    { month: "Oct", completions: 2 }, { month: "Nov", completions: 5 },
    { month: "Dec", completions: 3 }, { month: "Jan", completions: 7 },
    { month: "Feb", completions: 4 }, { month: "Mar", completions: 8 },
  ],
};

const engagementByRange: Record<TimeRange, string> = {
  "7d": "5.1h/wk",
  "30d": "4.2h/wk",
  "90d": "3.8h/wk",
  "all": "3.5h/wk",
};

const engagementTrendByRange: Record<TimeRange, number> = {
  "7d": 12,
  "30d": 5,
  "90d": -2,
  "all": 8,
};

export default function AdminAnalyticsPage() {
  const { studioCourses: adminCourses, studioMembers: members, studioDepartments: departments, studioWeeklyActive: weeklyActiveData } = useWorkspace();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all");
  const [sortCol, setSortCol] = useState<"name" | "enrolledCount" | "masteryRate">("masteryRate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const weeklyDataByRange: Record<TimeRange, { week: string; active: number }[]> = {
    "7d": weeklyActiveData.slice(-2),
    "30d": weeklyActiveData.slice(-4),
    "90d": weeklyActiveData,
    "all": [
      { week: "W1", active: 4 }, { week: "W2", active: 5 }, { week: "W3", active: 6 },
      { week: "W4", active: 7 }, { week: "W5", active: 6 }, { week: "W6", active: 8 },
      ...weeklyActiveData,
    ],
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "all", label: "All Time" },
  ];

  // Filtered data
  const filteredCourses = useMemo(() => {
    let courses = adminCourses;
    if (deptFilter !== "all") courses = courses.filter(c => c.department === deptFilter);
    return [...courses].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (typeof aVal === "string" && typeof bVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [deptFilter, sortCol, sortDir]);

  const filteredMembers = useMemo(() => {
    if (deptFilter === "all") return members;
    return members.filter(m => m.department === deptFilter);
  }, [deptFilter]);

  const activeMembers = filteredMembers.filter(m => m.status === "active").length;
  const activeCourses = filteredCourses.filter(c => c.status === "active").length;
  const avgMastery = Math.round(
    filteredCourses.filter(c => c.status === "active").reduce((s, c) => s + c.masteryRate, 0) / (activeCourses || 1)
  );

  // Department breakdown for pie chart
  const deptBreakdown = useMemo(() => {
    const deptColors = [AMBER, "hsl(var(--muted-foreground))", "hsl(var(--foreground) / 0.3)"];
    return departments.map((d, i) => ({
      name: d.name,
      value: d.memberCount,
      fill: deptColors[i % deptColors.length],
    }));
  }, []);

  // Engagement over time (area chart)
  const engagementOverTime = useMemo(() => {
    const base = [
      { period: "Oct", hours: 2.8 }, { period: "Nov", hours: 3.2 }, { period: "Dec", hours: 2.9 },
      { period: "Jan", hours: 3.8 }, { period: "Feb", hours: 4.0 }, { period: "Mar", hours: 4.2 },
    ];
    if (timeRange === "7d") return base.slice(-1);
    if (timeRange === "30d") return base.slice(-2);
    if (timeRange === "90d") return base.slice(-3);
    return base;
  }, [timeRange]);

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const handleExport = () => {
    const rows = [
      ["Course", "Enrolled", "Mastery Rate", "Department", "Status"],
      ...filteredCourses.map(c => [c.name, c.enrolledCount, `${c.masteryRate}%`, c.department, c.status]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `analytics-${timeRange}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported", { description: `analytics-${timeRange}.csv downloaded` });
  };

  const engTrend = engagementTrendByRange[timeRange];

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Analytics</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Organization-level insights and engagement data</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200"
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>

          {/* Time range pills */}
          <div className="flex gap-0.5 rounded-lg p-1 bg-muted/50">
            {timeRanges.map(t => (
              <button
                key={t.value}
                onClick={() => setTimeRange(t.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200",
                  timeRange === t.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="btn-ghost flex items-center gap-2 px-3 py-2 text-[12px] font-medium border border-border rounded-lg text-foreground/65 hover:text-foreground transition-colors duration-200"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { icon: Users, label: "Active Members", value: activeMembers, trend: null },
          { icon: BarChart3, label: "Active Courses", value: activeCourses, trend: null },
          { icon: TrendingUp, label: "Avg Mastery", value: `${avgMastery}%`, trend: null },
          { icon: Clock, label: "Avg Engagement", value: engagementByRange[timeRange], trend: engTrend },
        ].map((s, i) => (
          <div key={i} className="card-interactive p-5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-serif text-foreground">{s.value}</p>
              {s.trend !== null && (
                <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", s.trend >= 0 ? "text-accent" : "text-muted-foreground")}>
                  {s.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(s.trend)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/80">Weekly Active Learners</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyDataByRange[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="active" fill={AMBER} radius={[4, 4, 0, 0]} animationDuration={500} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/80">Course Completions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={completionDataByRange[timeRange]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Line type="monotone" dataKey="completions" stroke={AMBER} strokeWidth={2} dot={{ fill: AMBER, r: 4 }} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/75">Engagement Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={engagementOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="h" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} formatter={(val: number) => [`${val}h/wk`, "Engagement"]} />
              <Area type="monotone" dataKey="hours" stroke={AMBER} fill={AMBER} fillOpacity={0.12} strokeWidth={2} animationDuration={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/75">Members by Dept</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deptBreakdown}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                animationDuration={500}
              >
                {deptBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {deptBreakdown.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="card-interactive p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base text-foreground/75">Course Performance</h3>
          <span className="text-[11px] text-muted-foreground">
            {filteredCourses.length} course{filteredCourses.length !== 1 && "s"}
            {deptFilter !== "all" && ` in ${deptFilter}`}
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {[
                { key: "name" as const, label: "Course" },
                { key: "enrolledCount" as const, label: "Enrolled" },
                { key: "masteryRate" as const, label: "Mastery Rate" },
                { key: null, label: "Department" },
                { key: null, label: "Status" },
              ].map((h, i) => (
                <th
                  key={i}
                  onClick={h.key ? () => handleSort(h.key!) : undefined}
                  className={cn(
                    "text-left pb-3 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground",
                    h.key && "cursor-pointer hover:text-foreground transition-colors duration-150 select-none"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {h.label}
                    {h.key && sortCol === h.key && (
                      <span className="text-accent text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(c => (
              <tr key={c.id} className="transition-colors duration-200 border-b border-border/50 hover:bg-accent/5">
                <td className="py-3 px-4 font-medium text-foreground/75">{c.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{c.enrolledCount}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-accent"
                        style={{ width: `${c.masteryRate}%` }}
                      />
                    </div>
                    <span className={c.masteryRate >= 70 ? "text-accent" : c.masteryRate >= 40 ? "text-accent/70" : "text-muted-foreground"}>
                      {c.masteryRate}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{c.department}</td>
                <td className="py-3 px-4">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${c.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No courses found for this department</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
