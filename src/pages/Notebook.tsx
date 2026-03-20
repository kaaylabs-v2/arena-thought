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
    // "recent" keeps insertion order (already newest-first from context)

    return result;
  }, [notebookEntries, search, sort]);

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1">Notebook</h1>
        <p className="text-muted-foreground font-sans text-sm">Your collected insights and knowledge.</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow"
          />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["recent", "course", "tag"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 text-xs font-sans font-medium rounded-md capitalize transition-all duration-150 ${
                sort === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-20">
          <StickyNote className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm">Your insights will appear here as you learn.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group rounded-xl border border-border bg-card p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200 cursor-pointer animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-base text-foreground flex-1">{note.title}</h3>
                <span className="text-[10px] font-sans text-muted-foreground ml-3 shrink-0 flex items-center gap-1">
                  <Calendar className="h-3 w-3" strokeWidth={1.5} />
                  {note.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3 line-clamp-2">{note.snippet}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-sans text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                  {note.course}
                </span>
                <span className="text-border">·</span>
                <span className="text-[10px] font-sans text-muted-foreground">{note.source}</span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1.5 ml-auto">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-sans text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
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
