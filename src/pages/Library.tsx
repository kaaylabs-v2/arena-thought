import { Search, Pin, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { getCourseProgress } from "@/lib/course-progress-data";

type FilterTab = "all" | "active" | "completed" | "pinned";

const Library = () => {
  const { adminCourses } = useWorkspace();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const courses = useMemo(() => {
    return adminCourses
      .filter((c) => c.status === "published")
      .map((c) => {
        const sourceCount = c.modules.reduce((acc, m) => acc + m.items.length, 0);
        const progress = c.id === "4" || c.id === "6" ? 100 : c.id === "1" ? 68 : c.id === "2" ? 42 : c.id === "3" ? 85 : c.id === "5" ? 23 : Math.floor(Math.random() * 80) + 10;
        const pinned = c.id === "1" || c.id === "3";
        const status: "active" | "completed" = progress === 100 ? "completed" : "active";
        const lastAccessed = c.updatedAt;
        return { id: c.id, title: c.title, description: c.description, progress, lastAccessed, pinned, status, sourceCount };
      });
  }, [adminCourses]);

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
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Library</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your courses and learning spaces.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
          />
        </div>
        <div className="flex gap-0.5 bg-muted/60 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 text-[12px] font-sans font-medium rounded-md transition-all duration-200 ${
                filter === tab.key
                  ? "bg-background text-foreground shadow-soft"
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
        <div className="text-center py-24 animate-fade-in">
          <BookOpen className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCourses.map((course, i) => (
            <Link
              key={course.id}
              to={`/workspace/${course.id}`}
              className="group block rounded-xl border border-border bg-card p-5 hover:border-accent/25 hover:shadow-lifted transition-all duration-250 ease-out active:scale-[0.995] animate-fade-in [animation-fill-mode:backwards]"
              style={{ animationDelay: `${100 + i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {course.pinned && <Pin className="h-3 w-3 text-accent/70" strokeWidth={1.5} />}
                  <span className="text-[11px] font-sans text-muted-foreground/80 flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {course.lastAccessed}
                  </span>
                </div>
                {course.status === "completed" && (
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-accent/80 bg-accent/15 px-2 py-0.5 rounded-full">
                    Complete
                  </span>
                )}
              </div>
              <h3 className="font-serif text-[1.1rem] text-foreground mb-1.5 leading-snug">
                {course.title}
              </h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-4 line-clamp-2 tracking-[-0.01em] min-h-[40px]">
                {course.description}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[4px] bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent/70 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-[11px] font-sans text-muted-foreground tabular-nums">{course.progress}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
