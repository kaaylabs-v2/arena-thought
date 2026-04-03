import { Target, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { adminCourses, members, knowledgeGaps } from "@/admin/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminOutcomesPage() {
  const activeCourses = adminCourses.filter(c => c.status === "active");
  const avgMastery = Math.round(activeCourses.reduce((s, c) => s + c.masteryRate, 0) / (activeCourses.length || 1));
  const totalMasteries = members.reduce((s, m) => s + m.masteryAchieved, 0);
  const membersWithMastery = members.filter(m => m.masteryAchieved > 0).length;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <h1 className="font-serif text-[2rem] font-normal text-foreground">Outcomes</h1>
      <p className="text-sm mt-0.5 mb-8 text-muted-foreground">Track mastery definitions and who achieved them</p>

      <div className="grid grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { icon: Target, label: "Avg Mastery Rate", value: `${avgMastery}%` },
          { icon: Award, label: "Total Masteries", value: totalMasteries },
          { icon: TrendingUp, label: "Members with Mastery", value: membersWithMastery },
          { icon: AlertTriangle, label: "Knowledge Gaps", value: knowledgeGaps.length },
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

      <h2 className="font-serif text-lg mb-4 text-foreground/75">Course Mastery Breakdown</h2>
      <div className="grid gap-3 mb-8 stagger-children">
        {activeCourses.map(course => (
          <div key={course.id} className="card-interactive p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-sm text-foreground/80">{course.name}</h3>
                <p className="text-xs mt-1 text-muted-foreground">{course.department} · {course.enrolledCount} enrolled</p>
              </div>
              <Badge variant="outline" style={{ borderColor: course.masteryRate >= 70 ? "rgba(34,197,94,0.3)" : course.masteryRate >= 40 ? "rgba(201,150,58,0.3)" : "rgba(239,68,68,0.3)", color: course.masteryRate >= 70 ? "#16a34a" : course.masteryRate >= 40 ? "#C9963A" : "#dc2626" }}>
                {course.masteryRate}%
              </Badge>
            </div>
            <Progress value={course.masteryRate} className="h-2 progress-glow" />
            <p className="text-[11px] mt-3 leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/55">Mastery definition:</span> {course.masteryDefinition}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-lg mb-4 text-foreground/75">Identified Knowledge Gaps</h2>
      <div className="card-interactive p-5">
        <div className="space-y-3">
          {knowledgeGaps.map((gap, i) => (
            <div key={i} className="setting-row flex items-center gap-3 px-2 py-1.5 -mx-2 rounded-lg">
              <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 bg-destructive/10">
                <AlertTriangle className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-sm text-foreground/65">{gap}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
