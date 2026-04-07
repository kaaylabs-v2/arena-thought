import { useState, useEffect, useRef, useCallback } from "react";
import { BookA, X, Sparkles, Loader2 } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
import { mockGenerateDefinition, mockGenerateExample } from "@/lib/mock-vocab-ai";

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
  const [genDef, setGenDef] = useState(false);
  const [genEx, setGenEx] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const justOpenedFormRef = useRef(false);
  const showFormRef = useRef(false);

  const clearSelection = useCallback(() => {
    setSelection(null);
    setShowForm(false);
    showFormRef.current = false;
    setTerm("");
    setDefinition("");
    setExample("");
    setGenDef(false);
    setGenEx(false);
  }, []);

  // Listen for text selection within the messages container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseUp = () => {
      requestAnimationFrame(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          if (!showFormRef.current) setSelection(null);
          return;
        }

        const text = sel.toString().trim();
        const anchorNode = sel.anchorNode;
        if (!anchorNode) return;
        const msgEl = (anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode as HTMLElement)?.closest("[data-nexi-msg]");
        if (!msgEl || !container.contains(msgEl)) return;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Position pill above selection, but clamp so it doesn't go above visible area
        const scrollTop = container.scrollTop;
        const rawTop = rect.top - containerRect.top + scrollTop - 40;
        const clampedTop = Math.max(scrollTop + 4, rawTop);

        setSelection({
          text,
          top: clampedTop,
          left: rect.left - containerRect.left + rect.width / 2,
        });
      });
    };

    container.addEventListener("mouseup", handleMouseUp);
    return () => container.removeEventListener("mouseup", handleMouseUp);
  }, [containerRef]);

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
      // Skip if we just opened the form (the pill click triggers this)
      if (justOpenedFormRef.current) {
        justOpenedFormRef.current = false;
        return;
      }
      const target = e.target as HTMLElement;
      if (popoverRef.current?.contains(target)) return;
      if (formRef.current?.contains(target)) return;
      clearSelection();
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 200);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selection, showForm, clearSelection]);

  const handleOpenForm = useCallback(() => {
    if (!selection) return;
    justOpenedFormRef.current = true;
    const selectedText = selection.text;
    setTerm(selectedText);
    setShowForm(true);
    showFormRef.current = true;
    setDefinition("");
    setExample("");
    window.getSelection()?.removeAllRanges();

    // Auto-generate definition
    setGenDef(true);
    mockGenerateDefinition(selectedText).then((def) => {
      setDefinition(def);
      setGenDef(false);
    });
  }, [selection]);

  const handleGenerateExample = useCallback(() => {
    if (!term.trim()) return;
    setGenEx(true);
    mockGenerateExample(term.trim()).then((ex) => {
      setExample(ex);
      setGenEx(false);
    });
  }, [term]);

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
            left: Math.max(16, Math.min(selection.left, (containerRef.current?.clientWidth || 500) - 166)),
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-[300px] bg-popover border border-border rounded-xl shadow-lifted p-4">
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
              {/* Term */}
              <div>
                <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider mb-1 block">Term</label>
                <input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-ring/40 transition-colors"
                  autoFocus
                />
              </div>

              {/* Definition with auto-generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider">Definition</label>
                  {genDef && (
                    <span className="flex items-center gap-1 text-[9px] font-sans text-accent/70">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" strokeWidth={2} />
                      Generating…
                    </span>
                  )}
                </div>
                <div className="relative">
                  <textarea
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value)}
                    placeholder={genDef ? "" : "What does it mean?"}
                    rows={2}
                    className={`w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-ring/40 transition-colors resize-none ${genDef ? "animate-pulse opacity-60" : ""}`}
                  />
                </div>
              </div>

              {/* Example with on-demand generate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider">
                    Example <span className="normal-case text-muted-foreground/70">(optional)</span>
                  </label>
                  {!genEx && !example && (
                    <button
                      onClick={handleGenerateExample}
                      className="flex items-center gap-1 text-[9px] font-sans text-accent/80 hover:text-accent transition-colors"
                    >
                      <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
                      Generate
                    </button>
                  )}
                  {genEx && (
                    <span className="flex items-center gap-1 text-[9px] font-sans text-accent/70">
                      <Loader2 className="h-2.5 w-2.5 animate-spin" strokeWidth={2} />
                      Generating…
                    </span>
                  )}
                </div>
                <input
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder={genEx ? "" : "Use it in context…"}
                  className={`w-full bg-background border border-border rounded-lg px-3 py-1.5 text-[12.5px] font-sans text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-ring/40 transition-colors ${genEx ? "animate-pulse opacity-60" : ""}`}
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
                disabled={!term.trim() || genDef}
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
