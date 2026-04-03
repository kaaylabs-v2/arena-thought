import { BarChart3, Users, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { weeklyActiveData, adminCourses, members } from "@/admin/data/mock-data";

const AMBER = "#C9963A";

const completionData = [
  { month: "Oct", completions: 2 },
  { month: "Nov", completions: 5 },
  { month: "Dec", completions: 3 },
  { month: "Jan", completions: 7 },
  { month: "Feb", completions: 4 },
  { month: "Mar", completions: 8 },
];

export default function AdminAnalyticsPage() {
  const activeMembers = members.filter(m => m.status === "active").length;
  const activeCourses = adminCourses.filter(c => c.status === "active").length;
  const avgMastery = Math.round(adminCourses.filter(c => c.status === "active").reduce((s, c) => s + c.masteryRate, 0) / (activeCourses || 1));

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <h1 className="font-serif text-[2rem] font-normal text-foreground">Analytics</h1>
      <p className="text-sm mt-0.5 mb-8 text-muted-foreground">Organization-level insights and engagement data</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { icon: Users, label: "Active Members", value: activeMembers },
          { icon: BarChart3, label: "Active Courses", value: activeCourses },
          { icon: TrendingUp, label: "Avg Mastery", value: `${avgMastery}%` },
          { icon: Clock, label: "Avg Engagement", value: "4.2h/wk" },
        ].map((s, i) => (
          <div key={i} className="card-interactive p-5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-serif text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/75">Weekly Active Learners</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="active" fill={AMBER} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-interactive p-5">
          <h3 className="font-serif text-base mb-4 text-foreground/75">Course Completions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Line type="monotone" dataKey="completions" stroke={AMBER} strokeWidth={2} dot={{ fill: AMBER, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-interactive p-5">
        <h3 className="font-serif text-base mb-4 text-foreground/75">Course Performance</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Course", "Enrolled", "Mastery Rate", "Department", "Status"].map(h => (
                <th key={h} className="text-left pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adminCourses.map(c => (
              <tr key={c.id} className="transition-colors duration-200 border-b border-border/50 hover:bg-accent/5">
                <td className="py-3 font-medium text-foreground/75">{c.name}</td>
                <td className="py-3 text-muted-foreground">{c.enrolledCount}</td>
                <td className="py-3" style={{ color: c.masteryRate >= 70 ? "#16a34a" : c.masteryRate >= 40 ? "#C9963A" : "#dc2626" }}>{c.masteryRate}%</td>
                <td className="py-3 text-muted-foreground">{c.department}</td>
                <td className="py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${c.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
