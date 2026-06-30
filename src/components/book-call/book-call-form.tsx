"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, X } from "lucide-react";
import { raiseMovement } from "@/lib/content/raise-movement";
import { getBookCallSlots } from "@/lib/book-call/slots";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type BookCallFormProps = {
  onSuccess?: () => void;
  className?: string;
};

export function BookCallForm({ onSuccess, className }: BookCallFormProps) {
  const slots = getBookCallSlots();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [slotId, setSlotId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slotId) {
      setError("Pick a time that works for you.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          slotId,
          notes: notes || undefined,
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={cn("text-center py-6", className)}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-brand/30 bg-brand/10">
          <Calendar className="h-5 w-5 text-brand" aria-hidden="true" />
        </div>
        <p className="display-serif mt-5 text-xl font-semibold text-text-primary">Request sent</p>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
          {raiseMovement.bookCall.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-text-secondary">Name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input w-full"
            placeholder="Alex Chen"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-text-secondary">Work email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input w-full"
            placeholder="alex@company.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-text-secondary">
          Company <span className="text-text-tertiary">(optional)</span>
        </span>
        <input
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="field-input w-full"
          placeholder="Acme AI"
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-xs font-medium text-text-secondary">
          Pick a time · {raiseMovement.bookCall.duration}
        </legend>
        <div className="grid max-h-[220px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSlotId(slot.id)}
              className={cn(
                "min-h-[44px] border px-3 py-2.5 text-left text-sm transition-colors",
                slotId === slot.id
                  ? "border-brand bg-brand/10 text-text-primary"
                  : "border-border bg-surface-page text-text-secondary hover:border-border-strong hover:bg-surface-muted",
              )}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-text-secondary">
          Anything we should know? <span className="text-text-tertiary">(optional)</span>
        </span>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="field-input w-full resize-none"
          placeholder="Stage, sector, timeline…"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={submitting}
        className="min-h-[48px] w-full bg-brand border-brand hover:bg-brand/90"
      >
        {submitting ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

type BookCallModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BookCallModal({ open, onClose }: BookCallModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-call-title"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden border border-border bg-surface-elevated shadow-[0_40px_120px_-24px_rgba(0,0,0,0.45)] sm:max-h-[min(88vh,720px)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">
              {raiseMovement.bookCall.duration}
            </p>
            <h2 id="book-call-title" className="display-serif mt-2 text-xl font-semibold text-text-primary">
              {raiseMovement.bookCall.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {raiseMovement.bookCall.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <BookCallForm />
        </div>
      </div>
    </div>,
    document.body,
  );
}
