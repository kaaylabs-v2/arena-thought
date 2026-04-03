import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BarChart3,
  Megaphone,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
  ChevronsLeft,
  ChevronsRight,
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/components/ThemeProvider";
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
  { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

      {/* Footer — theme toggle + back to arena + user menu */}
      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          {/* Theme toggle */}
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
              <span className="text-[13px] font-sans">
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User menu dropdown */}
        <AdminSidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
