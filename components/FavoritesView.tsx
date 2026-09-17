"use client";

// Favorites (docs/02 §3.5) — client-driven, never reads localStorage during
// render. The server shell (app/favorites/page.tsx) renders this with no
// props; it hydrates in useEffect and stays live via FAVS_EVENT so toggling a
// heart anywhere in the app updates this page immediately.
import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites, FAVS_EVENT } from "@/lib/favorites";
import { getGameBySlug, getPopularGames } from "@/lib/games";
import type { Game } from "@/lib/types";
import GameGrid from "./GameGrid";
import GameRail from "./GameRail";
import GameCardSkeleton from "./GameCardSkeleton";
import AdSlot from "./AdSlot";
import Icon from "./Icon";
import styles from "./FavoritesView.module.css";

const SKELETON_COUNT = 6;

/** Broken-heart illustration for the empty state. No emoji. */
function EmptyHeartArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden focusable="false">
      <circle cx="60" cy="60" r="60" fill="#ffe9ef" />
      <path
        d="M60 88C60 88 26 65.6 26 42.8 26 30.6 35.6 21 47 21c6.4 0 12.2 3.3 17 9.4 4.8-6.1 10.6-9.4 17-9.4 11.4 0 21 9.6 21 21.8 0 4-1 7.8-2.8 11.4"
        stroke="var(--pink)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M64 46 54 62l12 4-10 16"
        stroke="var(--navy)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FavoritesView() {
  const [games, setGames] = useState<Game[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      const favs = getFavorites();
      const list = [...favs].map((slug) => getGameBySlug(slug)).filter((g): g is Game => Boolean(g));
      setGames(list);
      setReady(true);
    }
    sync();
    window.addEventListener(FAVS_EVENT, sync);
    return () => window.removeEventListener(FAVS_EVENT, sync);
  }, []);

  return (
    <>
      <Link href="/" className={styles.back}>
        <Icon name="arrowLeft" size={18} /> Home
      </Link>

      <h1 className={styles.h1}>
        <span className={styles.chip}>
          <Icon name="heart" weight="fill" size={20} color="#fff" />
        </span>
        My Favorites <small>{ready ? `${games.length} saved on this device` : " "}</small>
      </h1>

      {!ready ? (
        <ul className={styles.skeletonGrid} aria-hidden>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <li key={i}>
              <GameCardSkeleton size="s" context="grid" />
            </li>
          ))}
        </ul>
      ) : games.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <GameGrid games={games} />
          {games.length >= 6 && (
            <div className={styles.adWrap}>
              <AdSlot variant="display" height={110} />
            </div>
          )}
        </>
      )}
    </>
  );
}

function EmptyState() {
  const popular = getPopularGames(10);
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.empty}>
        <EmptyHeartArt />
        <h2>No favorites yet</h2>
        <p>Tap the heart on any tile to save it here — no account needed.</p>
        <div className={styles.emptyCtas}>
          <Link href="/" className={styles.ctaPrimary}>
            Find games to love
            <Icon name="caretRight" size={16} />
          </Link>
          <Link href="/games/popular" className={styles.ctaGhost}>
            Browse categories
          </Link>
        </div>
      </div>
      <GameRail title="Browse popular games" icon="flame" games={popular} seeAllHref="/games/popular" />
    </div>
  );
}
