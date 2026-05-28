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
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="editor@newspressal.example"
          className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--site-bg)] transition hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Signing in..." : "Sign in"}
      </button>
      <p
        aria-live="polite"
        className={`text-sm ${status === "error" ? "text-[var(--signal)]" : "text-[var(--text-muted)]"}`}
      >
        {message || "Use your Supabase Auth email and password to access the newsroom."}
      </p>
    </form>
  );
}
