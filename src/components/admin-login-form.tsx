"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setMessage("Supabase environment variables are missing. Set .env.local before signing in.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("error");
      setMessage("Supabase client could not be created.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="editor@newspressal.example"
          className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-white px-4 py-3.5 text-sm text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-white px-4 py-3.5 text-sm text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--accent)_16%,transparent)]"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 rounded-full bg-[var(--text-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--site-bg)] shadow-[0_14px_30px_rgba(15,23,42,0.16)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Signing in..." : "Enter CMS"}
      </button>
      <p
        aria-live="polite"
        className={`min-h-[1.5rem] text-sm ${
          status === "error" ? "text-[var(--signal)]" : "text-emerald-700"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
