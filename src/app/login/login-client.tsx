"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.signIn.email({
      email,
      password,
      callbackURL: next,
    });

    setLoading(false);
    if (err) {
      setError(err.message ?? "Sign in failed");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Container className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo href="/" className="justify-center" />
          <h1 className="mt-8 text-xl font-semibold text-text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">Access your investor pipeline</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface-elevated p-6">
          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-text-tertiary"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-text-tertiary"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          No account?{" "}
          <Link href="/signup" className="text-text-primary underline-offset-2 hover:underline">
            Create one
          </Link>
        </p>
      </Container>
    </div>
  );
}
