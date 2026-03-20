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
      <SidebarHeader className={`${collapsed ? "px-2 py-4" : "px-4 py-4"}`}>
        {/* Top row: Logo + Collapse toggle */}
        <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between"}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground text-[11px] font-bold font-sans tracking-tight">N²</span>
              </div>
              <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">Nexus²</span>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground text-[11px] font-bold font-sans tracking-tight">N²</span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className={`h-7 w-7 flex items-center justify-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground transition-all duration-200 ${collapsed ? "" : ""}`}
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform duration-280 ease-out ${collapsed ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="font-sans text-xs">
                Expand
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </SidebarHeader>

      <SidebarContent className={`${collapsed ? "px-1.5" : "px-2"} mt-2`}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`${collapsed ? "space-y-1" : "space-y-0.5"}`}>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={`rounded-lg transition-all duration-200 ease-out ${collapsed ? "h-10 w-10 mx-auto flex items-center justify-center p-0" : "h-9"}`}
                      >
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} text-sidebar-foreground hover:bg-sidebar-accent/70`}
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className={`${collapsed ? "h-[18px] w-[18px]" : "h-[17px] w-[17px]"} shrink-0`} strokeWidth={1.5} />
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

      <SidebarFooter className={`${collapsed ? "px-1.5" : "px-2"} pb-4`}>
        {/* Separator */}
        <div className={`border-t border-sidebar-border ${collapsed ? "mx-1" : "mx-2"} mb-2`} />
        <SidebarMenu className={`${collapsed ? "space-y-1" : "space-y-0.5"}`}>
          {/* Theme toggle */}
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  onClick={toggleTheme}
                  className={`rounded-lg flex items-center transition-all duration-200 ease-out ${collapsed ? "h-10 w-10 mx-auto justify-center p-0" : "h-9 gap-3 px-3"} text-sidebar-foreground hover:bg-sidebar-accent/70`}
                >
                  {theme === "light" ? (
                    <Moon className={`${collapsed ? "h-[18px] w-[18px]" : "h-[17px] w-[17px]"} shrink-0`} strokeWidth={1.5} />
                  ) : (
                    <Sun className={`${collapsed ? "h-[18px] w-[18px]" : "h-[17px] w-[17px]"} shrink-0`} strokeWidth={1.5} />
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

          {/* Profile */}
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className={`rounded-lg transition-all duration-200 ease-out ${collapsed ? "h-10 w-10 mx-auto flex items-center justify-center p-0" : "h-9"}`}
                >
                  <NavLink
                    to="/profile"
                    className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} text-sidebar-foreground hover:bg-sidebar-accent/70`}
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <User className={`${collapsed ? "h-[18px] w-[18px]" : "h-[17px] w-[17px]"} shrink-0`} strokeWidth={1.5} />
                    {!collapsed && <span className="text-[13px] font-sans">Profile</span>}
                  </NavLink>
                </SidebarMenuButton>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-sans text-xs">
                  Profile
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>

          {/* Settings */}
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className={`rounded-lg transition-all duration-200 ease-out ${collapsed ? "h-10 w-10 mx-auto flex items-center justify-center p-0" : "h-9"}`}
                >
                  <NavLink
                    to="/settings"
                    className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"} text-sidebar-foreground hover:bg-sidebar-accent/70`}
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    <Settings className={`${collapsed ? "h-[18px] w-[18px]" : "h-[17px] w-[17px]"} shrink-0`} strokeWidth={1.5} />
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
