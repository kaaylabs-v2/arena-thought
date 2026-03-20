import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { WorkspaceProvider, useWorkspace } from "@/context/WorkspaceContext";

function LayoutInner() {
  const { appSettings } = useWorkspace();

  const fontSizeClass =
    appSettings.fontSize === "small" ? "text-[13px]" :
    appSettings.fontSize === "large" ? "text-[17px]" : "text-[15px]";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${appSettings.compactMode ? "compact-mode" : ""} ${fontSizeClass}`}>
        <AppSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

export function Layout() {
  return (
    <WorkspaceProvider>
      <LayoutInner />
    </WorkspaceProvider>
  );
}
