/**
 * GameWhame shared types.
 * Downstream agents (play / category / search / favorites) import from here —
 * do not redefine the Game shape locally.
 */

export type TileSize = "f" | "t" | "w" | "m" | "s";

export type SessionLength = "quick" | "medium" | "long";
export type Difficulty = "chill" | "easy" | "think" | "hard";

/** Raw shape as stored in `lib/games-catalog.json` (mirror of data/games-catalog.json). */
export interface RawGame {
  id: number;
  title: string;
  slug: string;
  category: string;
  categories: string[];
  tags: string[];
  hook: string;
  thumb: string;
  hasRealArt: boolean;
  playUrl: string | null;
  placeholder: boolean;
  /**
   * Absolute URL of an externally-hosted playable build (e.g. a Unity WebGL
   * game served same-origin from the games CDN). When set, the play page mounts
   * the metadata-driven player instead of the local `playUrl` iframe. Optional so
   * the 52-game lean catalog stays unchanged for every non-ported title.
   */
  gameUrl?: string | null;
  /**
   * Engine of the externally-hosted build. Drives which player component mounts
   * on `/play/[slug]`. Currently only `"unity-webgl"`; future engines add a value
   * here and the player switches on it — no per-game code.
   */
  engine?: "unity-webgl" | null;
}

/**
 * Enriched game consumed by every component. The canonical catalog is lean, so
 * social-proof + personalization fields are derived deterministically from the
 * slug/id (see `lib/games.ts`) — same value on server and client, so zero
 * hydration mismatch and no runtime randomness.
 */
export interface Game extends RawGame {
  /** SEO/body copy (hook expanded). */
  description: string;
  /** 4.0–4.9, one decimal. */
  rating: number;
  /** Formatted play count, e.g. "1.2M". */
  plays: string;
  /** Numeric play count for sorting. */
  playsNum: number;
  /** Gradient frame fallback (also drives the branded placeholder tile). */
  g1: string;
  g2: string;
  /** Personalization attributes (tagged at ingestion in a fuller build). */
  sessionLength: SessionLength;
  difficulty: Difficulty;
  /** Mosaic / row placement flags. */
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  isTrending: boolean;
  createdAt: string;
  /** Honest store fallback while the browser build is pending. */
  externalStoreUrl: string;
}

export interface CategoryDef {
  /** Display label, e.g. "Hyper Casual". */
  label: string;
  /** URL segment, e.g. "hyper-casual". */
  slug: string;
  /** CSS custom-property name for the accent, e.g. "--c-puzzle". */
  colorVar: string;
  /** Local <Icon> name for the section chip / pill. */
  icon: IconName;
  /** Short description used on category banners. */
  blurb: string;
  /** Virtual categories (Popular / New) are computed, not stored on games. */
  virtual?: boolean;
}

/** All icon names in the local SVG set (see components/Icon.tsx). */
export type IconName =
  | "search"
  | "heart"
  | "play"
  | "fullscreen"
  | "share"
  | "reload"
  | "soundOn"
  | "soundOff"
  | "flag"
  | "menu"
  | "close"
  | "home"
  | "gamepad"
  | "user"
  | "caretLeft"
  | "caretRight"
  | "caretDown"
  | "arrowLeft"
  | "star"
  | "users"
  | "calendar"
  | "tag"
  | "devices"
  | "lightning"
  | "flame"
  | "sparkle"
  | "puzzle"
  | "coffee"
  | "bell"
  | "crown"
  | "info"
  | "trophy"
  | "clock"
  | "plus"
  | "check"
  | "grid"
  | "target"
  | "dice"
  | "swords"
  | "car";
