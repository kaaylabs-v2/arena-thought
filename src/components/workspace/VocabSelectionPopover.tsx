import { useState, useEffect, useRef, useCallback } from "react";
import { BookA, X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";

interface SelectionState {
  text: string;
  top: number;
  left: number;
}

interface VocabSelectionPopoverProps {
  containerRef: React.RefObject<HTMLDivElement>;
  courseTitle: string;
}

export function VocabSelectionPopover({ containerRef, courseTitle }: VocabSelectionPopoverProps) {
  const { addVocabulary } = useWorkspace();
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setShowForm(false);
    setTerm("");
    setDefinition("");
    setExample("");
  }, []);

  // Listen for text selection within the messages container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseUp = () => {
      // Small delay to let browser finalize selection
      requestAnimationFrame(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          // Don't clear if form is open
          if (!showForm) setSelection(null);
          return;
        }

        const text = sel.toString().trim();
        // Check selection is within a nexi message (data-nexi-msg attribute)
        const anchorNode = sel.anchorNode;
        if (!anchorNode) return;
        const msgEl = (anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode as HTMLElement)?.closest("[data-nexi-msg]");
        if (!msgEl || !container.contains(msgEl)) return;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setSelection({
          text,
          top: rect.top - containerRect.top - 40,
          left: rect.left - containerRect.left + rect.width / 2,
        });
      });
    };

    container.addEventListener("mouseup", handleMouseUp);
    return () => container.removeEventListener("mouseup", handleMouseUp);
  }, [containerRef, showForm]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);

  // Close on click outside
  useEffect(() => {
    if (!selection) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popoverRef.current?.contains(target)) return;
      if (formRef.current?.contains(target)) return;
      clearSelection();
    };
    // Delay to avoid immediate close from the mouseup that created the selection
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selection, clearSelection]);

  const handleOpenForm = () => {
    if (!selection) return;
    setTerm(selection.text);
    setShowForm(true);
    window.getSelection()?.removeAllRanges();
  };

  const handleSave = () => {
    if (!term.trim()) return;
    addVocabulary({
      term: term.trim(),
      definition: definition.trim(),
      example: example.trim() || undefined,
      course: courseTitle,
      tags: [],
      savedFrom: "nexi",
    });
    toast.success("Added to Vocabulary", { description: term.trim() });
    clearSelection();
  };

  if (!selection) return null;

  return (
    <>
      {/* Floating "Add to Vocab" pill */}
      {!showForm && (
        <div
          ref={popoverRef}
          className="absolute z-50 animate-fade-in-fast"
          style={{
            top: selection.top,
            left: selection.left,
            transform: "translateX(-50%)",
          }}
        >
          <button
            onClick={handleOpenForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-popover border border-border shadow-lifted text-[11px] font-sans font-medium text-foreground hover:bg-muted/60 transition-all duration-150 active:scale-[0.97]"
          >
            <BookA className="h-3 w-3 text-accent" strokeWidth={1.5} />
            Add to Vocab
          </button>
        </div>
      )}

      {/* Vocab form popover */}
      {showForm && (
        <div
          ref={formRef}
          className="absolute z-50 animate-fade-in-fast"
          style={{
            top: selection.top - 8,
            left: Math.max(16, Math.min(selection.left, 500)),
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-[280px] bg-popover border border-border rounded-xl shadow-lifted p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-sans font-medium text-foreground flex items-center gap-1.5">
                <BookA className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                Add to Vocabulary
              </span>
              <button onClick={clearSelection} className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted/60 transition-colors">
                <X className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider mb-1 block">Term</label>
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-ring/40 transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider mb-1 block">Definition</label>
                <textarea
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="What does it mean?"
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-ring/40 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider mb-1 block">Example <span className="normal-case text-muted-foreground/50">(optional)</span></label>
                <input
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Use it in context…"
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-ring/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3.5">
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 text-[11px] font-sans text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!term.trim()}
                className="px-3 py-1.5 text-[11px] font-sans font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
