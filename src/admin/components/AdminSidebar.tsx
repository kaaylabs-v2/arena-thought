import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  Megaphone,
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/components/ThemeProvider";
import { useWorkspace } from "@/context/WorkspaceContext";
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
import { AdminSidebarUserMenu } from "./AdminSidebarUserMenu";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Courses", url: "/admin/courses", icon: GraduationCap },
  { title: "People", url: "/admin/people", icon: Users },
  { title: "Insights", url: "/admin/insights", icon: BarChart3 },
  { title: "Communication", url: "/admin/communication", icon: MessageSquare },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const { theme, toggleTheme } = useTheme();
  const { directMessages } = useWorkspace();

  // Count unread messages from learners for admin
  const unreadCount = directMessages.filter(m => !m.read && m.fromRole === "learner").length;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-base tracking-tight text-sidebar-foreground leading-none">
              N²
            </span>
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
            >
              <ChevronsRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 px-1">
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">
                Nexus²
              </span>
              <button
                onClick={toggleSidebar}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
              >
                <ChevronsLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <span className="text-[10px] tracking-[0.15em] uppercase text-sidebar-foreground/50">
              Admin Studio
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 mt-2">
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
                      <span className="text-sm font-sans flex-1">{item.title}</span>
                      {item.title === "Communication" && unreadCount > 0 && (
                        <span className="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-accent text-accent-foreground text-[9px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={theme === "light" ? "Dark mode" : "Light mode"}
              className="rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              {theme === "light" ? (
                <Moon strokeWidth={1.5} />
              ) : (
                <Sun strokeWidth={1.5} />
              )}
              <span className="text-sm font-sans">
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <AdminSidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
