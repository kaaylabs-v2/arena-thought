import { Users, Activity, GraduationCap, Award, UserPlus, Rocket, Upload, ChevronRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
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

const pendingActions = [
  { text: "2 members haven't started any course in 14 days" },
  { text: "1 course has no mastery outcome defined" },
  { text: "3 invited members haven't accepted yet" },
];

const quickActions = [
  { label: "Invite Members", icon: UserPlus, href: "/admin/people" },
  { label: "Deploy Course", icon: Rocket, href: "/admin/courses" },
  { label: "Upload Content", icon: Upload, href: "/admin/courses" },
];

export default function AdminDashboard() {
  const { studioMembers: members, studioCourses: adminCourses, studioActivity: recentActivity } = useWorkspace();

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

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Dashboard</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Organization overview and pending actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="card-interactive p-5">
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
        <div className="lg:col-span-2 card-interactive p-5">
          <h2 className="text-sm font-semibold mb-4 text-foreground/75">Recent Activity</h2>
          <div className="space-y-3 scrollbar-thin max-h-[320px] overflow-y-auto pr-1">
            {recentActivity.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-start gap-3 setting-row rounded-lg px-2 py-1.5 -mx-2">
                <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{
                  backgroundColor: (event.type === "mastery" || event.type === "completion") ? AMBER : "hsl(var(--muted-foreground) / 0.3)"
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug text-foreground/70">{event.text}</p>
                  <p className="text-[11px] mt-0.5 text-muted-foreground/70">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending + Quick Actions */}
        <div className="space-y-5 stagger-children">
          <div className="card-interactive p-5">
            <h2 className="text-sm font-semibold mb-3 text-foreground/75">Pending Actions</h2>
            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" strokeWidth={1.5} />
                  <span className="text-foreground/80 leading-snug">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-interactive p-5">
            <h2 className="text-sm font-semibold mb-3 text-foreground/75">Quick Actions</h2>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group text-foreground/65 hover:bg-accent/8 active:scale-[0.98]"
                >
                  <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors duration-200" strokeWidth={1.5} />
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Overview Chart */}
      <div className="card-interactive p-5">
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
