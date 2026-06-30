import { Suspense } from "react";
import { SignupCreateClient } from "./signup-create-client";

export default function SignupCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-text-tertiary">
          Loading…
        </div>
      }
    >
      <SignupCreateClient />
    </Suspense>
  );
}
