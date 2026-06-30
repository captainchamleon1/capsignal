"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";

type AuthPanelProps = {
  next?: string;
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm text-text-primary outline-none focus:border-text-tertiary";

export function AuthPanel({ next }: AuthPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterAuth() {
    if (next?.startsWith("/admin")) {
      router.push(next);
      router.refresh();
      return;
    }
    if (next && next !== "/dashboard" && !next.startsWith("/auth/continue")) {
      router.push(next);
      router.refresh();
      return;
    }
    router.push("/auth/continue");
    router.refresh();
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.signIn.email({
      email,
      password,
      callbackURL: next ?? "/auth/continue",
    });

    setLoading(false);
    if (err) {
      setError(err.message ?? "Sign in failed");
      return;
    }
    await afterAuth();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10">
      <Container className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo href="/" className="justify-center" size="lg" />
          <h1 className="mt-8 text-xl font-semibold text-text-primary">Sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Access your investor pipeline and raise profile
          </p>
        </div>

        <form
          onSubmit={onSignIn}
          className="space-y-4 rounded-xl border border-border bg-surface-elevated p-6"
        >
          {error ? (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}
          <div>
            <label htmlFor="signin-email" className="text-xs font-medium text-text-secondary">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="signin-password" className="text-xs font-medium text-text-secondary">
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border" />
          </div>
          <p className="relative flex justify-center text-xs uppercase tracking-wide text-text-tertiary">
            <span className="bg-surface-page px-3">New here?</span>
          </p>
        </div>

        <Button variant="secondary" href="/start#apply" className="w-full">
          Create account
        </Button>
        <p className="mt-3 text-center text-xs text-text-tertiary">
          Start with your free raise profile — no password needed yet.
        </p>
      </Container>
    </div>
  );
}
