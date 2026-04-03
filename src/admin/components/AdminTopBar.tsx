import { Bell } from "lucide-react";
import { organization } from "@/admin/data/mock-data";
import { toast } from "sonner";

export function AdminTopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background">
      <span className="text-sm font-medium text-muted-foreground">
        {organization.name}
      </span>
      <button
        className="p-1.5 rounded-md transition-colors text-muted-foreground/50 hover:text-muted-foreground cursor-not-allowed"
        title="Coming in next phase"
        onClick={() => toast("Coming in next phase", { description: "Notifications" })}
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>
    </header>
  );
}
