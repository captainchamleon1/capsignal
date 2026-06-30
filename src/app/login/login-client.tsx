"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? undefined;

  return <AuthPanel next={next} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-text-tertiary">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
