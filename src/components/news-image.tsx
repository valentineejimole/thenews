"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/article-fallback.svg";

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
  const [imageSrc, setImageSrc] = useState(src);

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
          setImageSrc(FALLBACK_IMAGE);
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
  const normalizedSrc = src?.trim() || FALLBACK_IMAGE;

  return (
    <NewsImageInner
      key={normalizedSrc}
      src={normalizedSrc}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
