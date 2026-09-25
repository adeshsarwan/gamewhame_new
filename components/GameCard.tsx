"use client";

import Link from "next/link";
import type { Game, TileSize } from "@/lib/types";
import Thumb from "./Thumb";
import FavoriteButton from "./FavoriteButton";
import { PlayTriangle } from "./BrandMarks";
import { cardConfig } from "@/lib/cardConfig";
import { useInterstitialLink } from "./useInterstitialLink";
import styles from "./GameCard.module.css";

export interface GameCardProps {
  game: Game;
  size?: TileSize;
  priority?: boolean;
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
 * GameCard — the core tile. Real art (or branded placeholder), favorite
 * button, gradient meta bar (title + category), and a hover play overlay.
 * Links straight to /play/[slug] (loop A entry) and is the site's approved
 * Google web-interstitial opportunity (game tile -> gameplay). See
 * useInterstitialLink — the publisher only marks the link, Price Optimiser owns
 * the ad lifecycle.
 */
export default function GameCard({
  game,
  size = "s",
  priority = false,
  showFav = true,
  context = "mosaic",
}: GameCardProps) {
  const comingSoon = !game.playUrl && !game.gameUrl;
  // "Coming soon" tiles do not lead to gameplay, so they are not an approved
  // interstitial opportunity.
  const interstitial = useInterstitialLink(!comingSoon);
  return (
    <Link
      href={`/play/${game.slug}`}
      {...interstitial}
      className={styles.card}
      data-size={size}
      data-context={context}
      data-caption={cardConfig.showTitle || cardConfig.showCategory ? "true" : "false"}
      aria-label={`${game.title} — ${game.category} game`}
    >
      <span className={styles.art}>
        <Thumb game={game} sizes={SIZES[size]} priority={priority} />
        <span className={styles.shine} aria-hidden />
      </span>

      {showFav && cardConfig.showFavorite && (
        <span className={styles.fav}>
          <FavoriteButton slug={game.slug} title={game.title} />
        </span>
      )}

      {comingSoon && <span className={styles.ribbon}>Soon</span>}

      {(cardConfig.showTitle || cardConfig.showCategory) && (
        <span className={styles.meta}>
          {cardConfig.showTitle && <b className={styles.title}>{game.title}</b>}
          {cardConfig.showCategory && <small className={styles.sub}>{game.category}</small>}
        </span>
      )}

      <span className={styles.hover} aria-hidden>
        {cardConfig.showCategory && <span className={styles.hoverTop}>{game.category}</span>}
        <span className={styles.playPill}>
          <PlayTriangle size={14} color="#fff" />
          PLAY
        </span>
      </span>
    </Link>
  );
}
