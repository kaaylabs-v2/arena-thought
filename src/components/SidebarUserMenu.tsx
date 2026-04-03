import {
  Settings,
  LogOut,
  Languages,
  HelpCircle,
  ExternalLink,
  ChevronUp,
  User,
  Keyboard,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";

export function SidebarUserMenu() {
  const { userProfile, appSettings, updateAppSettings, userRole, setUserRole } = useWorkspace();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const initials = userProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    toast.success("Logged out", { description: "See you next time." });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-200 active:scale-[0.97] outline-none ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary/70 text-[11px] font-sans font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-[13px] font-sans font-medium truncate w-full text-left">
                  {userProfile.name}
                </span>
                <span className="text-[11px] font-sans text-sidebar-foreground/40 truncate w-full text-left">
                  Free plan
                </span>
              </div>
              <ChevronUp className="h-3.5 w-3.5 text-sidebar-foreground/30 shrink-0" strokeWidth={1.5} />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={collapsed ? "right" : "top"}
        align="start"
        sideOffset={8}
        className="w-56 rounded-xl"
      >
        {/* Header */}
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary/70 text-[12px] font-sans font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[13px] font-sans font-medium text-foreground truncate">{userProfile.name}</p>
              <p className="text-[11px] font-sans text-muted-foreground truncate">{userProfile.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Role Switcher */}
        <DropdownMenuItem
          className="gap-2.5 px-3 py-2 cursor-pointer"
          onClick={() => {
            const newRole = userProfile.name.includes("Sarah") ? "learner" : "admin";
            const { setUserRole } = require("@/context/WorkspaceContext") as any;
          }}
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[13px] font-sans">
            Switch to {userProfile.name.includes("Sarah") ? "Learner" : "Admin"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 px-3 py-2 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[13px] font-sans">Profile</span>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          className="gap-2.5 px-3 py-2 cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[13px] font-sans">Settings</span>
        </DropdownMenuItem>

        {/* Language */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2.5 px-3 py-2 cursor-pointer">
            <Languages className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[13px] font-sans">Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={8} className="w-48 rounded-xl">
              {[
                { value: "English", label: "English" },
                { value: "Spanish", label: "Español" },
                { value: "French", label: "Français" },
                { value: "German", label: "Deutsch" },
                { value: "Portuguese", label: "Português" },
                { value: "Japanese", label: "日本語" },
                { value: "Chinese", label: "中文" },
                { value: "Korean", label: "한국어" },
                { value: "Arabic", label: "العربية" },
                { value: "Hindi", label: "हिन्दी" },
              ].map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  className="gap-2.5 px-3 py-2 cursor-pointer justify-between"
                  onClick={() => {
                    updateAppSettings({ language: lang.value });
                    toast.success(`Language set to ${lang.label}`);
                  }}
                >
                  <span className="text-[13px] font-sans">{lang.label}</span>
                  {appSettings.language === lang.value && (
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Get Help */}
        <DropdownMenuItem
          className="gap-2.5 px-3 py-2 cursor-pointer"
          onClick={() => toast.info("Help center coming soon")}
        >
          <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[13px] font-sans">Get help</span>
        </DropdownMenuItem>

        {/* Learn More — submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2.5 px-3 py-2 cursor-pointer">
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[13px] font-sans">Learn more</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={8} className="w-48 rounded-xl">
              <DropdownMenuItem
                className="gap-2.5 px-3 py-2 cursor-pointer"
                onClick={() => window.open("#", "_blank")}
              >
                <span className="text-[13px] font-sans">About Nexus²</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2.5 px-3 py-2 cursor-pointer"
                onClick={() => window.open("#", "_blank")}
              >
                <span className="text-[13px] font-sans">Tutorials</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2.5 px-3 py-2 cursor-pointer"
                onClick={() => {
                  toast.info(
                    "Keyboard Shortcuts",
                    {
                      description: "⌘B Toggle sidebar · Enter Send message · ⇧Enter New line · ⌘S Save to notebook · ⌘⇧T Toggle theme",
                      duration: 8000,
                    }
                  );
                }}
              >
                <Keyboard className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-[13px] font-sans">Keyboard shortcuts</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2.5 px-3 py-2 cursor-pointer"
                onClick={() => window.open("#", "_blank")}
              >
                <span className="text-[13px] font-sans">Usage policy</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2.5 px-3 py-2 cursor-pointer"
                onClick={() => window.open("#", "_blank")}
              >
                <span className="text-[13px] font-sans">Privacy policy</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="gap-2.5 px-3 py-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-[13px] font-sans">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
