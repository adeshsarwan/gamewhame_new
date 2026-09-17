"use client";

import { useState, type ReactNode } from "react";

/**
 * BrandImage — a plain <img> for generated brand art (mascot, category emblems)
 * that gracefully swaps to a React fallback (usually an <Icon> or <LogoMark>) if
 * the file has not been generated yet or fails to load. Keeps the layout intact
 * during the asset rollout: the parent reserves the box, this just fills it.
 *
 * These assets are decorative and already served pre-optimized as transparent
 * PNGs, so we skip next/image (and its optimizer config) on purpose.
 */
export default function BrandImage({
  src,
  alt = "",
  className,
  fallback,
  draggable = false,
  loading = "lazy",
  decorative = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  fallback: ReactNode;
  draggable?: boolean;
  loading?: "lazy" | "eager";
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      className={className}
      draggable={draggable}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
