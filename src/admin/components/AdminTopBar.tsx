import { Bell, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { organization, currentAdmin, roleBadgeLabel } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  sidebarCollapsed: boolean;
}

export function AdminTopBar({ sidebarCollapsed }: AdminTopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 flex items-center justify-between border-b border-slate-200 bg-white px-6 transition-all duration-200",
        sidebarCollapsed ? "left-[60px]" : "left-[240px]"
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Arena
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm font-semibold text-slate-800">{organization.name}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="relative h-8 w-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-semibold">
            {currentAdmin.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-medium text-slate-800 leading-tight">{currentAdmin.name}</p>
            <p className="text-[10px] text-slate-500">{roleBadgeLabel(currentAdmin.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
