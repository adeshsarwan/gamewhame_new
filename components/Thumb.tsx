"use client";

import { useState } from "react";
import Image from "next/image";
import type { Game } from "@/lib/types";
import { categoryColorVar } from "@/lib/categories";
import styles from "./Thumb.module.css";

/**
 * Thumbnail surface for a GameCard. Renders the real generated art via
 * next/image when the catalog says it exists; otherwise (or on load error)
 * paints a branded, category-tinted CSS gradient tile — never a broken image
 * (docs/04 placeholder spec). The card overlays the real title itself.
 */
// Display-only WebP sibling of the catalog PNG (~70%+ smaller, faster first
// paint). The catalog `game.thumb` (and every OG/Twitter/JSON-LD consumer)
// keeps pointing at the PNG on purpose — only this component's rendered
// <img> src prefers WebP, with an onError fallback chain back to the PNG and
// finally to the branded CSS placeholder.
function toWebp(pngPath: string): string {
  return pngPath.replace(/\.png$/i, ".webp");
}

export default function Thumb({
  game,
  sizes,
  priority = false,
}: {
  game: Game;
  sizes: string;
  priority?: boolean;
}) {
  // "webp" -> try the optimized sibling first; "png" -> webp failed, fall
  // back to the original catalog art; "error" -> both failed, show the CSS
  // placeholder only (never a broken image).
  const [source, setSource] = useState<"webp" | "png" | "error">("webp");
  const showArt = game.hasRealArt && !game.placeholder && source !== "error";
  const colorVar = categoryColorVar(game.category);
  const tileStyle = { ["--tile-c" as string]: `var(${colorVar})` } as React.CSSProperties;
  const artSrc = source === "png" ? game.thumb : toWebp(game.thumb);

  return (
    <span className={styles.wrap} style={tileStyle} aria-hidden>
      {/* Branded fallback always painted underneath — instant, zero CLS. */}
      <span className={styles.placeholder}>
        <span className={styles.glow} />
        <span className={styles.blob} />
        <span className={styles.dots} />
      </span>
      {showArt && (
        <Image
          className={styles.img}
          src={artSrc}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setSource((prev) => (prev === "webp" ? "png" : "error"))}
          draggable={false}
        />
      )}
    </span>
  );
}
