import { ArrowRight, BookOpen, Library, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const recentCourses = [
  { id: "1", title: "Foundations of Machine Learning", lastActive: "2 hours ago", progress: 68, module: "Week 4: Neural Networks" },
  { id: "2", title: "Advanced Statistical Methods", lastActive: "Yesterday", progress: 42, module: "Chapter 7: Bayesian Inference" },
  { id: "3", title: "Philosophy of Mind", lastActive: "3 days ago", progress: 85, module: "Section 12: Consciousness" },
];

const Index = () => {
  const activeCourse = recentCourses[0];

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 max-w-4xl animate-fade-in">
      {/* Greeting */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground font-sans text-sm">Continue where you left off.</p>
      </div>

      {/* Continue Learning */}
      <section className="mb-12">
        <Link
          to={`/workspace/${activeCourse.id}`}
          className="group block rounded-xl border border-border bg-card p-6 lg:p-8 hover:border-accent/40 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {activeCourse.lastActive}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl text-foreground mb-2">{activeCourse.title}</h2>
          <p className="text-muted-foreground font-sans text-sm mb-5">{activeCourse.module}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${activeCourse.progress}%` }}
              />
            </div>
            <span className="text-xs font-sans text-muted-foreground">{activeCourse.progress}%</span>
          </div>
        </Link>
      </section>

      {/* Recent Workspaces */}
      <section className="mb-12">
        <h2 className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-4">Recent workspaces</h2>
        <div className="space-y-2">
          {recentCourses.slice(1).map((course) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 hover:border-accent/30 hover:bg-secondary/30 transition-all duration-150"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-foreground truncate">{course.title}</h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">{course.module}</p>
              </div>
              <div className="flex items-center gap-4 ml-4 shrink-0">
                <span className="text-xs font-sans text-muted-foreground">{course.progress}%</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex gap-3">
          <Link
            to="/library"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-sans text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-150"
          >
            <Library className="h-4 w-4" strokeWidth={1.5} />
            Open Library
          </Link>
          <Link
            to="/notebook"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-sans text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-150"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
            Review Notebook
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
