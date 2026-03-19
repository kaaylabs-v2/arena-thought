import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Tag,
  Calendar,
  FileText,
} from "lucide-react";
import type { PaneState } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NotebookPaneProps {
  state: PaneState;
  onToggle: () => void;
}

const savedNotes = [
  {
    id: "n1",
    title: "Backpropagation step-by-step",
    snippet: "Forward pass computes output, backward pass computes gradients using chain rule...",
    source: "Nexi response",
    tags: ["neural-networks"],
    date: "Just now",
  },
  {
    id: "n2",
    title: "Key differences: SGD vs Mini-batch",
    snippet: "Batch uses full dataset, SGD uses single sample, mini-batch balances both...",
    source: "Nexi response",
    tags: ["optimization"],
    date: "2 hours ago",
  },
  {
    id: "n3",
    title: "Activation function comparison",
    snippet: "ReLU solves vanishing gradient but has dying neuron problem. Sigmoid squashes to 0-1...",
    source: "Personal note",
    tags: ["neural-networks", "comparison"],
    date: "Yesterday",
  },
  {
    id: "n4",
    title: "Regularization intuition",
    snippet: "L1 promotes sparsity (feature selection), L2 promotes small weights (smoothness)...",
    source: "Nexi response",
    tags: ["regularization"],
    date: "3 days ago",
  },
];

export function NotebookPane({ state, onToggle }: NotebookPaneProps) {
  const isMini = state === "mini";
  const [quickNote, setQuickNote] = useState("");

  if (isMini) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors relative"
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
                {savedNotes.length}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">{savedNotes.length} notes</TooltipContent>
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
            <p className="text-[10px] font-sans text-muted-foreground">{savedNotes.length} notes</p>
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
            placeholder="Quick capture..."
            className="flex-1 bg-transparent text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5">
        {savedNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border border-border bg-background p-3 hover:border-accent/20 hover:shadow-sm transition-all duration-150 cursor-pointer"
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
        ))}
      </div>
    </div>
  );
}
