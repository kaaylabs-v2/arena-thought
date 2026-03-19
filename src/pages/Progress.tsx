import { ArrowRight, BookOpen, Clock, Library } from "lucide-react";
import { Link } from "react-router-dom";

const courseProgress = [
  { id: "1", title: "Foundations of Machine Learning", progress: 68, lastStudied: "2 hours ago", timeSpent: "24h 15m", modules: 12, completed: 8 },
  { id: "2", title: "Advanced Statistical Methods", progress: 42, lastStudied: "Yesterday", timeSpent: "16h 30m", modules: 10, completed: 4 },
  { id: "3", title: "Philosophy of Mind", progress: 85, lastStudied: "3 days ago", timeSpent: "18h 45m", modules: 14, completed: 12 },
  { id: "5", title: "Cognitive Psychology", progress: 23, lastStudied: "1 week ago", timeSpent: "8h 20m", modules: 16, completed: 4 },
];

const Progress = () => {
  const activeCourses = courseProgress.filter((c) => c.progress < 100).length;
  const totalTime = "67h 50m";

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1">Progress</h1>
        <p className="text-muted-foreground font-sans text-sm">Your learning journey at a glance.</p>
      </div>

      {/* Summary */}
      <div className="flex gap-6 mb-10">
        <div>
          <span className="text-2xl font-serif text-foreground">{activeCourses}</span>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">Active courses</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <span className="text-2xl font-serif text-foreground">{totalTime}</span>
          <p className="text-[11px] font-sans text-muted-foreground mt-0.5">Total study time</p>
        </div>
      </div>

      {/* Course Progress Cards */}
      {courseProgress.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm mb-4">No courses started yet.</p>
          <Link to="/library" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:text-accent/80 transition-colors">
            <Library className="h-4 w-4" strokeWidth={1.5} />
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courseProgress.map((course) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base text-foreground mb-1">{course.title}</h3>
                <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {course.lastStudied}
                  </span>
                  <span>·</span>
                  <span>{course.timeSpent} studied</span>
                  <span>·</span>
                  <span>{course.completed}/{course.modules} modules</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-sans text-muted-foreground w-8 text-right">{course.progress}%</span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="flex items-center gap-1 text-xs font-sans text-muted-foreground group-hover:text-accent transition-colors duration-150">
                  Continue
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progress;
