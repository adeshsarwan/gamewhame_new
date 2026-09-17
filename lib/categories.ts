import type { CategoryDef, IconName } from "./types";

/**
 * Category bar order + metadata (docs/02 §3.0). "Popular" and "New Games" are
 * virtual rows computed from flags rather than stored on games.
 */
export const CATEGORIES: CategoryDef[] = [
  { label: "Popular", slug: "popular", colorVar: "--c-popular", icon: "flame", blurb: "The games everyone is playing right now.", virtual: true },
  { label: "New Games", slug: "new", colorVar: "--c-new", icon: "sparkle", blurb: "Fresh drops added to the arcade.", virtual: true },
  { label: "Puzzle", slug: "puzzle", colorVar: "--c-puzzle", icon: "puzzle", blurb: "Clever boards and brain-teasing logic." },
  { label: "Arcade", slug: "arcade", colorVar: "--c-arcade", icon: "gamepad", blurb: "Fast, snappy, one-more-run classics." },
  { label: "Casual", slug: "casual", colorVar: "--c-casual", icon: "coffee", blurb: "Easy-going games for a quick break." },
  { label: "Sports", slug: "sports", colorVar: "--c-sports", icon: "trophy", blurb: "Hoops, goals and buzzer-beaters." },
  { label: "Racing", slug: "racing", colorVar: "--c-racing", icon: "car", blurb: "Drift, dodge and hit the throttle." },
  { label: "Action", slug: "action", colorVar: "--c-action", icon: "flame", blurb: "Reflex-testing thrills and chases." },
  { label: "Adventure", slug: "adventure", colorVar: "--c-adventure", icon: "target", blurb: "Explore, escape and uncover treasure." },
  { label: "Strategy", slug: "strategy", colorVar: "--c-strategy", icon: "swords", blurb: "Plan, defend and out-think the board." },
  { label: "Board", slug: "board", colorVar: "--c-board", icon: "dice", blurb: "Classic tabletop games, reimagined." },
  { label: "Word", slug: "word", colorVar: "--c-word", icon: "tag", blurb: "Spell, search and connect letters." },
  { label: "Brain", slug: "brain", colorVar: "--c-brain", icon: "lightning", blurb: "Train focus, memory and logic." },
  { label: "Math", slug: "math", colorVar: "--c-math", icon: "grid", blurb: "Numbers, merges and quick sums." },
  { label: "Matching", slug: "matching", colorVar: "--c-matching", icon: "sparkle", blurb: "Swap, pop and chain sweet combos." },
  { label: "3D", slug: "3d", colorVar: "--c-3d", icon: "gamepad", blurb: "Depth, drift and dimensional play." },
  { label: "Hyper Casual", slug: "hyper-casual", colorVar: "--c-hyper", icon: "lightning", blurb: "Tap, time and beat your best." },
  { label: "Multiplayer", slug: "multiplayer", colorVar: "--c-multiplayer", icon: "users", blurb: "Play together, party-game style." },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));
const BY_LABEL = new Map(CATEGORIES.map((c) => [c.label.toLowerCase(), c]));

/** "Hyper Casual" -> "hyper-casual", "3D" -> "3d". */
export function categorySlug(label: string): string {
  const known = BY_LABEL.get(label.toLowerCase());
  if (known) return known.slug;
  return label.toLowerCase().replace(/\s+/g, "-");
}

export function categoryBySlug(slug: string): CategoryDef | undefined {
  return BY_SLUG.get(slug.toLowerCase());
}

export function categoryByLabel(label: string): CategoryDef | undefined {
  return BY_LABEL.get(label.toLowerCase());
}

/** Accent color var for a category label, falling back to the aqua brand. */
export function categoryColorVar(label: string): string {
  return categoryByLabel(label)?.colorVar ?? "--aqua";
}

export function categoryIcon(label: string): IconName {
  return categoryByLabel(label)?.icon ?? "tag";
}
