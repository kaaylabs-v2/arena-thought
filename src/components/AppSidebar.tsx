import {
  Home,
  Library,
  BookOpen,
  Sparkles,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

const mainNav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Library", url: "/library", icon: Library },
  { title: "Notebook", url: "/notebook", icon: BookOpen },
  { title: "Reflections", url: "/reflections", icon: Sparkles },
  { title: "Progress", url: "/progress", icon: BarChart3 },
];

const bottomNav = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header: logo + collapse */}
      <SidebarHeader className="p-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "" : ""}`}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-soft shrink-0">
              <span className="text-primary-foreground text-[11px] font-bold font-sans tracking-tight">N²</span>
            </div>
            {!collapsed && (
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">Nexus²</span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </SidebarHeader>

      {/* Main nav */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="!h-[18px] !w-[18px]" strokeWidth={1.5} />
                      <span className="text-[13px] font-sans">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: theme, profile, settings */}
      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator />
        <SidebarMenu>
          {/* Theme toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={theme === "light" ? "Dark mode" : "Light mode"}
              className="rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              {theme === "light" ? (
                <Moon className="!h-[18px] !w-[18px]" strokeWidth={1.5} />
              ) : (
                <Sun className="!h-[18px] !w-[18px]" strokeWidth={1.5} />
              )}
              <span className="text-[13px] font-sans">{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile + Settings */}
          {bottomNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
                className="rounded-lg"
              >
                <NavLink
                  to={item.url}
                  className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="!h-[18px] !w-[18px]" strokeWidth={1.5} />
                  <span className="text-[13px] font-sans">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Collapse toggle in mini mode */}
          {collapsed && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleSidebar}
                tooltip="Expand"
                className="rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ChevronLeft className="!h-[18px] !w-[18px] rotate-180" strokeWidth={1.5} />
                <span className="text-[13px] font-sans">Expand</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
