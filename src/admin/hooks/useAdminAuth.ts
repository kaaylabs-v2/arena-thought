import { useState } from "react";
import { currentAdmin, type AdminRole } from "@/admin/data/mock-data";

// Mock admin auth — no localStorage, resets on refresh
export function useAdminAuth() {
  const [isAdmin] = useState(true); // hardcoded for demo
  const [role] = useState<AdminRole>(currentAdmin.role);

  return { isAdmin, role, admin: currentAdmin };
}
