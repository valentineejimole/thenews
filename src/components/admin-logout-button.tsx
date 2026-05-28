"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      Log out
    </button>
  );
}
