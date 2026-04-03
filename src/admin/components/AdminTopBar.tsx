import { Bell } from "lucide-react";
import { organization } from "@/admin/data/mock-data";

export function AdminTopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border/50" style={{ backgroundColor: "#F5F0EA" }}>
      <span className="text-sm font-medium text-muted-foreground">
        {organization.name}
      </span>
      <button
        className="p-1.5 rounded-md transition-colors text-foreground/45 hover:text-foreground/75"
        title="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>
    </header>
  );
}
