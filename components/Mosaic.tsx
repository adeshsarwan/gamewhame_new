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
 * Mosaic — the signature variable-size grid. Maps each game to an f/t/w/m/s
 * token, `grid-auto-flow:dense` packs the gaps, and the top `priorityCount`
 * tiles get next/image priority for a fast LCP.
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
  return (
    <ul className={styles.grid}>
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
  return (
    <ul className={styles.grid}>
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
