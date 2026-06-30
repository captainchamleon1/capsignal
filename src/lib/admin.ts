import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";

export function adminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ??
    "hello@getcapsignal.com,christianfm801@gmail.com";
  return [...new Set(raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean))];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

export function isLikelyTestLead(email: string, company?: string | null): boolean {
  const lower = email.toLowerCase();
  const co = (company ?? "").trim().toLowerCase();
  return (
    lower.endsWith("@example.com") ||
    lower.endsWith("@test.com") ||
    lower === "a@a.com" ||
    co === "a" ||
    co === "aa" ||
    lower.includes("qa-test")
  );
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/admin");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/admin/unauthorized");
  }
  return session;
}
