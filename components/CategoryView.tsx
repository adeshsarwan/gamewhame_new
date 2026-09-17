"use client";

import { useMemo, useState } from "react";
import { sortGames, type SortKey } from "@/lib/games";
import type { Game } from "@/lib/types";
import GameGrid from "./GameGrid";
import CategoryPill from "./CategoryPill";
import Icon from "./Icon";
import styles from "./CategoryView.module.css";

const BATCH = 24;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most Popular" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Highest Rated" },
  { key: "az", label: "A-Z" },
];

export interface SubFilter {
  label: string;
  colorVar: string;
}

/**
 * CategoryView — the interactive lower half of the category page: secondary
 * tag pills, a sort select, the dense "all games" grid and client-side
 * "Load more" batching. All games for the category are already on the page
 * (52-game catalog), so filtering/sorting/paging is instant, no refetch.
 */
export default function CategoryView({ games, subFilters }: { games: Game[]; subFilters: SubFilter[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("popular");
  const [visible, setVisible] = useState(BATCH);

  const filtered = useMemo(() => {
    if (!filter) return games;
    const f = filter.toLowerCase();
    return games.filter((g) => g.category.toLowerCase() === f || g.categories.some((c) => c.toLowerCase() === f));
  }, [games, filter]);

  const sorted = useMemo(() => sortGames(filtered, sortKey), [filtered, sortKey]);
  const shown = sorted.slice(0, visible);
  const remaining = sorted.length - shown.length;

  function selectFilter(label: string | null) {
    setFilter(label);
    setVisible(BATCH);
  }
  function selectSort(key: SortKey) {
    setSortKey(key);
    setVisible(BATCH);
  }

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.pills} role="group" aria-label="Filter by tag">
          <CategoryPill label="All" href="" active={filter === null} onClick={() => selectFilter(null)} />
          {subFilters.map((s) => (
            <CategoryPill
              key={s.label}
              label={s.label}
              href=""
              color={s.colorVar}
              active={filter === s.label}
              onClick={() => selectFilter(s.label)}
            />
          ))}
        </div>

        <label className={styles.sort}>
          <span className={styles.sortLabel}>Sort by</span>
          <span className={styles.selectWrap}>
            <select
              value={sortKey}
              onChange={(e) => selectSort(e.target.value as SortKey)}
              className={styles.select}
              aria-label="Sort games"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="caretDown" size={14} className={styles.caret} />
          </span>
        </label>
      </div>

      {shown.length ? (
        <>
          <GameGrid games={shown} />
          {remaining > 0 && (
            <div className={styles.loadMoreWrap}>
              <button type="button" className={styles.loadMore} onClick={() => setVisible((v) => v + BATCH)}>
                Load more games
                <span className={styles.remaining}>{remaining} more</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.noMatch}>
          <Icon name="search" size={26} color="var(--muted-2)" />
          <p>No games match this filter.</p>
          <button type="button" className={styles.clearBtn} onClick={() => selectFilter(null)}>
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
