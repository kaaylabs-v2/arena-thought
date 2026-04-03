import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full font-sans admin-sidebar-theme" style={{ backgroundColor: "#F5F0EA" }}>
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <AdminTopBar />
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
