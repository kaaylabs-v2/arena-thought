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
const AMBER_LIGHT = "rgba(201, 150, 58, 0.08)";
const AMBER_MID = "rgba(201, 150, 58, 0.15)";

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

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>
          Organization overview and pending actions
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}
              >
                <stat.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-semibold" style={{ color: "rgba(0,0,0,0.85)" }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 p-5" style={cardStyle}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 6).map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{
                  backgroundColor: event.type === "mastery" ? AMBER :
                    event.type === "completion" ? "#22c55e" :
                    event.type === "deploy" ? "#8b5cf6" : "#64748b"
                }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-snug" style={{ color: "rgba(0,0,0,0.7)" }}>{event.text}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(0,0,0,0.35)" }}>{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending + Quick Actions */}
        <div className="space-y-5">
          <div className="p-5" style={cardStyle}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "rgba(0,0,0,0.75)" }}>Pending Actions</h2>
            <div className="space-y-2.5">
              {pendingActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={2} style={{ color: AMBER }} />
                  <span style={{ color: "rgba(0,0,0,0.6)" }} className="leading-snug">{action.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5" style={cardStyle}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: "rgba(0,0,0,0.75)" }}>Quick Actions</h2>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors group"
                  style={{ color: "rgba(0,0,0,0.65)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = AMBER_LIGHT)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <action.icon className="h-4 w-4 group-hover:text-[#C9963A]" strokeWidth={1.5} style={{ color: "rgba(0,0,0,0.35)" }} />
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.2)" }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Overview Chart */}
      <div className="p-5" style={cardStyle}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Mastery Overview by Course</h2>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={masteryChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.35)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.55)" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }}
                cursor={{ fill: "rgba(201,150,58,0.04)" }}
              />
              <Bar dataKey="achieved" stackId="a" radius={[0, 0, 0, 0]} name="Mastery Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill={AMBER} />
                ))}
              </Bar>
              <Bar dataKey="notAchieved" stackId="a" radius={[0, 4, 4, 0]} name="Not Achieved">
                {masteryChartData.map((_, i) => (
                  <Cell key={i} fill="rgba(0,0,0,0.06)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
