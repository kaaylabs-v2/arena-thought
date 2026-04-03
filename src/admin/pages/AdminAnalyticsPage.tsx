import { BarChart3, Users, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { weeklyActiveData, adminCourses, members } from "@/admin/data/mock-data";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

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
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Analytics</h1>
      <p className="text-sm mt-0.5 mb-8" style={{ color: "rgba(0,0,0,0.45)" }}>Organization-level insights and engagement data</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Active Members", value: activeMembers },
          { icon: BarChart3, label: "Active Courses", value: activeCourses },
          { icon: TrendingUp, label: "Avg Mastery", value: `${avgMastery}%` },
          { icon: Clock, label: "Avg Engagement", value: "4.2h/wk" },
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: "20px 24px" }}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4" style={{ color: "#C9963A" }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>{s.label}</span>
            </div>
            <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Weekly Active Users */}
        <div style={cardStyle} className="p-5">
          <h3 className="font-serif text-base mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Weekly Active Learners</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} />
              <Bar dataKey="active" fill="#C9963A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Completions Trend */}
        <div style={cardStyle} className="p-5">
          <h3 className="font-serif text-base mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Course Completions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }} />
              <YAxis tick={{ fontSize: 11, fill: "rgba(0,0,0,0.4)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="completions" stroke="#C9963A" strokeWidth={2} dot={{ fill: "#C9963A", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course performance table */}
      <div style={cardStyle} className="p-5">
        <h3 className="font-serif text-base mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Course Performance</h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {["Course", "Enrolled", "Mastery Rate", "Department", "Status"].map(h => (
                <th key={h} className="text-left pb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adminCourses.map(c => (
              <tr key={c.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(201,150,58,0.03)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td className="py-3 font-medium" style={{ color: "rgba(0,0,0,0.75)" }}>{c.name}</td>
                <td className="py-3" style={{ color: "rgba(0,0,0,0.55)" }}>{c.enrolledCount}</td>
                <td className="py-3" style={{ color: c.masteryRate >= 70 ? "#16a34a" : c.masteryRate >= 40 ? "#C9963A" : "#dc2626" }}>{c.masteryRate}%</td>
                <td className="py-3" style={{ color: "rgba(0,0,0,0.55)" }}>{c.department}</td>
                <td className="py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: c.status === "active" ? "rgba(34,197,94,0.08)" : c.status === "draft" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.05)", color: c.status === "active" ? "#16a34a" : "rgba(0,0,0,0.45)" }}>
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
