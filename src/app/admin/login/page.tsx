import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminShell } from "@/components/admin-shell";
import { buildAdminMetadata } from "@/lib/admin";

export const metadata = buildAdminMetadata("Login", "/admin/login");

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/admin") ? params.next : "/admin/dashboard";

  return (
    <AdminShell
      title="Newsroom access"
      description="Sign in to manage drafts, schedule stories, and prepare articles for publication."
    >
      <div className="mx-auto max-w-md rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-6">
        <AdminLoginForm nextPath={nextPath} />
        <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
          Sign in is backed by Supabase Auth. Create your initial newsroom user in the Supabase
          dashboard, then elevate the matching profile role to `admin` or `editor`.
        </p>
      </div>
    </AdminShell>
  );
}
