import type { Metadata } from "next";
import { getSession, getUserOrganization } from "@/lib/auth-server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;
  const org = await getUserOrganization(session.user.id);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      <div className="rounded-lg border border-border bg-surface-elevated p-5 space-y-4 text-sm">
        <div>
          <p className="text-xs text-text-tertiary">Account</p>
          <p className="mt-1 font-medium">{session.user.name}</p>
          <p className="text-text-secondary">{session.user.email}</p>
        </div>
        {org && (
          <div>
            <p className="text-xs text-text-tertiary">Organization</p>
            <p className="mt-1 font-medium">{org.name}</p>
            <p className="font-mono text-xs text-text-tertiary">{org.slug}</p>
          </div>
        )}
      </div>
    </div>
  );
}
