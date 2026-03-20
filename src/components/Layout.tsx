import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export function Layout() {
  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
