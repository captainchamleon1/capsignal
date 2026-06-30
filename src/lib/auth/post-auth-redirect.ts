import { isAdminEmail } from "@/lib/admin";
import { db } from "@/lib/db";
import { getUserOrganization } from "@/lib/auth-server";
import { hasActiveSubscription } from "@/lib/auth/subscription";

/** Where to send a user immediately after sign-in or sign-up. */
export async function getPostAuthPath(userId: string, email: string): Promise<string> {
  if (isAdminEmail(email)) return "/admin";

  const org = await getUserOrganization(userId);
  if (org) return "/dashboard";

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  });

  if (hasActiveSubscription(user?.subscriptionStatus)) {
    return "/onboarding";
  }

  const lead = await db.lead.findFirst({
    where: { email: email.trim().toLowerCase() },
    orderBy: { createdAt: "desc" },
  });

  if (lead) return "/start/plan";

  return "/start#apply";
}
