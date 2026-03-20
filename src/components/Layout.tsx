import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { WorkspaceProvider, useWorkspace } from "@/context/WorkspaceContext";

function LayoutInner() {
  const { appSettings } = useWorkspace();

  const fontScale =
    appSettings.fontSize === "small" ? "0.9" :
    appSettings.fontSize === "large" ? "1.12" : "1";

  const fontFamilyClass =
    appSettings.fontFamily === "sans" ? "font-family-sans" :
    appSettings.fontFamily === "serif" ? "font-family-serif" :
    appSettings.fontFamily === "dyslexic" ? "font-family-dyslexic" : "";

  return (
    <SidebarProvider>
      <div
        className={`min-h-screen flex w-full ${appSettings.compactMode ? "compact-mode" : ""} ${fontFamilyClass}`}
        style={{ '--font-scale': fontScale } as React.CSSProperties}
      >
        <AppSidebar />
        <main className="flex-1 min-w-0 font-scaled">
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
