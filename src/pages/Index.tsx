import { ArrowRight, BookOpen, Library, Clock, ListChecks, Check, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";

const recentCourses = [
  { id: "1", title: "Foundations of Machine Learning", lastActive: "2 hours ago", progress: 68, module: "Week 4: Neural Networks" },
  { id: "2", title: "Advanced Statistical Methods", lastActive: "Yesterday", progress: 42, module: "Chapter 7: Bayesian Inference" },
  { id: "3", title: "Philosophy of Mind", lastActive: "3 days ago", progress: 85, module: "Section 12: Consciousness" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const priorityDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-accent",
  low: "bg-muted-foreground/40",
};

const Index = () => {
  const { userProfile, tasks, toggleTask } = useWorkspace();
  const activeCourse = recentCourses[0];
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl">
      {/* Greeting */}
      <div className="mb-14 animate-fade-in">
        <h1 className="font-serif text-4xl lg:text-[2.75rem] text-foreground mb-2 leading-[1.1] font-medium">
          {getGreeting()}, {userProfile.name}
        </h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Continue where you left off.</p>
      </div>

      {/* Continue Learning */}
      <section className="mb-14 animate-fade-in [animation-delay:100ms] [animation-fill-mode:backwards]">
        <Link
          to={`/workspace/${activeCourse.id}`}
          className="group block card-interactive p-6 lg:p-8"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans uppercase tracking-widest">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {activeCourse.lastActive}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground icon-hover-rotate" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl lg:text-[1.75rem] text-foreground mb-1.5 leading-snug font-medium">{activeCourse.title}</h2>
          <p className="text-muted-foreground font-sans text-sm mb-6 tracking-[-0.01em]">{activeCourse.module}</p>
          <div className="flex items-center gap-3 progress-glow">
            <div className="flex-1 h-[5px] bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/80 rounded-full transition-all duration-1000 ease-spring"
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>
            <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{activeCourse.progress}%</span>
          </div>
        </Link>
      </section>

      {/* Upcoming Tasks Widget */}
      {upcomingTasks.length > 0 && (
        <section className="mb-14 animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground">Upcoming tasks</h2>
            <Link to="/study-plan" className="text-[11px] font-sans text-accent hover:text-accent/80 transition-colors duration-250 ease-apple">
              View all →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {upcomingTasks.map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 setting-row"
                style={{ animationDelay: `${200 + i * 60}ms` }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="h-[18px] w-[18px] rounded-full border-[1.5px] border-border flex items-center justify-center shrink-0 checkbox-apple"
                >
                  {task.completed && <Check className="h-2.5 w-2.5 text-accent animate-check-pop" strokeWidth={2.5} />}
                </button>
                <span className="flex-1 text-[13px] font-sans text-foreground truncate">{task.title}</span>
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[task.priority]} transition-transform duration-300 ease-spring group-hover:scale-125`} />
                {task.dueDate && (
                  <span className="text-[10px] font-sans text-muted-foreground/50 shrink-0 flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" strokeWidth={1.5} />
                    {task.dueDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Workspaces */}
      <section className="mb-14 animate-fade-in [animation-delay:300ms] [animation-fill-mode:backwards]">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Recent workspaces</h2>
        <div className="space-y-2">
          {recentCourses.slice(1).map((course, i) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group flex items-center justify-between card-interactive px-5 py-4"
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-foreground truncate leading-snug font-medium">{course.title}</h3>
                <p className="text-[12px] text-muted-foreground font-sans mt-0.5 tracking-[-0.01em]">{course.module}</p>
              </div>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{course.progress}%</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 icon-hover-rotate" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="animate-fade-in [animation-delay:400ms] [animation-fill-mode:backwards]">
        <div className="flex gap-2.5 flex-wrap">
          {[
            { to: "/library", icon: Library, label: "Open Library" },
            { to: "/notebook", icon: BookOpen, label: "Review Notebook" },
            { to: "/study-plan", icon: ListChecks, label: "Study Plan" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[13px] font-sans text-muted-foreground btn-ghost hover:text-foreground hover:border-accent/20 hover:shadow-soft"
            >
              <item.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
