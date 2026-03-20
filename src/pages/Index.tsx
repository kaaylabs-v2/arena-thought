import { ArrowRight, BookOpen, Library, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

const Index = () => {
  const activeCourse = recentCourses[0];

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl">
      {/* Greeting */}
      <div className="mb-14 animate-fade-in">
        <h1 className="font-serif text-4xl lg:text-[2.75rem] text-foreground mb-2 leading-[1.15] font-medium">{getGreeting()}</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Continue where you left off.</p>
      </div>

      {/* Continue Learning */}
      <section className="mb-14 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <Link
          to={`/workspace/${activeCourse.id}`}
          className="group block rounded-xl border border-border bg-card p-6 lg:p-8 hover:border-accent/30 hover:shadow-lifted transition-all duration-250 ease-out active:scale-[0.995]"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans uppercase tracking-widest">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {activeCourse.lastActive}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl lg:text-[1.75rem] text-foreground mb-1.5 leading-snug font-medium">{activeCourse.title}</h2>
          <p className="text-muted-foreground font-sans text-sm mb-6 tracking-[-0.01em]">{activeCourse.module}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[5px] bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/80 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>
            <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{activeCourse.progress}%</span>
          </div>
        </Link>
      </section>

      {/* Recent Workspaces */}
      <section className="mb-14 animate-fade-in [animation-delay:160ms] [animation-fill-mode:backwards]">
        <h2 className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Recent workspaces</h2>
        <div className="space-y-1.5">
          {recentCourses.slice(1).map((course, i) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 hover:border-accent/20 hover:shadow-soft transition-all duration-200 ease-out active:scale-[0.998]"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-foreground truncate leading-snug font-medium">{course.title}</h3>
                <p className="text-[12px] text-muted-foreground font-sans mt-0.5 tracking-[-0.01em]">{course.module}</p>
              </div>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{course.progress}%</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-200" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="animate-fade-in [animation-delay:280ms] [animation-fill-mode:backwards]">
        <div className="flex gap-2.5">
          <Link
            to="/library"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-sans text-muted-foreground hover:text-foreground hover:border-accent/20 hover:shadow-soft transition-all duration-200 ease-out active:scale-[0.97]"
          >
            <Library className="h-3.5 w-3.5" strokeWidth={1.5} />
            Open Library
          </Link>
          <Link
            to="/notebook"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-sans text-muted-foreground hover:text-foreground hover:border-accent/20 hover:shadow-soft transition-all duration-200 ease-out active:scale-[0.97]"
          >
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
            Review Notebook
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
