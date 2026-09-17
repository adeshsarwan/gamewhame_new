/**
 * Favorites persistence — localStorage only, no account (docs/02 §3.5).
 * Key: `gw_favs` = JSON array of slugs. All reads are SSR-safe (guarded) and
 * dispatch a `gw-favs-changed` event so the header count + cards stay in sync.
 */
const KEY = "gw_favs";
export const FAVS_EVENT = "gw-favs-changed";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function write(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new CustomEvent(FAVS_EVENT));
  } catch {
    /* storage blocked (private mode) — degrade silently */
  }
}

export function getFavorites(): Set<string> {
  return read();
}

export function isFavorite(slug: string): boolean {
  return read().has(slug);
}

export function favoriteCount(): number {
  return read().size;
}

/** Toggle a slug; returns the new active state. */
export function toggleFavorite(slug: string): boolean {
  const set = read();
  let active: boolean;
  if (set.has(slug)) {
    set.delete(slug);
    active = false;
  } else {
    set.add(slug);
    active = true;
  }
  write(set);
  return active;
}
