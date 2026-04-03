import { useWorkspace } from "@/context/WorkspaceContext";
import type { AdminRole } from "@/admin/data/mock-data";

// Mock admin auth — no localStorage, resets on refresh
export function useAdminAuth() {
  const { studioCurrentAdmin } = useWorkspace();
  const isAdmin = true; // hardcoded for demo
  const role: AdminRole = studioCurrentAdmin.role;

  return { isAdmin, role, admin: studioCurrentAdmin };
}
