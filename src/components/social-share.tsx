import { FacebookIcon, LinkedInIcon, XIcon } from "@/components/icons";

export function SocialShare({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const encodedUrl = encodeURIComponent(`https://newspressal.example${path}`);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "Share on X",
      icon: <XIcon className="h-4 w-4" />,
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
      icon: <FacebookIcon className="h-4 w-4" />,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Share on LinkedIn",
      icon: <LinkedInIcon className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-soft)]">
        Share
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
