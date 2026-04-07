import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminCommandPalette } from "./AdminCommandPalette";
import { AdminKeyboardShortcuts } from "./AdminKeyboardShortcuts";
import { ScrollToTop } from "@/components/ScrollToTop";

export function AdminLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full font-sans bg-background admin-sidebar-theme">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <AdminTopBar />
          <main className="flex-1 overflow-y-auto">
            <div key={location.pathname} className="animate-page-enter will-change-[transform,opacity]">
              <Outlet />
            </div>
            <ScrollToTop />
          </main>
        </SidebarInset>
      </div>
      <AdminCommandPalette />
      <AdminKeyboardShortcuts />
    </SidebarProvider>
  );
}
