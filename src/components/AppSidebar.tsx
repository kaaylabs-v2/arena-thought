import {
  Home,
  Library,
  BookOpen,
  Sparkles,
  BarChart3,
  Settings,
  User,
  Moon,
  Sun,
  ChevronLeft,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainNav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Library", url: "/library", icon: Library },
  { title: "Notebook", url: "/notebook", icon: BookOpen },
  { title: "Reflections", url: "/reflections", icon: Sparkles },
  { title: "Progress", url: "/progress", icon: BarChart3 },
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
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold font-sans">N²</span>
              </div>
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground">Nexus²</span>
            </div>
          )}
          {collapsed && (
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground text-xs font-bold font-sans">N²</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className="h-10 rounded-lg transition-colors duration-150"
                      >
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className="flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent"
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                          {!collapsed && (
                            <span className="text-sm font-sans">{item.title}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-sans text-xs">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  className="h-10 rounded-lg flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150"
                >
                  {theme === "light" ? (
                    <Moon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                  ) : (
                    <Sun className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                  )}
                  {!collapsed && <span className="text-sm font-sans">{theme === "light" ? "Dark mode" : "Light mode"}</span>}
                </SidebarMenuButton>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-sans text-xs">
                  Toggle theme
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className="h-10 rounded-lg transition-colors duration-150"
                >
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span className="text-sm font-sans">Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-sans text-xs">
                  Settings
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={toggleSidebar}
                  className="h-10 rounded-lg flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150"
                >
                  <ChevronLeft
                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                  {!collapsed && <span className="text-sm font-sans">Collapse</span>}
                </SidebarMenuButton>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-sans text-xs">
                  Expand
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
