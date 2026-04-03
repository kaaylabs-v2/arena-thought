import { useNavigate } from "react-router-dom";
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
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { currentAdmin, roleBadgeLabel } from "@/admin/data/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

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

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const initials = currentAdmin.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header — logo + collapse toggle */}
      <SidebarHeader className="px-2 py-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-base tracking-tight text-sidebar-foreground leading-none">
              N²
            </span>
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
            >
              <ChevronsRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">
                Nexus²
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase mt-1 text-sidebar-foreground/35">
                Admin Studio
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 shrink-0"
            >
              <ChevronsLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent className="px-2 mt-1">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={false}
                    tooltip={item.title}
                    className="rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon strokeWidth={1.5} />
                      <span className="text-[13px] font-sans">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user block + back to arena */}
      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator className="mx-0" />

        {/* Admin user block */}
        <div
          className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-accent/15 text-accent text-[11px] font-sans font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-[13px] font-sans font-medium truncate w-full text-left text-sidebar-foreground/85">
                {currentAdmin.name}
              </span>
              <span className="text-[11px] font-sans text-sidebar-foreground/40 truncate w-full text-left">
                {roleBadgeLabel(currentAdmin.role)}
              </span>
            </div>
          )}
        </div>

        {/* Back to Arena */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/")}
              tooltip="Back to Arena"
              className="rounded-lg text-sidebar-foreground/35 hover:bg-sidebar-accent hover:text-sidebar-foreground/65"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-[12px] font-sans">Back to Arena</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
