import catalog from "./games-catalog.json";
import type { Game, RawGame, SessionLength, Difficulty } from "./types";
import { categoryColorVar } from "./categories";

/** Category accent hexes (mirror tokens.css --c-*) for gradient fallbacks. */
const CAT_HEX: Record<string, string> = {
  "--c-popular": "#ff4d7d", "--c-new": "#00b86b", "--c-puzzle": "#7c5cff", "--c-arcade": "#ff8a00",
  "--c-casual": "#00a8ff", "--c-sports": "#00b86b", "--c-racing": "#ff3d3d", "--c-action": "#ff4d7d",
  "--c-adventure": "#0abab3", "--c-strategy": "#1b3a63", "--c-board": "#8b5e34", "--c-word": "#00a8ff",
  "--c-brain": "#b16cff", "--c-math": "#0096ff", "--c-matching": "#ff5ac8", "--c-3d": "#7c5cff",
  "--c-hyper": "#b8f135", "--c-multiplayer": "#ffc531", "--aqua": "#0be0d0",
};

/** Small deterministic string hash (FNV-1a). Stable across server + client. */
function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function formatPlays(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
}

const SESSION: SessionLength[] = ["quick", "medium", "long"];
const DIFFICULTY: Difficulty[] = ["chill", "easy", "think", "hard"];

/** Deterministically enrich a raw catalog entry into a full Game. */
function enrich(raw: RawGame): Game {
  const h = hash(raw.slug);
  const h2 = hash(raw.slug + "#plays");
  const rating = Math.round((4.0 + (h % 90) / 100) * 10) / 10; // 4.0–4.89
  const playsNum = 45_000 + (h2 % 2_850_000);
  const colorVar = categoryColorVar(raw.category);

  return {
    ...raw,
    description:
      raw.hook +
      " Master bite-size levels, chase daily high scores and jump straight into the next round — perfect for a quick break or a long session, free in your browser with no download.",
    rating,
    plays: formatPlays(playsNum),
    playsNum,
    g1: CAT_HEX[colorVar] ?? "#0be0d0",
    g2: "#10233f",
    sessionLength: SESSION[h % SESSION.length],
    difficulty: DIFFICULTY[(h >> 3) % DIFFICULTY.length],
    isFeatured: raw.hasRealArt && raw.id <= 15, // surface real art on the hero mosaic
    isPopular: rating >= 4.4 || raw.id % 3 === 0,
    isNew: raw.id >= 47 || raw.id % 11 === 0,
    isTrending: h % 5 === 0,
    createdAt: new Date(2026, 0, 1 + (raw.id % 260)).toISOString(),
    externalStoreUrl:
      "https://play.google.com/store/apps/details?id=com.gamewhame." + raw.slug.replace(/-/g, ""),
  };
}

const GAMES: Game[] = (catalog.games as RawGame[]).map(enrich);
const BY_SLUG = new Map(GAMES.map((g) => [g.slug, g]));

/* ------------------------------------------------------------------ */
/* Public API — downstream agents build on these helpers.             */
/* ------------------------------------------------------------------ */

export function getAllGames(): Game[] {
  return GAMES;
}

export function getGameBySlug(slug: string): Game | undefined {
  return BY_SLUG.get(slug);
}

/** Games whose primary OR secondary category matches the label (case-insensitive). */
export function getGamesByCategory(label: string): Game[] {
  const l = label.toLowerCase();
  return GAMES.filter(
    (g) => g.category.toLowerCase() === l || g.categories.some((c) => c.toLowerCase() === l),
  );
}

export function getPopularGames(limit?: number): Game[] {
  const list = GAMES.filter((g) => g.isPopular).sort((a, b) => b.playsNum - a.playsNum);
  return limit ? list.slice(0, limit) : list;
}

export function getNewGames(limit?: number): Game[] {
  const list = GAMES.filter((g) => g.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const out = list.length ? list : GAMES.slice(-8);
  return limit ? out.slice(0, limit) : out;
}

export function getTrendingGames(limit?: number): Game[] {
  const list = GAMES.filter((g) => g.isTrending);
  return limit ? list.slice(0, limit) : list;
}

/**
 * Featured set for the hero mosaic — leads with real-art games so the top of
 * the page always shows finished thumbnails, then fills with the rest.
 */
export function getFeaturedGames(count = 12): Game[] {
  const real = GAMES.filter((g) => g.hasRealArt);
  const rest = GAMES.filter((g) => !g.hasRealArt);
  return [...real, ...rest].slice(0, count);
}

/**
 * Live fuzzy search — ported from the prototype's scoring (title/tag/category/
 * description weighting + rating tiebreak). Deterministic (no Math.random).
 */
export function searchGames(query: string): Game[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return GAMES.map((g) => {
    let s = 0;
    const t = g.title.toLowerCase();
    const d = g.description.toLowerCase();
    if (t === q) s += 120;
    if (t.startsWith(q)) s += 80;
    if (t.includes(q)) s += 60;
    words.forEach((w) => {
      if (t.includes(w)) s += 22;
      if (g.tags.some((tag) => tag.toLowerCase().includes(w))) s += 14;
      if (d.includes(w)) s += 6;
      if (g.category.toLowerCase() === w) s += 26;
      if (g.categories.some((c) => c.toLowerCase() === w)) s += 10;
    });
    s += g.rating * 2;
    return { g, s };
  })
    .filter((x) => x.s > 20)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.g);
}

/**
 * Related games (loop-B engine). Same weighting as the prototype but with a
 * deterministic hash tiebreak instead of Math.random, so SSR === CSR.
 */
export function getRelated(game: Game, n = 10): Game[] {
  return GAMES.filter((x) => x.slug !== game.slug)
    .map((o) => {
      let s = (hash(o.slug + game.slug) % 400) / 100; // 0–4 stable jitter
      if (o.category === game.category) s += 40;
      o.categories.forEach((c) => {
        if (game.categories.includes(c)) s += 12;
      });
      o.tags.forEach((tag) => {
        if (game.tags.includes(tag)) s += 3;
      });
      s += o.rating * 3;
      if (o.isPopular) s += 6;
      return { o, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.o);
}

export type SortKey = "popular" | "newest" | "rating" | "az";

export function sortGames(list: Game[], key: SortKey): Game[] {
  const copy = [...list];
  switch (key) {
    case "newest":
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "popular":
    default:
      return copy.sort((a, b) => b.playsNum - a.playsNum);
  }
}

export const TOTAL_GAMES = GAMES.length;
