import { ArrowRight, BookOpen, Clock, Library, TrendingUp, Target, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const courseProgress = [
  { id: "1", title: "Foundations of Machine Learning", progress: 68, lastStudied: "2 hours ago", timeSpent: "24h 15m", modules: 12, completed: 8, nextTopic: "Backpropagation practice", needsAttention: false },
  { id: "2", title: "Advanced Statistical Methods", progress: 42, lastStudied: "Yesterday", timeSpent: "16h 30m", modules: 10, completed: 4, nextTopic: "Prior selection strategies", needsAttention: true },
  { id: "3", title: "Philosophy of Mind", progress: 85, lastStudied: "3 days ago", timeSpent: "18h 45m", modules: 14, completed: 12, nextTopic: "Qualia and zombie arguments", needsAttention: false },
  { id: "5", title: "Cognitive Psychology", progress: 23, lastStudied: "1 week ago", timeSpent: "8h 20m", modules: 16, completed: 4, nextTopic: "Working memory models", needsAttention: true },
];

const Progress = () => {
  const activeCourses = courseProgress.filter((c) => c.progress < 100).length;
  const totalTime = "67h 50m";
  const needsAttention = courseProgress.filter((c) => c.needsAttention);

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-4xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Progress</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your learning journey at a glance.</p>
      </div>

      {/* Hero Summary */}
      <div className="rounded-xl border border-border bg-card p-6 lg:p-8 mb-8 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <div className="flex items-start gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
              <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest">Momentum</span>
            </div>
            <span className="text-3xl font-serif text-foreground font-medium">{activeCourses}</span>
            <p className="text-[11px] font-sans text-muted-foreground/60 mt-0.5">active courses</p>
          </div>
          <div className="w-px h-14 bg-border self-center hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
              <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest">Total time</span>
            </div>
            <span className="text-3xl font-serif text-foreground font-medium tabular-nums">{totalTime}</span>
            <p className="text-[11px] font-sans text-muted-foreground/60 mt-0.5">studied</p>
          </div>
          {needsAttention.length > 0 && (
            <>
              <div className="w-px h-14 bg-border self-center hidden sm:block" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.5} />
                  <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest">Needs attention</span>
                </div>
                <span className="text-3xl font-serif text-foreground font-medium">{needsAttention.length}</span>
                <p className="text-[11px] font-sans text-muted-foreground/60 mt-0.5">courses behind</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Course Progress Cards */}
      {courseProgress.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <BookOpen className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground/70 font-sans text-sm mb-4">No courses started yet.</p>
          <Link to="/library" className="inline-flex items-center gap-2 text-sm font-sans text-accent hover:text-accent/80 transition-colors">
            <Library className="h-4 w-4" strokeWidth={1.5} />
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {courseProgress.map((course, i) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 hover:border-accent/20 hover:shadow-lifted transition-all duration-250 ease-out active:scale-[0.998] animate-fade-in [animation-fill-mode:backwards]"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-base text-foreground leading-snug font-medium">{course.title}</h3>
                  {course.needsAttention && (
                    <AlertCircle className="h-3.5 w-3.5 text-accent/70 shrink-0" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {course.lastStudied}
                  </span>
                  <span className="text-border">·</span>
                  <span>{course.timeSpent} studied</span>
                  <span className="text-border">·</span>
                  <span>{course.completed}/{course.modules} modules</span>
                </div>
                {/* Next topic cue */}
                <p className="text-[11px] font-sans text-accent/80 mt-2 flex items-center gap-1">
                  <Target className="h-3 w-3" strokeWidth={1.5} />
                  Next: {course.nextTopic}
                </p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex-1 h-[4px] bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent/70 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-sans text-muted-foreground/60 w-8 text-right tabular-nums">{course.progress}%</span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="flex items-center gap-1 text-[12px] font-sans text-muted-foreground/50 group-hover:text-accent transition-colors duration-200">
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
