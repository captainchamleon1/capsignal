import { db } from "@/lib/db";

export async function markUserSubscribed(email: string, status: "trialing" | "active") {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  return db.user.updateMany({
    where: { email: normalized },
    data: { subscriptionStatus: status },
  });
}

export function hasActiveSubscription(status: string | null | undefined) {
  return status === "trialing" || status === "active";
}
