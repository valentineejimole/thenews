import Image from "next/image";
import { AdminLoginForm } from "@/components/admin-login-form";
import { buildAdminMetadata } from "@/lib/admin";

export const metadata = buildAdminMetadata("Login", "/admin/login");

const accessPoints = [
  "Draft review and live publishing",
  "Scheduling, SEO, and visual packaging",
  "Secure staff-only editorial workflow",
];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/admin") ? params.next : "/admin/dashboard";

  return (
    <div className="page-shell min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(179,143,69,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(23,48,79,0.16),transparent_32%),linear-gradient(180deg,#fffdf9_0%,#f6efe4_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[88rem] items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2.25rem] border border-[var(--border-subtle)] bg-[color:var(--surface-raised)] shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[linear-gradient(160deg,rgba(179,143,69,0.18),rgba(255,255,255,0.92)_45%,rgba(23,48,79,0.08)_100%)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                Editorial CMS
              </span>
              <div className="mt-6 flex items-center gap-4">
                <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.35rem] border border-[var(--border-subtle)] bg-white p-1.5 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="NewsPressal logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    priority
                  />
                </span>
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                    NewsPressal
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Independent. Insightful. In real time.
                  </p>
                </div>
              </div>

              <h1 className="mt-8 max-w-[12ch] text-[clamp(2.7rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[var(--text-primary)]">
                Secure access for editors and newsroom staff.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)]">
                Enter the publishing workspace to manage live coverage, package stories for release,
                and keep the front page moving with precision.
              </p>

              <div className="mt-8 grid gap-3">
                {accessPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.35rem] border border-[var(--border-subtle)] bg-white/80 px-4 py-3"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute -right-10 top-10 h-44 w-44 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_20%,white)] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-32 rounded-full bg-[rgba(23,48,79,0.1)] blur-3xl" />
          </section>

          <section className="flex items-center p-5 sm:p-7 lg:p-10">
            <div className="mx-auto w-full max-w-md rounded-[1.9rem] border border-[var(--border-subtle)] bg-white/92 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="border-b border-[var(--border-subtle)] pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Editorial CMS
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Sign in
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Staff access to the NewsPressal publishing desk.
                </p>
              </div>

              <div className="mt-6">
                <AdminLoginForm nextPath={nextPath} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
