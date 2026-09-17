"use client";

import Link from "next/link";
import type { Game, TileSize } from "@/lib/types";
import Thumb from "./Thumb";
import RatingBadge from "./RatingBadge";
import FavoriteButton from "./FavoriteButton";
import Icon from "./Icon";
import { PlayTriangle } from "./BrandMarks";
import styles from "./GameCard.module.css";

export interface GameCardProps {
  game: Game;
  size?: TileSize;
  priority?: boolean;
  showRating?: boolean;
  showFav?: boolean;
  context?: "mosaic" | "rail" | "grid";
}

// Responsive sizes hint per tile role — keeps next/image from over-fetching.
const SIZES: Record<TileSize, string> = {
  f: "(max-width:767px) 92vw, (max-width:1199px) 40vw, 34vw",
  w: "(max-width:767px) 92vw, (max-width:1199px) 40vw, 34vw",
  t: "(max-width:767px) 46vw, (max-width:1199px) 20vw, 16vw",
  m: "(max-width:767px) 46vw, (max-width:1199px) 22vw, 17vw",
  s: "(max-width:767px) 46vw, (max-width:1199px) 22vw, 17vw",
};

/**
 * GameCard — the core tile. Real art (or branded placeholder), rating badge,
 * favorite button, gradient meta bar, and a hover play overlay. Links straight
 * to /play/[slug] (loop A entry).
 */
export default function GameCard({
  game,
  size = "s",
  priority = false,
  showRating = true,
  showFav = true,
  context = "mosaic",
}: GameCardProps) {
  const comingSoon = game.playUrl === null;
  return (
    <Link
      href={`/play/${game.slug}`}
      className={styles.card}
      data-size={size}
      data-context={context}
      aria-label={`${game.title} — ${game.category} game, rated ${game.rating.toFixed(1)}`}
    >
      <span className={styles.art}>
        <Thumb game={game} sizes={SIZES[size]} priority={priority} />
        <span className={styles.shine} aria-hidden />
      </span>

      {showRating && (
        <span className={styles.rate}>
          <RatingBadge rating={game.rating} />
        </span>
      )}

      {showFav && (
        <span className={styles.fav}>
          <FavoriteButton slug={game.slug} title={game.title} />
        </span>
      )}

      {comingSoon && <span className={styles.ribbon}>Soon</span>}

      <span className={styles.meta}>
        <b className={styles.title}>{game.title}</b>
        <small className={styles.sub}>
          {game.category} <span className={styles.dot}>·</span>
          <Icon name="users" size={11} className={styles.subIcon} /> {game.plays}
        </small>
      </span>

      <span className={styles.hover} aria-hidden>
        <span className={styles.hoverTop}>
          <Icon name="star" weight="fill" size={12} color="var(--yellow)" />
          {game.rating.toFixed(1)} <span className={styles.dot}>·</span> {game.category}
        </span>
        <span className={styles.playPill}>
          <PlayTriangle size={14} color="#fff" />
          PLAY
        </span>
      </span>
    </Link>
  );
}
