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

const stats = [
  { label: "Total Members", value: members.length, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Active This Week", value: members.filter(m => !["30 days ago", "Never"].includes(m.lastActive)).length, icon: Activity, color: "bg-emerald-50 text-emerald-600" },
  { label: "Courses Deployed", value: adminCourses.filter(c => c.status === "active").length, icon: GraduationCap, color: "bg-violet-50 text-violet-600" },
  { label: "Mastery Achieved", value: members.reduce((acc, m) => acc + m.masteryAchieved, 0), icon: Award, color: "bg-amber-50 text-amber-600" },
];

const masteryChartData = adminCourses
  .filter(c => c.status === "active")
  .map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
    achieved: Math.round(c.enrolledCount * c.masteryRate / 100),
    notAchieved: c.enrolledCount - Math.round(c.enrolledCount * c.masteryRate / 100),
  }));

const pendingActions = [
  { text: "2 members haven't started any course in 14 days", type: "warning" as const },
  { text: "1 course has no mastery outcome defined", type: "warning" as const },
  { text: "3 invited members haven't accepted yet", type: "info" as const },
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
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Organization overview and pending actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-start gap-3 group">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  event.type === "mastery" ? "bg-amber-400" :
                  event.type === "completion" ? "bg-emerald-400" :
                  event.type === "deploy" ? "bg-violet-400" :
                  "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-700 leading-snug">{event.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions + Quick Actions — 1 col */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Pending Actions</h2>
            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" strokeWidth={2} />
                  <span className="text-slate-600 leading-snug">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <action.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-600" strokeWidth={1.5} />
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Overview Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Mastery Overview by Course</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={masteryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="achieved" stackId="a" radius={[0, 0, 0, 0]} name="Mastery Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill="#22c55e" />
                ))}
              </Bar>
              <Bar dataKey="notAchieved" stackId="a" radius={[0, 4, 4, 0]} name="Not Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill="#e2e8f0" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
