import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/app/dashboard-shell";
import { getSession, getUserOrganization } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await getUserOrganization(session.user.id);
  if (!org) redirect("/onboarding");

  return <DashboardShell orgName={org.name}>{children}</DashboardShell>;
}
