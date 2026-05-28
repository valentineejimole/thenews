"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") {
      return "light";
    }

    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("newspressal-theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M12 3v2.2M12 18.8V21M5.64 5.64l1.56 1.56M16.8 16.8l1.56 1.56M3 12h2.2M18.8 12H21M5.64 18.36l1.56-1.56M16.8 7.2l1.56-1.56M15.5 12A3.5 3.5 0 1 1 8.5 12a3.5 3.5 0 0 1 7 0Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M20 15.4A8 8 0 1 1 8.6 4 6.4 6.4 0 0 0 20 15.4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
