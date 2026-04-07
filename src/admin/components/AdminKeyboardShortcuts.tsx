import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
  { keys: ["⌘", "K"], description: "Open command palette", global: true },
  { keys: ["?"], description: "Show this help", global: true },
  { keys: ["I"], description: "Invite members", page: "/admin/people" },
  { keys: ["D"], description: "Deploy course", page: "/admin/courses" },
  { keys: ["A"], description: "New announcement", page: "/admin/communication" },
  { keys: ["Esc"], description: "Close dialogs", global: true },
];

export function AdminKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === "i" && location.pathname === "/admin/people") {
        window.dispatchEvent(new CustomEvent("admin-shortcut:invite"));
      } else if (key === "d" && location.pathname === "/admin/courses") {
        window.dispatchEvent(new CustomEvent("admin-shortcut:deploy"));
      } else if (key === "a" && location.pathname === "/admin/communication") {
        window.dispatchEvent(new CustomEvent("admin-shortcut:announce"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname]);

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-1">
              <span className="text-sm text-foreground/70">{s.description}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md text-[11px] font-medium bg-muted border border-border text-muted-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Page-specific shortcuts only work on their respective pages.
        </p>
      </DialogContent>
    </Dialog>
  );
}
