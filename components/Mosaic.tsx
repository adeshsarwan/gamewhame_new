"use client";

import { useEffect, useRef } from "react";
import type { Game, TileSize } from "@/lib/types";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import styles from "./Mosaic.module.css";

// Prototype fill pattern (docs/02 §1.2) — reused verbatim.
export const DEFAULT_PATTERN: TileSize[] = [
  "f", "s", "s", "t", "s", "w", "s", "s", "f", "s", "t", "w",
  "s", "m", "s", "m", "s", "w", "s", "t", "s", "s", "m", "s",
];

/**
 * Keeps `grid-auto-rows` equal to the (fluid) column width so a tile that spans
 * N columns also occupies N rows of the SAME size — i.e. every tile is an exact
 * square, at every breakpoint, whatever the container width. Pure CSS can't
 * read a `1fr` track's resolved px, so we measure it and feed it back as the
 * `--mosaic-row` custom property (falling back to the CSS default before hydration).
 */
function useSquareRows(ref: React.RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const first = parseFloat(getComputedStyle(el).gridTemplateColumns.split(" ")[0]);
      if (first > 0) el.style.setProperty("--mosaic-row", `${first}px`);
    };
    // Defer to the next frame so the first read happens after layout has settled
    // (avoids latching onto a transient pre-layout / pre-breakpoint track width).
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [ref]);
}

/**
 * Mosaic — the signature variable-size grid. Maps each game to an f/m/s size
 * token; every token spans EQUAL columns and rows so it renders as a square
 * (size variation via how many cells it spans), `grid-auto-flow:dense` packs the
 * gaps, and the top `priorityCount` tiles get next/image priority for a fast LCP.
 */
export default function Mosaic({
  games,
  pattern = DEFAULT_PATTERN,
  priorityCount = 4,
}: {
  games: Game[];
  pattern?: TileSize[];
  priorityCount?: number;
}) {
  const ref = useRef<HTMLUListElement>(null);
  useSquareRows(ref);
  return (
    <ul ref={ref} className={styles.grid}>
      {games.map((g, i) => {
        const size = pattern[i % pattern.length];
        return (
          <li key={g.slug} className={styles.cell} data-size={size}>
            <GameCard game={g} size={size} priority={i < priorityCount} context="mosaic" />
          </li>
        );
      })}
    </ul>
  );
}

/** Loading state — same footprint, zero CLS. */
export function MosaicSkeleton({ count = 12, pattern = DEFAULT_PATTERN }: { count?: number; pattern?: TileSize[] }) {
  const ref = useRef<HTMLUListElement>(null);
  useSquareRows(ref);
  return (
    <ul ref={ref} className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => {
        const size = pattern[i % pattern.length];
        return (
          <li key={i} className={styles.cell} data-size={size}>
            <GameCardSkeleton size={size} context="mosaic" />
          </li>
        );
      })}
    </ul>
  );
}
