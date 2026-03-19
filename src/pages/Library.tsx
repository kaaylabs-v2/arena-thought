import { Search, Pin, BookOpen, Clock, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const courses = [
  { id: "1", title: "Foundations of Machine Learning", description: "Core concepts in supervised and unsupervised learning, optimization, and neural network architectures.", progress: 68, lastAccessed: "2 hours ago", pinned: true, status: "active" as const },
  { id: "2", title: "Advanced Statistical Methods", description: "Deep dive into Bayesian inference, hypothesis testing, and multivariate analysis techniques.", progress: 42, lastAccessed: "Yesterday", pinned: false, status: "active" as const },
  { id: "3", title: "Philosophy of Mind", description: "Exploring consciousness, intentionality, and the relationship between mind and brain.", progress: 85, lastAccessed: "3 days ago", pinned: true, status: "active" as const },
  { id: "4", title: "Linear Algebra for Data Science", description: "Matrix operations, eigenvalues, SVD, and applications in dimensionality reduction.", progress: 100, lastAccessed: "2 weeks ago", pinned: false, status: "completed" as const },
  { id: "5", title: "Cognitive Psychology", description: "Memory, attention, perception, and decision-making from a cognitive science perspective.", progress: 23, lastAccessed: "1 week ago", pinned: false, status: "active" as const },
  { id: "6", title: "Research Methods in Social Science", description: "Qualitative and quantitative methodologies, experimental design, and ethical considerations.", progress: 100, lastAccessed: "1 month ago", pinned: false, status: "completed" as const },
];

type FilterTab = "all" | "active" | "completed" | "pinned";

const Library = () => {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "active") return c.status === "active";
    if (filter === "completed") return c.status === "completed";
    if (filter === "pinned") return c.pinned;
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "pinned", label: "Pinned" },
  ];

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1">Library</h1>
        <p className="text-muted-foreground font-sans text-sm">Your courses and learning spaces.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow"
          />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded-md transition-all duration-150 ${
                filter === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group block rounded-xl border border-border bg-card p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {course.pinned && <Pin className="h-3 w-3 text-accent" strokeWidth={1.5} />}
                  <span className="text-xs font-sans text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {course.lastAccessed}
                  </span>
                </div>
                {course.status === "completed" && (
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg text-foreground mb-1.5 group-hover:text-foreground/90 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-[11px] font-sans text-muted-foreground">{course.progress}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
