"use client";

import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE = "/article-fallback.svg";

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
  const [imageSrc, setImageSrc] = useState(src?.trim() || FALLBACK_IMAGE);

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
