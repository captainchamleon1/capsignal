"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (err) {
      setLoading(false);
      setError(err.message ?? "Sign up failed");
      return;
    }

    // Bootstrap org via onboarding
    sessionStorage.setItem("capsignal_onboarding_company", company || name);
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
      <Container className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo href="/" className="justify-center" />
          <h1 className="mt-8 text-xl font-semibold text-text-primary">Create account</h1>
          <p className="mt-2 text-sm text-text-secondary">Start reaching investors today</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface-elevated p-6">
          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <div>
            <label htmlFor="name" className="text-xs font-medium text-text-secondary">
              Your name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="company" className="text-xs font-medium text-text-secondary">
              Company
            </label>
            <input
              id="company"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium text-text-secondary">
              Password (8+ characters)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface-page px-3 py-2 text-sm"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-text-primary underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </Container>
    </div>
  );
}
