import { Users, Activity, GraduationCap, Award, UserPlus, Rocket, Upload, ChevronRight, AlertTriangle } from "lucide-react";
import {
  members,
  adminCourses,
  recentActivity,
} from "@/admin/data/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AMBER = "#C9963A";

const stats = [
  { label: "Total Members", value: members.length, icon: Users },
  { label: "Active This Week", value: members.filter(m => !["30 days ago", "Never"].includes(m.lastActive)).length, icon: Activity },
  { label: "Courses Deployed", value: adminCourses.filter(c => c.status === "active").length, icon: GraduationCap },
  { label: "Mastery Achieved", value: members.reduce((acc, m) => acc + m.masteryAchieved, 0), icon: Award },
];

const masteryChartData = adminCourses
  .filter(c => c.status === "active")
  .map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
    achieved: Math.round(c.enrolledCount * c.masteryRate / 100),
    notAchieved: c.enrolledCount - Math.round(c.enrolledCount * c.masteryRate / 100),
  }));

const pendingActions = [
  { text: "2 members haven't started any course in 14 days" },
  { text: "1 course has no mastery outcome defined" },
  { text: "3 invited members haven't accepted yet" },
];

const quickActions = [
  { label: "Invite Members", icon: UserPlus, href: "/admin/members" },
  { label: "Deploy Course", icon: Rocket, href: "/admin/courses" },
  { label: "Upload Content", icon: Upload, href: "/admin/library" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Dashboard</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Organization overview and pending actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-accent/10 text-accent p-2">
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs mt-0.5 text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 p-5 bg-card border border-border rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold mb-4 text-foreground/75">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{
                  backgroundColor: (event.type === "mastery" || event.type === "completion") ? AMBER : "hsl(var(--muted-foreground) / 0.3)"
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug text-foreground/70">{event.text}</p>
                  <p className="text-[11px] mt-0.5 text-muted-foreground/60">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending + Quick Actions */}
        <div className="space-y-5">
          <div className="p-5 bg-card border border-border rounded-xl shadow-sm">
            <h2 className="text-sm font-semibold mb-3 text-foreground/75">Pending Actions</h2>
            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" strokeWidth={2} />
                  <span className="text-foreground/60 leading-snug">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-card border border-border rounded-xl shadow-sm">
            <h2 className="text-sm font-semibold mb-3 text-foreground/75">Quick Actions</h2>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors group text-foreground/65 hover:bg-accent/8"
                >
                  <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent" strokeWidth={1.5} />
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Overview Chart */}
      <div className="p-5 bg-card border border-border rounded-xl shadow-sm">
        <h2 className="text-sm font-semibold mb-4 text-foreground/75">Mastery Overview by Course</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={masteryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
                cursor={{ fill: "hsl(var(--accent) / 0.06)" }}
              />
              <Bar dataKey="achieved" stackId="a" radius={[0, 0, 0, 0]} name="Mastery Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill={AMBER} />
                ))}
              </Bar>
              <Bar dataKey="notAchieved" stackId="a" radius={[0, 4, 4, 0]} name="Not Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill="hsl(var(--muted))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
