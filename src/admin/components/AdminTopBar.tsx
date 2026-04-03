import { Bell } from "lucide-react";
import { organization } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  sidebarCollapsed: boolean;
}

export function AdminTopBar({ sidebarCollapsed }: AdminTopBarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 flex items-center justify-between px-6 transition-all duration-200",
        sidebarCollapsed ? "left-[60px]" : "left-[240px]"
      )}
      style={{
        backgroundColor: "#F5F0EA",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <span className="text-sm font-medium" style={{ color: "rgba(0,0,0,0.5)" }}>
        {organization.name}
      </span>
      <button
        className="p-1.5 rounded-md transition-colors"
        style={{ color: "rgba(0,0,0,0.45)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.75)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.45)")}
        title="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>
    </header>
  );
}
