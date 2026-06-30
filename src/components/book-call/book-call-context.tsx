"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { BookCallModal } from "./book-call-form";

type BookCallContextValue = {
  open: boolean;
  openBookCall: () => void;
  closeBookCall: () => void;
};

const BookCallContext = createContext<BookCallContextValue | null>(null);

export function BookCallProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openBookCall = useCallback(() => setOpen(true), []);
  const closeBookCall = useCallback(() => setOpen(false), []);

  return (
    <BookCallContext.Provider value={{ open, openBookCall, closeBookCall }}>
      {children}
      <BookCallModal open={open} onClose={closeBookCall} />
    </BookCallContext.Provider>
  );
}

export function useBookCall() {
  const ctx = useContext(BookCallContext);
  if (!ctx) {
    throw new Error("useBookCall must be used within BookCallProvider");
  }
  return ctx;
}

/** Safe hook when provider may be absent (e.g. funnel shell). */
export function useBookCallOptional() {
  return useContext(BookCallContext);
}
