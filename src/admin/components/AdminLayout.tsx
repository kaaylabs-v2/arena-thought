import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F5F0EA" }}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <AdminTopBar sidebarCollapsed={collapsed} />
      <main
        className={cn(
          "pt-14 min-h-screen transition-all duration-200",
          collapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
