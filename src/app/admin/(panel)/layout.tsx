import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
}
