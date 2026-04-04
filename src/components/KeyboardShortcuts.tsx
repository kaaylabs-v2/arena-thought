import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { keys: ["⌘", "K"], description: "Open command palette", global: true },
  { keys: ["?"], description: "Show keyboard shortcuts", global: true },
  { keys: ["N"], description: "New note", page: "/notebook" },
  { keys: ["T"], description: "Add task", page: "/study-plan" },
  { keys: ["R"], description: "Start reflection", page: "/reflections" },
  { keys: ["Esc"], description: "Close modals", global: true },
];

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore when typing in inputs
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement)?.isContentEditable) return;

    if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      setShowHelp((s) => !s);
      return;
    }

    if (e.key === "Escape") {
      setShowHelp(false);
      return;
    }

    // Page-specific shortcuts
    const key = e.key.toLowerCase();
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (key === "n" && location.pathname === "/notebook") {
      e.preventDefault();
      // Dispatch a custom event the Notebook page can listen to
      window.dispatchEvent(new CustomEvent("shortcut:new-note"));
    } else if (key === "t" && location.pathname === "/study-plan") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("shortcut:new-task"));
    } else if (key === "r" && location.pathname === "/reflections") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("shortcut:start-reflection"));
    }
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-lg">
            <Keyboard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 mt-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-1">
              <span className="text-[13px] font-sans text-foreground">{s.description}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="min-w-[24px] h-6 px-1.5 flex items-center justify-center rounded-md border border-border bg-muted text-[11px] font-sans font-medium text-muted-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-sans text-muted-foreground/70 mt-2">
          Page-specific shortcuts work only on their respective pages.
        </p>
      </DialogContent>
    </Dialog>
  );
}
