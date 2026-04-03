import { Bell } from "lucide-react";
import { organization, currentAdmin, roleBadgeLabel } from "@/admin/data/mock-data";
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
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium" style={{ color: "rgba(0,0,0,0.5)" }}>
          {organization.name}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative h-8 w-8 rounded-md flex items-center justify-center transition-colors" style={{ color: "rgba(0,0,0,0.35)" }}>
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#C9963A" }} />
        </button>
        <div className="h-4 w-px" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
            style={{ backgroundColor: "#C9963A" }}
          >
            {currentAdmin.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-medium leading-tight" style={{ color: "rgba(0,0,0,0.8)" }}>
              {currentAdmin.name}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(0,0,0,0.4)" }}>
              {roleBadgeLabel(currentAdmin.role)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
