import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Tag,
} from "lucide-react";
import type { PaneState } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace } from "@/context/WorkspaceContext";

interface NotebookPaneProps {
  state: PaneState;
  onToggle: () => void;
  courseTitle: string;
}

export function NotebookPane({ state, onToggle, courseTitle }: NotebookPaneProps) {
  const isMini = state === "mini";
  const [quickNote, setQuickNote] = useState("");
  const { notebookEntries, addNotebookEntry } = useWorkspace();

  const handleQuickCapture = () => {
    const text = quickNote.trim();
    if (!text) return;
    addNotebookEntry({
      title: text.slice(0, 60),
      snippet: text,
      course: courseTitle,
      tags: [],
      source: "Personal note",
      savedFrom: "personal",
    });
    setQuickNote("");
  };

  if (isMini) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">Notebook</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary relative">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent text-[8px] text-accent-foreground flex items-center justify-center font-sans font-bold">
                {notebookEntries.length}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">{notebookEntries.length} notes</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div>
            <h2 className="text-xs font-sans text-muted-foreground uppercase tracking-wider">Notebook</h2>
            <p className="text-[10px] font-sans text-muted-foreground">{notebookEntries.length} notes</p>
          </div>
        </div>
      </div>

      {/* Quick capture */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
          <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuickCapture()}
            placeholder="Quick capture..."
            className="flex-1 bg-transparent text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5">
        {notebookEntries.length === 0 ? (
          <div className="text-center py-12 px-4">
            <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" strokeWidth={1} />
            <p className="text-[11px] font-sans text-muted-foreground">Save insights from Nexi or capture your own notes.</p>
          </div>
        ) : (
          notebookEntries.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-border bg-background p-3 hover:border-accent/20 hover:shadow-sm transition-all duration-150 cursor-pointer animate-fade-in"
            >
              <h4 className="text-xs font-sans font-medium text-foreground mb-1 line-clamp-1">{note.title}</h4>
              <p className="text-[11px] font-sans text-muted-foreground leading-relaxed line-clamp-2 mb-2">{note.snippet}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] font-sans text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Tag className="h-2 w-2" strokeWidth={1.5} />
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-sans text-muted-foreground">{note.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
