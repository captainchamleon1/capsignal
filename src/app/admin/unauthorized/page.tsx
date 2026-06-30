import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";

export const metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Container className="w-full max-w-md text-center">
        <Logo href="/" className="justify-center" />
        <h1 className="mt-8 text-xl font-semibold text-text-primary">Admin access required</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your account is signed in but not on the admin allowlist. Ask the team to add your email
          to <code className="text-xs">ADMIN_EMAILS</code> in Vercel.
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link href="/dashboard" className="text-text-primary underline-offset-2 hover:underline">
            Go to dashboard
          </Link>
          <Link href="/login?next=/admin" className="text-text-secondary underline-offset-2 hover:underline">
            Sign in with another account
          </Link>
        </div>
      </Container>
    </div>
  );
}
