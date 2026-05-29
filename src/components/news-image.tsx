"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/article-fallback.svg";

function isValidImageSrc(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const parsed = new URL(src);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function NewsImageInner({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = failedSrc === src ? FALLBACK_IMAGE : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) {
          setFailedSrc(src);
        }
      }}
    />
  );
}

export function NewsImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src?: string | null;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const trimmedSrc = src?.trim();
  const normalizedSrc =
    trimmedSrc && isValidImageSrc(trimmedSrc) ? trimmedSrc : FALLBACK_IMAGE;

  if (process.env.NODE_ENV !== "production" && trimmedSrc && normalizedSrc === FALLBACK_IMAGE) {
    console.warn(`NewsImage received an invalid src: ${trimmedSrc}`);
  }

  return (
    <NewsImageInner
      src={normalizedSrc}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
