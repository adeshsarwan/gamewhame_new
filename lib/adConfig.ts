/**
 * Price Optimiser publisher configuration — the single source of truth for the
 * GameWhame ad integration. See `docs/PRICE-OPTIMISER.md` and the handoff doc
 * `skills/gamewhame-price-optimiser-publisher-handoff.md`.
 *
 * ARCHITECTURE RULE: Price Optimiser owns the GPT/GAM lifecycle. The publisher
 * only (a) loads the bundle once, (b) renders the managed DOM containers, and
 * (c) marks approved links as interstitial-eligible. There is deliberately NO
 * publisher-side googletag call, no slot definition, no refresh, no pricing
 * floor, no experiment and no Outstream anywhere in this codebase.
 */

/** Production Price Optimiser bundle. Exactly one <script> site-wide. */
export const PO_SCRIPT_SRC = "https://priceoptimiser1.thebesads.com/experiences/gamewhame.js";

/** Next.js <Script id> — Next dedupes by id, which guarantees one bootstrap. */
export const PO_SCRIPT_ID = "gamewhame-price-optimiser";

/** Canonical Price Optimiser site identity. Never www., never another site. */
export const PO_SITE_KEY = "gamewhame.com";

/** Origins worth warming up before the first ad request. */
export const PO_PRECONNECT_ORIGINS = [
  "https://priceoptimiser1.thebesads.com",
  "https://securepubads.g.doubleclick.net",
] as const;

/**
 * Publisher DOM ids Price Optimiser fills. Each id may appear AT MOST ONCE in
 * the live DOM — never render the same id twice on one route.
 */
export const MANAGED_SLOT_IDS = {
  leaderboard: "ad-leaderboard",
  incontent: "ad-incontent",
  results: "ad-results",
  anchor: "ad-anchor",
} as const;

export const adConfig = {
  /**
   * Sticky anchor. Desktop/tablet only by default: on phones the GameWhame
   * bottom nav already owns the bottom sticky strip, and stacking a 50px ad on
   * top of it eats ~110px of a small viewport — a direct hit to the P1
   * time-on-site metric. Flip `mobile` to true to also run 320x50 on phones
   * (the container already supports that size).
   */
  anchor: {
    enabled: true,
    mobile: false,
    /** Minimum viewport width (px) at which the anchor mounts. */
    minWidth: 768,
    /** Never mount the anchor on these route prefixes — it would sit over the game. */
    excludeRoutePrefixes: ["/play"] as string[],
  },

  /**
   * Results/completion placement. GameWhame has no real results or completion
   * screen (third-party game builds own their own end states and only a handful
   * emit `gw:gameover`), so `ad-results` is intentionally NOT rendered anywhere.
   */
  results: {
    enabled: false,
  },

  /**
   * Google web interstitial. Opt-in per link via `data-google-interstitial`.
   * Only game tile -> gameplay transitions qualify; never header/footer/legal/
   * external links. Price Optimiser owns when an opportunity actually fires —
   * the publisher never calls GPT for it.
   */
  interstitial: {
    enabled: true,
    /** ms during which a tile ignores further clicks, so one tap = one workflow. */
    clickGuardMs: 1200,
  },

  /**
   * Rewarded. Wired only to the existing player-initiated "watch to continue"
   * surface in the game-over panel (a genuine product reward). Never a gate to
   * start playing, never mid-run, never auto-opened.
   */
  rewarded: {
    enabled: true,
    /** Give up (and grant nothing) if the SDK never reaches a terminal state. */
    timeoutMs: 30000,
  },

  /** Outstream is disabled platform-side and must never be implemented here. */
  outstream: {
    enabled: false as const,
  },
} as const;
