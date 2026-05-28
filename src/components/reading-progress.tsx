"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const nextProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent">
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_70%,white))] transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
