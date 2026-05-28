type IconProps = {
  className?: string;
};

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function XIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 4h3.3l4.2 5.8L16.3 4H20l-6.5 7.5L20 20h-3.3l-4.6-6.2L7.1 20H4l6.8-7.9L4 4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M13.4 21v-7.3h2.5l.4-3h-2.9V8.8c0-.9.2-1.5 1.4-1.5h1.5V4.6c-.3 0-1.2-.1-2.4-.1-2.4 0-4.1 1.4-4.1 4.1v2.1H7.3v3h2.5V21h3.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6.1 8.2a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Zm-1.5 11V9.8h3v9.4h-3Zm6 0V9.8h2.9v1.3h.1c.4-.8 1.4-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v4.9h-3v-4.4c0-1.1 0-2.4-1.5-2.4s-1.7 1.2-1.7 2.3v4.5h-3.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
