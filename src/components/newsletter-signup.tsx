"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Unable to subscribe right now.");
        return;
      }

      setStatus("success");
      setMessage("You’re subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Unable to subscribe right now.");
    }
  }

  return (
    <section
      className={`rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        Newsletter
      </p>
      <h2
        className={`mt-3 max-w-sm font-semibold tracking-tight text-[var(--text-primary)] ${
          compact ? "text-[1.45rem] leading-[1.08]" : "text-2xl"
        }`}
      >
        Get the morning briefing before the market opens.
      </h2>
      <p className={`mt-3 text-[var(--text-muted)] ${compact ? "text-[13px] leading-6" : "text-sm"}`}>
        Sharp headlines, essential context, and the stories editors are watching next.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
        <span>Weekdays 6 a.m.</span>
        <span>Markets</span>
        <span>Politics</span>
      </div>
      <form
        className={`mt-5 ${compact ? "grid gap-3" : "space-y-3"}`}
        onSubmit={handleSubmit}
      >
        <div className={`${compact ? "grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" : "space-y-3"}`}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            aria-label="Email address"
            className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--site-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60 ${
              compact ? "sm:min-w-[8.5rem]" : "w-full"
            }`}
          >
            {status === "loading" ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>
      <p className={`mt-3 text-[var(--text-soft)] ${compact ? "text-[11px] leading-5" : "text-xs leading-5"}`}>
        By subscribing, you agree to receive editorial newsletters and product updates. We do not sell your data.
      </p>
      <p
        aria-live="polite"
        className={`mt-3 text-sm ${
          status === "success" ? "text-emerald-600" : "text-[var(--signal)]"
        }`}
      >
        {message}
      </p>
    </section>
  );
}
