import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentAdmin, roleBadgeLabel } from "@/admin/data/mock-data";

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
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (url: string, end?: boolean) => {
    if (end) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const initials = currentAdmin.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
      style={{ backgroundColor: "#0F0F0F", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Logo */}
      <div className={cn("flex flex-col px-4 pt-5 pb-1", collapsed && "items-center px-0")}>
        <span className="font-serif text-base text-white leading-none" style={{ fontSize: collapsed ? 14 : 18 }}>
          N²
        </span>
        {!collapsed && (
          <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Admin Studio
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = isActive(item.url, item.end);
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.end}
              className={cn(
                "flex items-center gap-3 rounded-md text-[13px] font-medium transition-colors duration-150 relative",
                collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                active
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={{
                backgroundColor: active ? "rgba(201, 150, 58, 0.10)" : undefined,
                color: active ? "#fff" : "rgba(255,255,255,0.4)",
                borderLeft: active && !collapsed ? "2px solid #C9963A" : "2px solid transparent",
                marginLeft: collapsed ? 0 : -2,
              }}
              title={collapsed ? item.title : undefined}
            >
              <item.icon
                className="h-4 w-4 shrink-0"
                strokeWidth={1.5}
                style={{ color: active ? "#C9963A" : "rgba(255,255,255,0.4)" }}
              />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 pt-2 space-y-1">
        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "8px 0" }} />

        {/* Admin user row */}
        {collapsed ? (
          <button
            onClick={() => navigate("/admin/settings")}
            className="flex items-center justify-center w-full py-2"
            title="Settings"
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0"
              style={{
                backgroundColor: "rgba(201,150,58,0.20)",
                border: "1px solid rgba(201,150,58,0.30)",
                color: "#C9963A",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {initials}
            </div>
          </button>
        ) : (
          <div
            className="flex items-center gap-2.5"
            style={{ padding: "10px 16px" }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0"
              style={{
                backgroundColor: "rgba(201,150,58,0.20)",
                border: "1px solid rgba(201,150,58,0.30)",
                color: "#C9963A",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium leading-tight truncate"
                style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Inter, sans-serif" }}
              >
                {currentAdmin.name}
              </p>
              <p
                className="text-[11px] leading-tight"
                style={{ color: "rgba(255,255,255,0.40)", fontFamily: "Inter, sans-serif" }}
              >
                {roleBadgeLabel(currentAdmin.role)}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/settings")}
              className="shrink-0 p-1 rounded-md transition-colors"
              style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              title="Settings"
            >
              <Settings className="h-[15px] w-[15px]" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Back to Arena */}
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-2 w-full py-1.5 text-[12px] font-sans transition-colors duration-150",
            collapsed ? "justify-center" : "px-3"
          )}
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          title={collapsed ? "Back to Arena" : undefined}
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          {!collapsed && <span>Back to Arena</span>}
        </button>

        {/* Help link */}
        <button
          onClick={() => navigate("/admin/help")}
          className={cn(
            "flex items-center gap-2 w-full py-1.5 text-[12px] font-sans transition-colors duration-150",
            collapsed ? "justify-center" : "px-3"
          )}
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          title={collapsed ? "Help" : undefined}
        >
          <HelpCircle className="h-[13px] w-[13px]" strokeWidth={1.5} />
          {!collapsed && <span>Help</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-md py-2 transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
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
