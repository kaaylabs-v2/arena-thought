import { Search, BookOpen, Tag, Calendar, StickyNote } from "lucide-react";
import { useState, useMemo } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";

type SortKey = "recent" | "course" | "tag";

const Notebook = () => {
  const { notebookEntries } = useWorkspace();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const filteredNotes = useMemo(() => {
    let result = notebookEntries.filter((n) =>
      !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.course.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "course") {
      result = [...result].sort((a, b) => a.course.localeCompare(b.course));
    } else if (sort === "tag") {
      result = [...result].sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));
    }
    return result;
  }, [notebookEntries, search, sort]);

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-4xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1]">Notebook</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your collected insights and knowledge.</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
          />
        </div>
        <div className="flex gap-0.5 bg-muted/60 p-1 rounded-lg">
          {(["recent", "course", "tag"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3.5 py-1.5 text-[12px] font-sans font-medium rounded-md capitalize transition-all duration-200 ${
                sort === key ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <StickyNote className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground/70 font-sans text-sm">Your insights will appear here as you learn.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotes.map((note, i) => (
            <div
              key={note.id}
              className="group rounded-xl border border-border bg-card p-5 hover:border-accent/20 hover:shadow-lifted transition-all duration-250 ease-out cursor-pointer animate-fade-in [animation-fill-mode:backwards]"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-base text-foreground flex-1 leading-snug">{note.title}</h3>
                <span className="text-[10px] font-sans text-muted-foreground/60 ml-3 shrink-0 flex items-center gap-1">
                  <Calendar className="h-3 w-3" strokeWidth={1.5} />
                  {note.date}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground/70 font-sans leading-relaxed mb-3 line-clamp-2 tracking-[-0.01em]">{note.snippet}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-sans text-muted-foreground/60 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                  {note.course}
                </span>
                <span className="text-border">·</span>
                <span className="text-[10px] font-sans text-muted-foreground/50">{note.source}</span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1.5 ml-auto">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-sans text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notebook;
