import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Library, ListChecks, BookOpen, Sparkles, MessageSquare, Settings, User,
} from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import { useWorkspace } from "@/context/WorkspaceContext";

const pages = [
  { title: "Home", url: "/", icon: Home },
  { title: "Library", url: "/library", icon: Library },
  { title: "Study Plan", url: "/study-plan", icon: ListChecks },
  { title: "Notebook", url: "/notebook", icon: BookOpen },
  { title: "Insights", url: "/insights", icon: Sparkles },
  { title: "Reflections", url: "/reflections", icon: Sparkles },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { adminCourses, notebookEntries, vocabulary } = useWorkspace();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  const publishedCourses = adminCourses.filter((c) => c.status === "published");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, courses, notes..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.url} onSelect={() => go(p.url)}>
              <p.icon className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm font-sans">{p.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {publishedCourses.length > 0 && (
          <CommandGroup heading="Courses">
            {publishedCourses.map((c) => (
              <CommandItem key={c.id} onSelect={() => go(`/workspace/${c.id}`)}>
                <Library className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-sans">{c.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {notebookEntries.length > 0 && (
          <CommandGroup heading="Notes">
            {notebookEntries.slice(0, 5).map((n) => (
              <CommandItem key={n.id} onSelect={() => go("/notebook")}>
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-sans">{n.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {vocabulary.length > 0 && (
          <CommandGroup heading="Vocabulary">
            {vocabulary.slice(0, 5).map((v) => (
              <CommandItem key={v.id} onSelect={() => go("/notebook")}>
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-sans">{v.term}</span>
                <span className="ml-2 text-xs text-muted-foreground truncate max-w-[200px]">{v.definition}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
