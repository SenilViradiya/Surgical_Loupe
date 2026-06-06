"use client";

import { useState } from "react";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
}

const PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Xn6kAAAAASUVORK5CYII=";

export default function FallbackImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false);
  const imageSrc = !src || errored ? PLACEHOLDER : src;

  return (
    // use a simple img to ensure predictable onError behavior in tests/dev
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      draggable={false}
    />
  );
}
