import {
  Home,
  Library,
  BookOpen,
  Sparkles,
  BarChart3,
  Moon,
  Sun,
  ChevronsLeft,
  ChevronsRight,
  ListChecks,
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
import { SidebarUserMenu } from "@/components/SidebarUserMenu";

const mainNav = [
  { title: "Home", url: "/", icon: Home },
  { title: "Library", url: "/library", icon: Library },
  { title: "Study Plan", url: "/study-plan", icon: ListChecks },
  { title: "Notebook", url: "/notebook", icon: BookOpen },
  { title: "Progress", url: "/progress", icon: BarChart3 },
  { title: "Reflections", url: "/reflections", icon: Sparkles },
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
      {/* Header — logo + collapse toggle */}
      <SidebarHeader className="px-2 py-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-base tracking-tight text-sidebar-foreground leading-none">N²</span>
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200"
            >
              <ChevronsRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-1">
            <span className="font-serif text-lg tracking-tight text-sidebar-foreground leading-none">Nexus²</span>
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

      {/* Footer — theme toggle + user menu */}
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
              <span className="text-[13px] font-sans">{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
