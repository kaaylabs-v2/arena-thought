import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, GraduationCap, Users, BarChart3, MessageSquare,
  Settings, HelpCircle, UserPlus, Rocket, Bell,
} from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command";
import { useWorkspace } from "@/context/WorkspaceContext";

const adminPages = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Courses", url: "/admin/courses", icon: GraduationCap },
  { title: "People", url: "/admin/people", icon: Users },
  { title: "Insights", url: "/admin/insights", icon: BarChart3 },
  { title: "Communication", url: "/admin/communication", icon: MessageSquare },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Help", url: "/admin/help", icon: HelpCircle },
];

const quickActions = [
  { title: "Invite Members", url: "/admin/people", icon: UserPlus },
  { title: "Deploy Course", url: "/admin/courses", icon: Rocket },
  { title: "New Announcement", url: "/admin/communication", icon: Bell },
];

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { studioMembers, studioCourses } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, members, courses…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {adminPages.map((page) => (
            <CommandItem key={page.url} onSelect={() => go(page.url)}>
              <page.icon className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span>{page.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem key={action.title} onSelect={() => go(action.url)}>
              <action.icon className="mr-2 h-4 w-4 text-accent" strokeWidth={1.5} />
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Members">
          {studioMembers.slice(0, 6).map((member) => (
            <CommandItem key={member.id} onSelect={() => go("/admin/people")}>
              <div className="mr-2 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-medium bg-accent/15 text-accent">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <span>{member.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{member.department}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Courses">
          {studioCourses.filter(c => c.status === "active").slice(0, 5).map((course) => (
            <CommandItem key={course.id} onSelect={() => go("/admin/courses")}>
              <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <span>{course.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{course.enrolledCount} enrolled</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
