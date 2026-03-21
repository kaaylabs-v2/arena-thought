import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Tag,
  BookA,
  Trash2,
} from "lucide-react";
import type { PaneState } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

interface NotebookPaneProps {
  state: PaneState;
  onToggle: () => void;
  courseTitle: string;
}

type PaneTab = "notes" | "vocab";

export function NotebookPane({ state, onToggle, courseTitle }: NotebookPaneProps) {
  const isMini = state === "mini";
  const [quickNote, setQuickNote] = useState("");
  const [activeTab, setActiveTab] = useState<PaneTab>("notes");
  const [vocabTerm, setVocabTerm] = useState("");
  const [vocabDef, setVocabDef] = useState("");
  const [vocabExample, setVocabExample] = useState("");
  const [showVocabForm, setShowVocabForm] = useState(false);
  const { notebookEntries, addNotebookEntry, vocabulary, addVocabulary, deleteVocabulary } = useWorkspace();

  const courseVocab = vocabulary.filter((v) => v.course === courseTitle);

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

  const handleAddVocab = () => {
    const term = vocabTerm.trim();
    const def = vocabDef.trim();
    if (!term || !def) {
      toast.error("Term and definition are required");
      return;
    }
    addVocabulary({
      term,
      definition: def,
      example: vocabExample.trim() || undefined,
      course: courseTitle,
      tags: [],
      savedFrom: "personal",
    });
    setVocabTerm("");
    setVocabDef("");
    setVocabExample("");
    setShowVocabForm(false);
    toast.success("Term saved");
  };

  const handleDeleteVocab = (id: string) => {
    deleteVocabulary(id);
    toast.success("Term removed");
  };

  if (isMini) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">Notebook</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-muted/50 relative">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent/80 text-[8px] text-accent-foreground flex items-center justify-center font-sans font-bold">
                {notebookEntries.length}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">{notebookEntries.length} notes</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-muted/50">
              <BookA className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.5} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-sans text-xs">{courseVocab.length} terms</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div>
            <h2 className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-widest">Notebook</h2>
            <p className="text-[10px] font-sans text-muted-foreground/50">
              {activeTab === "notes" ? `${notebookEntries.length} notes` : `${courseVocab.length} terms`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-3 gap-1">
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-3 py-2 text-[11px] font-sans font-medium transition-all duration-200 border-b-2 -mb-px ${
            activeTab === "notes"
              ? "text-foreground border-accent"
              : "text-muted-foreground/60 border-transparent hover:text-foreground"
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab("vocab")}
          className={`px-3 py-2 text-[11px] font-sans font-medium transition-all duration-200 border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "vocab"
              ? "text-foreground border-accent"
              : "text-muted-foreground/60 border-transparent hover:text-foreground"
          }`}
        >
          <BookA className="h-3 w-3" strokeWidth={1.5} />
          Vocab
          {courseVocab.length > 0 && (
            <span className="text-[9px] bg-muted/60 px-1.5 py-0.5 rounded-full">{courseVocab.length}</span>
          )}
        </button>
      </div>

      {activeTab === "notes" ? (
        <>
          {/* Quick capture */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2 transition-colors focus-within:bg-muted/60">
              <Plus className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickCapture()}
                placeholder="Quick capture..."
                className="flex-1 bg-transparent text-[12px] font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5 scrollbar-thin">
            {notebookEntries.length === 0 ? (
              <div className="text-center py-14 px-4">
                <BookOpen className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2.5" strokeWidth={1} />
                <p className="text-[11px] font-sans text-muted-foreground/50 leading-relaxed">Save insights from Nexi or capture your own notes.</p>
              </div>
            ) : (
              notebookEntries.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-border/80 bg-background p-3 hover:border-border hover:shadow-soft transition-all duration-200 cursor-pointer animate-fade-in-fast"
                >
                  <h4 className="text-[12px] font-sans font-medium text-foreground mb-1 line-clamp-1">{note.title}</h4>
                  <p className="text-[11px] font-sans text-muted-foreground/70 leading-relaxed line-clamp-2 mb-2">{note.snippet}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {note.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-sans text-accent/70 bg-accent/8 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Tag className="h-2 w-2" strokeWidth={1.5} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-sans text-muted-foreground/50">{note.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Vocab quick add */}
          <div className="p-3 border-b border-border">
            {!showVocabForm ? (
              <button
                onClick={() => setShowVocabForm(true)}
                className="flex items-center gap-2 w-full bg-muted/40 rounded-lg px-3 py-2 text-[12px] font-sans text-muted-foreground/50 hover:bg-muted/60 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                Add a term...
              </button>
            ) : (
              <div className="space-y-2 animate-fade-in-fast">
                <input
                  type="text"
                  value={vocabTerm}
                  onChange={(e) => setVocabTerm(e.target.value)}
                  placeholder="Term"
                  autoFocus
                  className="w-full bg-muted/40 rounded-lg px-3 py-2 text-[12px] font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-muted/60 transition-colors"
                />
                <textarea
                  value={vocabDef}
                  onChange={(e) => setVocabDef(e.target.value)}
                  placeholder="Definition"
                  rows={2}
                  className="w-full bg-muted/40 rounded-lg px-3 py-2 text-[12px] font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-muted/60 transition-colors resize-none"
                />
                <input
                  type="text"
                  value={vocabExample}
                  onChange={(e) => setVocabExample(e.target.value)}
                  placeholder="Example (optional)"
                  onKeyDown={(e) => e.key === "Enter" && handleAddVocab()}
                  className="w-full bg-muted/40 rounded-lg px-3 py-2 text-[12px] font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-muted/60 transition-colors"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => { setShowVocabForm(false); setVocabTerm(""); setVocabDef(""); setVocabExample(""); }}
                    className="px-2.5 py-1 text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVocab}
                    className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-sans font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Vocab list */}
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5 scrollbar-thin">
            {courseVocab.length === 0 ? (
              <div className="text-center py-14 px-4">
                <BookA className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2.5" strokeWidth={1} />
                <p className="text-[11px] font-sans text-muted-foreground/50 leading-relaxed">Save key terms and definitions as you learn.</p>
              </div>
            ) : (
              courseVocab.map((v) => (
                <div
                  key={v.id}
                  className="group rounded-lg border border-border/80 bg-background p-3 hover:border-border hover:shadow-soft transition-all duration-200 animate-fade-in-fast"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[12px] font-serif font-medium text-foreground leading-snug">{v.term}</h4>
                    <button
                      onClick={() => handleDeleteVocab(v.id)}
                      className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground/0 group-hover:text-muted-foreground/40 hover:!text-destructive transition-all duration-200 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </div>
                  <p className="text-[11px] font-sans text-muted-foreground/70 leading-relaxed mt-1">{v.definition}</p>
                  {v.example && (
                    <p className="text-[10px] font-sans text-accent/70 bg-accent/5 rounded px-2 py-1 mt-2 leading-relaxed italic">
                      "{v.example}"
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      {v.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-sans text-accent/70 bg-accent/8 px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-sans text-muted-foreground/50">{v.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
