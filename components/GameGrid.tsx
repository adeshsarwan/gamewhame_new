import type { Game } from "@/lib/types";
import GameCard from "./GameCard";
import styles from "./GameGrid.module.css";

/**
 * GameGrid — responsive dense grid of square cards. Used by home category
 * sections and (downstream) category / search / favorites pages.
 */
export default function GameGrid({
  games,
  priorityCount = 0,
}: {
  games: Game[];
  priorityCount?: number;
}) {
  return (
    <ul className={styles.grid}>
      {games.map((g, i) => (
        <li key={g.slug} className={styles.cell}>
          <GameCard game={g} size="s" context="grid" priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
