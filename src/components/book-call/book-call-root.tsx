"use client";

import { BookCallProvider } from "./book-call-context";

export function BookCallRoot({ children }: { children: React.ReactNode }) {
  return <BookCallProvider>{children}</BookCallProvider>;
}
