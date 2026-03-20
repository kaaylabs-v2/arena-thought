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
      <SidebarHeader className="p-4 pb-6">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground text-[10px] font-bold font-sans tracking-tight">N²</span>
              </div>
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">Nexus²</span>
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center mx-auto shadow-soft">
              <span className="text-primary-foreground text-[10px] font-bold font-sans tracking-tight">N²</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className="h-9 rounded-lg transition-all duration-200 ease-out"
                      >
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className="flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/70"
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.5} />
                          {!collapsed && (
                            <span className="text-[13px] font-sans">{item.title}</span>
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

      <SidebarFooter className="px-2 pb-4 space-y-0.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  className="h-9 rounded-lg flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/70 transition-all duration-200 ease-out"
                >
                  {theme === "light" ? (
                    <Moon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.5} />
                  ) : (
                    <Sun className="h-[17px] w-[17px] shrink-0" strokeWidth={1.5} />
                  )}
                  {!collapsed && <span className="text-[13px] font-sans">{theme === "light" ? "Dark mode" : "Light mode"}</span>}
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
                  className="h-9 rounded-lg transition-all duration-200 ease-out"
                >
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/70"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <Settings className="h-[17px] w-[17px] shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span className="text-[13px] font-sans">Settings</span>}
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
                  className="h-9 rounded-lg flex items-center gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/70 transition-all duration-200 ease-out"
                >
                  <ChevronLeft
                    className={`h-[17px] w-[17px] shrink-0 transition-transform duration-280 ease-out ${collapsed ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                  {!collapsed && <span className="text-[13px] font-sans">Collapse</span>}
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
