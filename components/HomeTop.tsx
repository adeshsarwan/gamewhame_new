"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Game } from "@/lib/types";
import GameCard from "./GameCard";
import Icon from "./Icon";
import styles from "./HomeTop.module.css";

const RECENT_KEY = "gw_recent";

/**
 * HomeTop — the big-tile strip that opens the games-first home (docs/10).
 * Server-renders the "Featured" fallback so the top is never empty and there is
 * zero layout shift; after mount it reads the `gw_recent` MRU list and, when the
 * visitor has history, swaps in "Continue playing" with the same tile geometry.
 */
export default function HomeTop({
  featured,
  all,
  leadWidget,
}: {
  featured: Game[];
  all: Game[];
  /** Optional widget rendered as the first cell of the row (e.g. the mascot tile). */
  leadWidget?: ReactNode;
}) {
  const [recent, setRecent] = useState<Game[]>([]);

  useEffect(() => {
    const bySlug = new Map(all.map((g) => [g.slug, g]));
    function load() {
      try {
        const raw = window.localStorage.getItem(RECENT_KEY);
        const slugs: string[] = raw ? JSON.parse(raw) : [];
        setRecent(slugs.map((s) => bySlug.get(s)).filter((g): g is Game => Boolean(g)));
      } catch {
        setRecent([]);
      }
    }
    load();
    window.addEventListener("gw-recent-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gw-recent-changed", load);
      window.removeEventListener("storage", load);
    };
  }, [all]);

  const hasRecent = recent.length >= 1;
  const games = (hasRecent ? recent : featured).slice(0, 9);

  return (
    <section className={styles.wrap} aria-label={hasRecent ? "Continue playing" : "Featured games"}>
      <div className={styles.head}>
        <h2 className={styles.title}>
          <Icon
            name={hasRecent ? "clock" : "flame"}
            weight="fill"
            size={20}
            color={hasRecent ? "var(--aqua-2)" : "var(--pink)"}
          />
          {hasRecent ? "Continue playing" : "Featured games"}
        </h2>
        <Link href="/games/popular" className={styles.seeAll}>
          See all
          <Icon name="caretRight" size={16} />
        </Link>
      </div>

      <ul className={`${styles.row} gw-noscrollbar`}>
        {leadWidget && (
          <li className={styles.cell} aria-hidden={false}>
            {leadWidget}
          </li>
        )}
        {games.map((g, i) => (
          <li key={g.slug} className={styles.cell}>
            <GameCard game={g} size="f" context="grid" priority={i < 4} />
          </li>
        ))}
      </ul>
    </section>
  );
}
