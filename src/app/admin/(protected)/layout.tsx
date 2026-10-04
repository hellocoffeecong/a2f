import type { ReactNode } from "react";
import AdminBar from "@/components/admin/AdminBar";
import { requireAdmin } from "@/lib/auth/session";

// Every page under (protected) is authorized here on the server (signature + expiry).
// Admin Server Actions must still call requireAdmin() themselves.
// Pages here render the same presentation components as the public site; editing controls
// are added around them by composition (see CLAUDE.md §7C).
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { username } = await requireAdmin();
  return (
    <>
      <AdminBar username={username} />
      {children}
    </>
  );
}
