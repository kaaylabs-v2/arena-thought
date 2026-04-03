import { organization } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  sidebarCollapsed: boolean;
}

export function AdminTopBar({ sidebarCollapsed }: AdminTopBarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 flex items-center px-6 transition-all duration-200",
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
    </header>
  );
}
