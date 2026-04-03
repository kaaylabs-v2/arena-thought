import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Users,
  Building2,
  Target,
  BarChart3,
  Megaphone,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Courses", url: "/admin/courses", icon: GraduationCap },
  { title: "Content Library", url: "/admin/library", icon: FolderOpen },
  { title: "Members", url: "/admin/members", icon: Users },
  { title: "Departments", url: "/admin/departments", icon: Building2 },
  { title: "Outcomes", url: "/admin/outcomes", icon: Target },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Help", url: "/admin/help", icon: HelpCircle },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (url: string, end?: boolean) => {
    if (end) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2 px-4 pt-5 pb-1", collapsed && "justify-center px-0")}>
        {collapsed ? (
          <span className="text-white font-bold text-sm">N²</span>
        ) : (
          <div>
            <span className="text-white font-bold text-lg tracking-tight">Nexus²</span>
            <p className="text-[10px] text-slate-500 tracking-wide uppercase mt-0.5">Admin Studio</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.end}
            className={cn(
              "flex items-center gap-3 rounded-md text-[13px] font-medium transition-colors duration-150",
              collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
              isActive(item.url, item.end)
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            )}
            title={collapsed ? item.title : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4 pt-2">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-md py-2 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
